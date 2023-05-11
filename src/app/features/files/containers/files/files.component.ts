import {Component} from '@angular/core';
import {FilesService, MyFile} from "../../files.service";

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent {
  isLoading: boolean = false;
  files: MyFile[] = [];

  constructor(private readonly _fileService: FilesService) {
  }

  uploadFile(file: File): void {
    this.isLoading = true;
    this._fileService.saveFile(file).subscribe(
      {
        next: () => this.files,
        error: error => console.error(error),
        complete: () => this.isLoading = false
      }
    );
  }
}
