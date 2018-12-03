import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './/app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FileDialogComponent } from './file-dialog/file-dialog.component';
import { UploadDialogComponent } from './upload-dialog/upload-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

import { DashboardService } from './dashboard.service';

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
        MatTableModule,
        MatProgressBarModule } from '@angular/material';

import { FileDropModule } from 'ngx-file-drop';


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
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    MatListModule,
    MatRadioModule,
    MatTableModule,
    MatProgressBarModule,
    FileDropModule
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
