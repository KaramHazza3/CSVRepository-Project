import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { FilesService } from '../../files.service';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  @Output() fileUploaded = new EventEmitter<File>();
  selectedFile!: File;

  constructor(private snackBar: MatSnackBar , private readonly filesService: FilesService) {


  }

  hasPermission: boolean = true;
  currentPermission: string = "";
  async checkCurrentPermission(){
      const user = await Auth.currentAuthenticatedUser();
      this.currentPermission = user.signInUserSession.accessToken.payload['cognito:groups'];
    if(this.currentPermission == "Readers")
    this.hasPermission = false;
  }

  ngOnInit(): void {
    this.checkCurrentPermission();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
      this.filesService.uploadFile(this.selectedFile);
  }

}