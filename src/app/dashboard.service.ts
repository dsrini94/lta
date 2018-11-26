import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DashboardService {

  constructor(private http: HttpClient) { }

  createFile(userObj) {
    return this.http.post('http://localhost:3000/file/createFile',userObj);
  }

  deleteFile(selectedObj) {
    return this.http.post('http://localhost:3000/file/deleteFile',selectedObj);
  }

}
