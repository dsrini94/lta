import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './/app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FileDialogComponent } from './file-dialog/file-dialog.component';
import { UploadDialogComponent } from './upload-dialog/upload-dialog.component';  

import { DashboardService } from './dashboard.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
        MatMenuModule,
        MatDialogModule,
        MatFormFieldModule,
        MatButtonModule,
        MatCheckboxModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatRadioModule,
        MatTableModule } from '@angular/material';

import { AngularFileUploaderModule } from "angular-file-uploader";
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    FileDialogComponent,
    UploadDialogComponent,
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
    MatIconModule,
    AngularFileUploaderModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    MatListModule,
    MatRadioModule,
    MatTableModule,
  ],
  entryComponents: [
    FileDialogComponent,
    UploadDialogComponent,
    ConfirmDialogComponent
  ],
  providers: [
    DashboardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
