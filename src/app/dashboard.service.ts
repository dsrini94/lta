import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  createFile(userId: string,name: string,type: string) {
    return this.http.post('http://localhost:3000/file/createFile',userId,type,name);
  }

}
