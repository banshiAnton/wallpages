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
    return this.http.post(`${this.apiImageUrl}/upload`, data);
  }

  addCategory(name, tags) {
    console.log('Service', name, tags);
    return this.http.post(`${this.apiImageUrl}/add/category`, JSON.stringify({name, tags}), {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    });
  }

  setup() {
    return this.http.get(`${this.authUrl}/makeSetup`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    });
  }

  getCategories() {
    return this.http.get(`${this.apiImageUrl}/categories`).pipe(
      tap(item => console.log('Resp', item))
    );
  }

  updateCategory(category) {
    return this.http.put(`${this.apiImageUrl}/category/${category.id}`,
    JSON.stringify({name: category.name, tags: category.tags.map(tag => tag.value)}),
    {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    });
  }

  deleteCategory(id) {
    return this.http.delete(`${this.apiImageUrl}/category/${id}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    });
  }

  addAdmin(vkid) {
    return this.http.post(`${this.authUrl}admin`, JSON.stringify({vkid}), {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    });
  }

  getAdmin(isMainAdmin = false) {
    return this.http.get(`${this.authUrl}${isMainAdmin ? 'isMainAdmin' : 'admin'}`);
  }

  getImages(query = {count: 10, offset: 0, category: null}) {
    console.log(query);
    console.log(`${this.apiImageUrl}?${query.category ? 'category=' + query.category : ''}&count=${query.count}&offset=${query.offset}`);
    return this.http.get(`${this.apiImageUrl}?${query.category ? 'category='+query.category : ''}&count=${query.count}&offset=${query.offset}`);
  }

  getAuthLinks() {
    return this.http.get(`${this.authUrl}authLinks`);
  }

  getAdmins() {
    return this.http.get(`${this.authUrl}admins`);
  }

  deleteAdmin(id: number) {
    return this.http.delete(`${this.authUrl}admin/${id}`);
  }

  isInit() {
    return this.http.get(`${this.apiImageUrl}/isInit`);
  }

  getLastTokenUpd() {
    return this.http.get(`${this.apiImageUrl}/lastTokenUpd`);
  }

}
