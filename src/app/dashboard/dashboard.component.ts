import { Component, OnInit, Inject } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { FileDialogComponent } from '../file-dialog/file-dialog.component';
import { UploadDialogComponent } from '../upload-dialog/upload-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { DashboardService } from '../dashboard.service';

import { HttpClientModule, HttpClient, HttpRequest, HttpEvent ,HttpEventType, HttpResponse } from '@angular/common/http';


export interface UserObj {
  userId: string,
  type: string,
  name: string,
  path: string,
};

export interface FileObj {
  file:string,
  name: string,
  size:number,
  mtime:string,
  type:string,
  path:string
}


export interface FileUploadObj {
  file:File,
  path:string
}

  export interface userIdObj{
    userId: string,
    //path: string
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
  color = 'primary';
  mode = 'determinate';
  value = 0;
  loadingMsg:string = "";
  backButtonDisable: boolean = true;
  getdata():string { 
    return this.dashboardservice.path; 
  } 

  setdata(value: string) { 
    this.dashboardservice.path = value; 
  } 
  // contentObj = [
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


  constructor(private http: HttpClient,private location: Location,private router: Router, private activatedRoute: ActivatedRoute,public dialog: MatDialog,private dashboardservice:DashboardService) { }

  ngOnInit() {
    this.getUserId();
    this.getFileData();

  }

  getFileData():void {
    console.log('inside getFileData',this.getdata());

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
                             
                             this.setdata(response.fileData[0].path);
                             console.log("checking path inside get files-->",this.getdata());

                           }
                           else
                           {
                             console.log('inside else',response);
                             this.empty = true;
                             console.log("checking path inside get files-->",this.getdata());
                           }

                         });
  }

  getUserId(): void {
     this.userId = this.activatedRoute.snapshot.paramMap.get('userId');
     console.log(this.userId);
  }

  openDialog(type): void {
    this.getUserId();
    this.getdata();
    console.log("inside dialog 1 current path-->",this.getdata());
    this.type = type;
    this.loadingMsg="";
    const dialogRef = this.dialog.open(FileDialogComponent, {
      width:'350px',
      data:{
        type:type
      }
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log("inside dialog 2 current path-->",this.getdata());
      if(result != null){

        this.userObj = {
          userId: this.userId,
          name: result,
          type: this.type,
          path:this.getdata()
        };

        console.log("inside dialog-->",this.userObj);


        this.dashboardservice.createFile(this.userObj)
                             .subscribe((response:any) => {
                               if(response!=null)
                               {
                                 console.log(response.fileData);
                                 console.log("checking path inside create-->",this.getdata());
                                 this.contentObj = response.fileData;
                                 this.contentObj = response.fileData;
                                 this.contentObj = response.fileData;
                                 this.empty = false;
                                 this.setdata(response.fileData[0].path);

                               }
                             });
      }
    });

  }

  openUploadDialog() {

    this.value = 0;
    this.loadingMsg="";

    const dialogRef = this.dialog.open(UploadDialogComponent ,{
      width:'750px'
    })

    dialogRef.afterClosed().subscribe(result => {

      if(result!=null)
      {

        const formData: FormData = new FormData();
        formData.append('myfile', result,result.name);
        formData.append('path',this.getdata());
        var options = { content: formData };

          const req = new HttpRequest('POST', 'http://localhost:3000/file/uploadFile', formData,{
          reportProgress: true
        });

        this.http.request(req).subscribe((event: HttpEvent<any>) => {

          switch (event.type) {
            case HttpEventType.Sent:
              this.value=25;
              this.loadingMsg="file uploading is in progress ...";
              console.log('Request sent!',this.value);
              break;
            case HttpEventType.ResponseHeader:
              this.value=75;
              console.log('Response header received!',this.value);
              break;
            case HttpEventType.DownloadProgress:
              this.value=100;
              console.log('event loaded--->', event.loaded);
              console.log('event loaded--->', event.loaded);
              const percentDone = Math.round(100 * event.loaded / event.total);
              console.log(`File is ${percentDone}% uploaded.`);
              break;
            case HttpEventType.Response:
              this.value=100;
              this.loadingMsg="File uploaded successfully ..."
              console.log('😺 Done!',this.value);
              console.log("event--->",event.body.fileData);
              this.contentObj=event.body.fileData;
          }
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
    this.loadingMsg="";
    console.log("---->",this.selectedObj);
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
    this.loadingMsg="";
    this.location.back();
  }

  handleSelect(selectedObj: FileObj):void {
    this.loadingMsg="";
    this.selectedObj = selectedObj;
  }

  selectedFolder(selectedFolder):void {
    this.loadingMsg="";


      if(selectedFolder.type=="folder")
      {
        console.log('----------->',this.getdata());
        this.dashboardservice.fetchSelectedFolderContents(selectedFolder)
                             .subscribe((response:any) => {

                                  if(typeof response != "string")
                                    {
                                      this.contentObj = response.fileData;
                                      this.backButtonDisable = false;
                                      this.setdata(response.fileData[0].path);
                                      console.log("data in selected-->",this.getdata());
                                    }
                                    else{
                                      this.backButtonDisable = false;
                                      this.contentObj = [];
                                      this.setdata(response);
                                      console.log("null in selected-->",this.getdata());
                                    }
                             });
      }

  }

  handleBackButton():void {

    this.userIdObj={
      userId:this.getdata()
    }
    this.dashboardservice.fetchFolderOneLevelUpContents(this.userIdObj)
                         .subscribe((response:any) => {
                           console.log(response);
                           if(response.fileData[0].root=="no"){
                             this.empty=false;
                                  this.contentObj = response.fileData;
                                  console.log("filedata",response.fileData);
                                  this.setdata(response.fileData[0].path);
                                  console.log('inside back handler',this.getdata());
                                  this.backButtonDisable = false;
                           }
                           else{
                            this.empty=false;
                            this.contentObj = response.fileData;
                            this.backButtonDisable = true;
                           }
                         });
  }

  contextmenu = false;
  contextmenuX = 0;
  contextmenuY = 0;

  //activates the menu with the coordinates
  onrightClick(event){
      this.contextmenuX=event.clientX
      this.contextmenuY=event.clientY
      this.contextmenu=true;
  }
  //disables the menu
  disableContextMenu(){
     this.contextmenu= false;
  }
}
