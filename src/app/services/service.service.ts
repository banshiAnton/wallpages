import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {
  tap, switchMap
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  apiImageUrl = '/api.images/';

  constructor(private http: HttpClient) { }

  postImages(data) {
    console.log('service', data);
    return this.http.post(`${this.apiImageUrl}upload`, data, {
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
    return this.http.get(`${this.apiImageUrl}categories`).pipe(
      tap(item => console.log('Resp', item))
    )
  }

  updateCategory(category) {
    return this.http.put(`${this.apiImageUrl}categories/${category.id}`, JSON.stringify({name: category.name, tags: category.tags.map(tag => tag.value)}), {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    });
  }
}
