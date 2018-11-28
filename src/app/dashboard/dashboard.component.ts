import { Component, OnInit, Inject } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { FileDialogComponent } from '../file-dialog/file-dialog.component';
import { UploadDialogComponent } from '../upload-dialog/upload-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { DashboardService } from '../dashboard.service';

import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';





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


export interface FileUploadObj {
  file:File,
  path:string
}



  export interface userIdObj{
    userId: string
  }


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
  fileUploadObj: FileUploadObj = null;
  userIdObj:userIdObj;
  contentObj: UserObj[] = null;

  // [
  //   {
  //     userId:'srini',
  //     type:'image',
  //     name:'upload.jpg',
  //   },
  //   {
  //     userId:'srini',
  //     type:'file',
  //     name:'upload.txt',
  //   },{
  //     userId:'srini',
  //     type:'folder',
  //     name:'upload',
  //   }
  // ]


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
                           if(response!=null)
                           {
                             console.log('--------->',response);
                             console.log(response);
                             this.empty=false;
                             this.contentObj = response.fileData;
                             this.currentPath = response.fileData[0].file;

                           }
                           else
                           {
                             console.log('inside else',response);
                             this.empty = true;
                           }

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
      width:'650px'
    })

    dialogRef.afterClosed().subscribe(result => {

      if(result!=null)
      {

        console.log(result);

        this.fileUploadObj = {
          file:result,
          path:this.currentPath
        }

        this.dashboardservice.postFile(result)
                             .subscribe((event:any)=>{
                                  console.log('<-------->',event);
                                  this.getFileData();
                               // console.log('--------->',result);
                               // this.contentObj = result.fileData;
                             });
      }

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
                           if(response!=null)
                           {
                             this.contentObj = response.fileData;
                             this.contentObj = response.fileData;
                           }
                           else{
                             this.empty = true;
                           }

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
