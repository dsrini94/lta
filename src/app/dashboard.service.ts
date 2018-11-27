import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DashboardService {

  constructor(private http: HttpClient) { }

  getDirectories(userId){
    return this.http.post('http://localhost:3000/file/createFile',userId)
  }

  createFile(userObj) {
    return this.http.post('http://localhost:3000/file/createFile',userObj);
  }

  deleteFile(selectedObj) {
    console.log('----->',selectedObj);
    return this.http.post('http://localhost:3000/file/deleteFile',selectedObj);
  }

  postFile(fileToUpload: File) {
    return this.http.post('http://localhost:3000/file/deleteFile',fileToUpload);
  }

}
