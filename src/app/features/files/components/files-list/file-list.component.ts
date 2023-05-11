import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FilesService, MyFile} from "../../files.service";
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-files-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {
  files: MyFile[] = [];
  @Output() uploadedFiles = new EventEmitter<MyFile[]>();
  displayedColumns: string[] = ['name', 'size', 'actions'];
  isLoading:boolean = false;

  constructor(private fileService: FilesService) {
  }

  hasPermission: boolean = false;
  permissions:string = " " ;

  async checkCurrentPermission(){
    const user = await Auth.currentAuthenticatedUser();
      this.permissions = user.signInUserSession.accessToken.payload['cognito:groups'];
    if(this.permissions=="Admins")
    this.hasPermission = true;
  }

  ngOnInit(): void {
    this.getFiles();
    this.checkCurrentPermission();
  }

  getFiles(): void {
    this.isLoading = true;
    this.fileService.getFiles().subscribe({
        next: files => this.files = files,
        error: error => console.error(error),
        complete: () => this.isLoading = false
      });
    this.uploadedFiles.emit(this.files);
  }

  downloadFile(file: MyFile): void {
    this.isLoading = true;
    this.fileService.downloadFile(file).subscribe({
        next: data => {
          console.log(data);
          const link = document.createElement('a');
          const json = JSON.parse(data);
          link.href = json.downloadUrl;
          console.log(json.downloadUrl);
          link.download = file.name;
          link.click();
        },
        error: error => console.error(error),
        complete: () => this.isLoading = false
      });
  }

  deleteFile(file: MyFile): void {
    this.isLoading = true;
    this.fileService.deleteFile(file.name).subscribe(
      {
        next: () => this.getFiles(),
        error: error => console.error(error),
        complete: () => this.isLoading = false
      }
    );
  }


  
  convertToJson(file: MyFile): void {
    this.isLoading = true;
    this.fileService.convertToJson(file).subscribe({
      next: response => {
        const json = response;
        const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
    link.href = url;
    link.download = `${file.name}.json`;
    link.click();
    this.getFiles();
      },
      error: error => {
        console.error(error);
      },
      complete: () => this.isLoading = false
    });
    }


}
