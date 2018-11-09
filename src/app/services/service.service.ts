import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  url = '/';

  constructor(private http: HttpClient) { }

  postImages(data) {
    console.log('service', data);
    return this.http.post(`${this.url}upload`, data, {
      headers: new HttpHeaders()
    })
  }
}
