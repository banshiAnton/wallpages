import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {
  tap, switchMap
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  apiImageUrl = '/api.images';
  authUrl = '/auth/';

  constructor(private http: HttpClient) { }

  postImages(data) {
    console.log('service', data);
    return this.http.post(`${this.apiImageUrl}/upload`, data, {
      headers: new HttpHeaders({'auth': window.localStorage.getItem('token') || ''})
    })
  }

  addCategory(name, tags) {
    console.log('Service', name, tags);
    return this.http.post(`${this.apiImageUrl}/add/category`, JSON.stringify({name, tags}), {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'auth': window.localStorage.getItem('token') || ''})
    })
  }

  getCategories() {
    return this.http.get(`${this.apiImageUrl}/categories`).pipe(
      tap(item => console.log('Resp', item))
    )
  }

  updateCategory(category) {
    return this.http.put(`${this.apiImageUrl}/category/${category.id}`, JSON.stringify({name: category.name, tags: category.tags.map(tag => tag.value)}), {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'auth': window.localStorage.getItem('token') || ''})
    });
  }

  deleteCategory(id) {
    return this.http.delete(`${this.apiImageUrl}/category/${id}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'auth': window.localStorage.getItem('token') || ''})
    });
  }

  addAdmin(email) {
    return this.http.post(`${this.authUrl}admin`, JSON.stringify({email}), {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    })
  }

  getUser() {
    return this.http.get(`${this.authUrl}admin`)
  }

  getImages(query = {count: 10, offset: 0, category: null}) {
    console.log(query);
    console.log(`${this.apiImageUrl}?${query.category ? 'category='+query.category : ''}&count=${query.count}&offset=${query.offset}`);
    return this.http.get(`${this.apiImageUrl}?${query.category ? 'category='+query.category : ''}&count=${query.count}&offset=${query.offset}`)
  }

  getVKAuthLink() {
    return this.http.get(`${this.authUrl}vkAuthLink`)
  }
}
