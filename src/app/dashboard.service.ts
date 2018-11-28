import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  postFile(fileToUpload) {
    const formData: FormData = new FormData();
    formData.append('myfile', fileToUpload,fileToUpload.name);
    var options = { content: formData };
    return this.http.post('http://localhost:3000/file/uploadFile', formData);
  }
  
  
}
