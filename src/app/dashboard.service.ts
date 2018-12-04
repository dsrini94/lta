import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpRequest, HttpEvent ,HttpEventType, HttpResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class DashboardService {

  constructor(private http: HttpClient) { }

  getDirectories(userId){
    return this.http.post('http://localhost:3000/file/getFiles',userId);
  }

  createFile(userObj) {
    return this.http.post('http://localhost:3000/file/createFile',userObj);
  }

  deleteFile(selectedObj) {
    return this.http.post('http://localhost:3000/file/deleteFile',selectedObj);
  }

  fetchSelectedFolderContents(selectedFolder) {
    return this.http.post('http://localhost:3000/file/selectedFolder',selectedFolder);
  }

  fetchFolderOneLevelUpContents(currentPath){
    return this.http.post('http://localhost:3000/file/handleBack',currentPath);
  }

}
