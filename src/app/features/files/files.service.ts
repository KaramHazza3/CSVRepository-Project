import {Injectable} from '@angular/core';
import {map, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {MatSnackBar} from '@angular/material/snack-bar';

export interface MyFile {
  name: string;
  size: number;
}

interface FileResponse {
  S3files: MyFile[];
}

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  private baseUrl = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient ,private snackBar: MatSnackBar) {
  }

  /**
   * Saves a CSV files to the server.
   * @param file The CSV files to save.
   * @returns An Observable that emits the saved files object.
   */
  saveFile(file: File): Observable<MyFile> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<MyFile>(`${this.baseUrl}/save`, formData);
  }

  /**
   * Deletes a CSV files from the server.
   * @param fileId The ID of the files to delete.
   * @returns An Observable that emits the deleted files object.
   */
  deleteFile(fileName: string): Observable<MyFile> {
    return this.http.delete<MyFile>(`${this.baseUrl}DeleteFile?fileName=${fileName.split('.')[0]}`);
  }


  /**
   * Retrieves a list of CSV files from the server.
   * @returns An Observable that emits an array of files objects.
   */
  getFiles(): Observable<MyFile[]> {
    return this.http.get<FileResponse>(`${this.baseUrl}`).pipe(
      map(response => response.S3files.map(file => ({
        name: file.name,
        size: file.size
      })))
    );
  }

  /**
   * Downloads a CSV files from the server.
   * @param file The files to download.
   * @returns An Observable that emits the files content.
   */
  downloadFile(file: MyFile): Observable<any> {
    return this.http.get(`${this.baseUrl}Download?fileName=${file.name.split('.')[0]}`, { responseType: 'text' }).pipe(
      map(response => response)

    );
  }

  /**
   * Converts a CSV files to JSON.
   * @param file The files to convert.
   * @returns An Observable that emits the files content.
   */
  convertToJson(file: MyFile): Observable<any> {
    return this.http.get(`${this.baseUrl}ShowFile?fileName=${file.name.split('.')[0]}`)
  }

  uploadFile(file: File) {
    const fileReader = new FileReader(); 
    fileReader.readAsBinaryString(file);

      fileReader.onload = () => {
        this.http.post<string>(`${this.baseUrl}UploadFile?fileName=${file.name.split('.')[0]}`, fileReader.result).subscribe({
      next: (response) => {
        console.log(response);
        this.snackBar.open('File uploaded successfully', 'Close', {duration: 2000});
      },
      error: (error) => {
        console.log(error);
        this.snackBar.open('File upload failed', 'Close', {duration: 2000});
      } 
    })}}
}


