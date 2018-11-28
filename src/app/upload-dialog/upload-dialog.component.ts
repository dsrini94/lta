import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.css']
})
export class UploadDialogComponent implements OnInit {

  fileToUpload: File = null;
  fileName: string = null;

  afuConfig = {
    uploadAPI: {
      url:"https://example-file-upload-api"
    }
};

  constructor(private elem:ElementRef, public dialogRef: MatDialogRef<UploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.fileName = this.fileToUpload.name

    // let files = this.elem.nativeElement.querySelector('#myfile');
    //
    // console.log('----->',files);
    //
    // let formData = new FormData();
    // let file = files[0];
    // formData.append('myfile',file,file.name);
    // this.fileToUpload = formData;

  }

  onButtonClick(choice:string): void {

    if(choice!='cancel')
    {
      this.dialogRef.close(this.fileToUpload);
    }
    else
    this.dialogRef.close(null);

  }

}
