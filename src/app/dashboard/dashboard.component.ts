import { Component, OnInit, Inject } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { FileDialogComponent } from '../file-dialog/file-dialog.component';
import { UploadDialogComponent } from '../upload-dialog/upload-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { DashboardService } from '../dashboard.service';



export interface UserObj {
  userId: string,
  type: string,
  name: string,
};

export interface FileObj {
  file:string,
  name: string,
  size:number,
  mtime:string,
  type:string
}

<<<<<<< HEAD
export interface FileUploadObj {
  file:File,
  path:string
}

=======
 
  export interface userIdObj{
    userId: string
  }
>>>>>>> 921811915f0a93ca914bd7da93d33c47fb7bef79

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  userId: string = null;
  empty: boolean = false;
  type: string = null;
  name: string = null;
  userObj: UserObj = null;
  selectedObj: FileObj;
  currentPath: string = null;
<<<<<<< HEAD
  fileUploadObj: FileUploadObj = null;
=======
  userIdObj:userIdObj;
>>>>>>> 921811915f0a93ca914bd7da93d33c47fb7bef79
  contentObj: UserObj[] = [
    {
      userId:'srini',
      type:'image',
      name:'upload.jpg',
    },
    {
      userId:'srini',
      type:'file',
      name:'upload.txt',
    },{
      userId:'srini',
      type:'folder',
      name:'upload',
    }
  ]


  constructor(private location: Location,private router: Router, private activatedRoute: ActivatedRoute,public dialog: MatDialog,private dashboardservice:DashboardService) { }

  ngOnInit() {
    this.getUserId();
    this.getFileData();
  }

  getFileData():void {
    this.userIdObj={
     userId:this.userId
      }
    this.dashboardservice.getDirectories(this.userIdObj)
                         .subscribe((response:any) => {
                           this.empty=false;
                          this.contentObj = response.fileData;
                         });
  }

  getUserId(): void {
    console.log();
     this.userId = this.activatedRoute.snapshot.paramMap.get('userId');
  }

  openDialog(type): void {
    this.type = type;

    const dialogRef = this.dialog.open(FileDialogComponent, {
      width:'350px',
      data:{
        type:type
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result != null){

        this.userObj = {
          userId: this.userId,
          name: result,
          type: this.type
        };

        this.dashboardservice.createFile(this.userObj)
                             .subscribe((response:any) => {
                               if(response!=null)
                               {
                                 this.empty = false;
                                 this.currentPath = response.fileData[0].file;
                                 this.contentObj = response.fileData;
                               }
                             });
      }
    });

  }

  openUploadDialog(): void {
    const dialogRef = this.dialog.open(UploadDialogComponent ,{
      width:'350px'
    })

    dialogRef.afterClosed().subscribe(result => {
<<<<<<< HEAD
        this.fileUploadObj = {
          file:result,
          path:this.currentPath
        }

        this.dashboardservice.postFile(this.fileUploadObj)
                             .subscribe((result:any)=>{
                               console.log(result);
                             })
=======
      this.dashboardservice.postFile(result).subscribe((response:any)=>{
        console.log(response);
      })
>>>>>>> 921811915f0a93ca914bd7da93d33c47fb7bef79
    });
  }

  confirmDialog():void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,{
      width:'350px'
    })

    dialogRef.afterClosed().subscribe(result => {
          if(result!=null)
            this.handleDeleteFile();
    })
  }

  handleDeleteFile():void {

    this.dashboardservice.deleteFile(this.selectedObj)
                         .subscribe((response:any) => {
<<<<<<< HEAD
                           this.contentObj = response.fileData;
=======
                          this.contentObj = response.fileData;
>>>>>>> 921811915f0a93ca914bd7da93d33c47fb7bef79
                         });
  }

  handleLogout(): void {
    this.location.back();
  }

  handleSelect(selectedObj: FileObj):void {
    this.selectedObj = selectedObj;
  }

  selectFolder(selectedFolder: FileObj):void {
    console.log(selectedFolder);
  }
}
