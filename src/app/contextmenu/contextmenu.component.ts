import { Component, Input, ViewChild } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { DashboardComponent } from '../dashboard/dashboard.component'
import { FileDialogComponent } from '../file-dialog/file-dialog.component';

import { Router, Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { HttpClientModule, HttpClient, HttpRequest, HttpEvent ,HttpEventType, HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-contextmenu',
  templateUrl: './contextmenu.component.html',
  styleUrls: ['./contextmenu.component.css']
})
export class ContextmenuComponent {

constructor(private http: HttpClient,private location: Location,
  private router: Router, private activatedRoute: ActivatedRoute,
  public dialog: MatDialog,private dashboardservice:DashboardService) { }

  private dashboardComponent = new DashboardComponent(this.http,this.location,
    this.router,this.activatedRoute,this.dialog,this.dashboardservice);



  handleRightClickFile(file):void {
    this.dashboardComponent.openDialog(file);
  }

  @Input() x=0;
  @Input() y=0;

}
