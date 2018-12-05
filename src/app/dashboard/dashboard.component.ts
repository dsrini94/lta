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
  color = 'primary';
  mode = 'determinate';
  value = 0;
  loadingMsg:string = "";
  backButtonDisable: boolean = true;

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


  constructor(private http: HttpClient,private location: Location,private router: Router, private activatedRoute: ActivatedRoute,public dialog: MatDialog,private dashboardservice:DashboardService) { }

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
    this.loadingMsg="";
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
          type: this.type,
          path:this.currentPath
        };

        this.dashboardservice.createFile(this.userObj)
                             .subscribe((response:any) => {
                               if(response!=null)
                               {
                                 this.empty = false;
                                 this.currentPath = response.fileData[0].file;
                                 console.log("inside create file",this.currentPath);
                                 this.contentObj = response.fileData;
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
        formData.append('path',this.currentPath);
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
              this.getFileData();
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

      if(selectedFolder.type=="folder")
      {
        this.dashboardservice.fetchSelectedFolderContents(selectedFolder)
                             .subscribe((response:any) => {

                                  if(typeof response != "string")
                                    {
                                      this.contentObj = response.fileData;
                                      this.backButtonDisable = false;
                                      this.currentPath=response.fileData[0].file;
                                    }
                                    else{
                                      // this.currentPath = this.currentPath + '/' + response;
                                      console.log('------>',this.currentPath);
                                      this.backButtonDisable = false;
                                      this.contentObj = [];
                                      //console.log("selected folder--->",selectedFolder[name]);
                                      //this.router.navigate(['/dashboard/'+this.userId,this.selectedFolder]);
                                      // this.empty = true;
                                    }
                             });
      }

  }

  handleBackButton():void {

    this.userIdObj={
      userId:this.currentPath
    }
    this.dashboardservice.fetchFolderOneLevelUpContents(this.userIdObj)
                         .subscribe((response:any) => {
                           if(response.fileData[0].root=="no"){
                                  this.contentObj = response.fileData;
                                  console.log("filedata",response.fileData);
                                  var path=response.fileData[0].file;
                                  var nameFile=path.split('/');
                                  var namelength=nameFile.length;
                                  var filename=nameFile[namelength-1];
                                  var pathLength=path.length;
                                  var filelength=filename.length;
                                  path=path.substr(0,(pathLength-filelength-1));

                                  this.currentPath = path;
                                  console.log('inside back handler',this.currentPath);
                                  this.backButtonDisable = false;
                           }
                           else{
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
