import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.css']
})
export class UploadDialogComponent implements OnInit {

  fileToUpload: File = null;
  fileName: string = null;
  public files: UploadFile[] = [];


  afuConfig = {
    uploadAPI: {
      url:"http://localhost:3000/file/uploadFile"
    },
    hideProgressBar: false,
};

  constructor(private elem:ElementRef, public dialogRef: MatDialogRef<UploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.fileName = this.fileToUpload.name
  }

  onButtonClick(choice:string): void {

    if(choice!='cancel')
    {
      this.dialogRef.close(this.fileToUpload);
    }
    else
    this.dialogRef.close(null);

  }


 public dropped(event: UploadEvent) {
   this.files = event.files;

   for (const droppedFile of event.files) {

     // Is it a file?
     if (droppedFile.fileEntry.isFile) {
       const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
       fileEntry.file((file: File) => {

         // Here you can access the real file
         console.log(droppedFile.relativePath, file);
         this.fileToUpload = file;
         this.fileName = file.name;

         /**
         // You could upload it like this:
         const formData = new FormData()
         formData.append('logo', file, relativePath)

         // Headers
         const headers = new HttpHeaders({
           'security-token': 'mytoken'
         })

         this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
         .subscribe(data => {
           // Sanitized logo returned from backend
         })
         **/

       });
     } else {
       // It was a directory (empty directories are added, otherwise only files)
       const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
       console.log(droppedFile.relativePath, fileEntry);
     }
   }
 }

   public fileOver(event){
      console.log(event);
    }

    public fileLeave(event){
      console.log(event);
    }

}
