import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  apiImageUrl = '/api.images/';

  constructor(private http: HttpClient) { }

  postImages(data) {
    console.log('service', data);
    return this.http.post(`${this.apiImageUrl}/upload`, data, {
      headers: new HttpHeaders()
    })
  }
}
