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

  addCategory(name, tags) {
    console.log('Service', name, tags);
    return this.http.post(`${this.apiImageUrl}add/category`, JSON.stringify({name, tags}), {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    })
  }

  getCategories() {
    return this.http.get(`${this.apiImageUrl}/categories`)
  }
}
