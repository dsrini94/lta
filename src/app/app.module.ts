import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './/app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FileDialogComponent } from './file-dialog/file-dialog.component';
import { UploadDialogComponent } from './upload-dialog/upload-dialog.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatMenuModule, MatDialogModule, MatFormFieldModule, MatButtonModule, MatCheckboxModule, MatIconModule, MatInputModule} from '@angular/material';

import { AngularFileUploaderModule } from "angular-file-uploader";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    FileDialogComponent,
    UploadDialogComponent
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
    MatInputModule
  ],
  entryComponents: [
    FileDialogComponent,
    UploadDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
