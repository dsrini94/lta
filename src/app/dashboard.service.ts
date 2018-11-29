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

  postFile(fileToUpload) {
    const formData: FormData = new FormData();
    formData.append('myfile', fileToUpload,fileToUpload.name);
    var options = { content: formData };
    // return this.http.post('http://localhost:3000/file/uploadFile', formData,{
    //     reportProgress: true,
    //   });

      const req = new HttpRequest('POST', 'http://localhost:3000/file/uploadFile', formData,{
      reportProgress: true
    });

    this.http.request(req).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request sent!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header received!');
          break;
        case HttpEventType.DownloadProgress:
          const kbLoaded = Math.round(event.loaded / 1024);
          console.log(`Download in progress! ${ kbLoaded }Kb loaded`);
          break;
        case HttpEventType.Response:
          console.log('😺 Done!', event.body);
      }
    });

  }


}
