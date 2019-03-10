import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {
  tap, switchMap, timeout, catchError
} from 'rxjs/operators';

import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private apiImageUrl = '/api.images';
  private authUrl = '/auth/';

  private timeout = 5 * 60 * 1000;

  constructor(private http: HttpClient) { }

  postImages(data) {
    console.log('service', data);
    return this.http.post(`${this.apiImageUrl}/upload`, data).pipe(
      timeout(this.timeout), catchError(error => of({success: false, error}))
    );
  }

  postImage(data, post_id) {
    return this.http.post(`${this.apiImageUrl}/image/${post_id}`, data).pipe(
      catchError(error => of({success: false, error}))
    );
  }

  addCategory(name, tags) {
    console.log('Service', name, tags);
    return this.http.post(`${this.apiImageUrl}/add/category`, JSON.stringify({name, tags}), {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    }).pipe(
      catchError(error => of({success: false, error}))
    );
  }

  setup() {
    return this.http.get(`${this.authUrl}/makeSetup`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    }).pipe(
      catchError(error => of({success: false, error}))
    );
  }

  getCategories() {
    return this.http.get(`${this.apiImageUrl}/categories`).pipe(
      catchError(error => of({success: false, error}))
    );
  }

  updateCategory(category) {
    return this.http.put(`${this.apiImageUrl}/category/${category.id}`,
    JSON.stringify({name: category.name, tags: category.tags.map(tag => tag.value)}),
    {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    }).pipe(
      catchError(error => of({success: false, error}))
    );
  }

  deleteCategory(id) {
    return this.http.delete(`${this.apiImageUrl}/category/${id}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    }).pipe(
      catchError(error => of({success: false, error}))
    );
  }

  addAdmin(vkid) {
    return this.http.post(`${this.authUrl}admin`, JSON.stringify({vkid}), {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    }).pipe(
      catchError(error => of({success: false, error}))
    );
  }

  getAdmin(isMainAdmin = false) {
    return this.http.get(`${this.authUrl}${isMainAdmin ? 'isMainAdmin' : 'admin'}`).pipe(
      catchError(error => of({success: false, error}))
    );
  }

  getImages(query = {count: 10, offset: 0, category: null}) {
    console.log(query);
    console.log(`${this.apiImageUrl}?${query.category ? 'category=' + query.category : ''}&count=${query.count}&offset=${query.offset}`);
    return this.http.get(`${this.apiImageUrl}?${query.category ? 'category=' +query.category : ''}&count=${query.count}&offset=${query.offset}`)
    .pipe(
      catchError(error => of({success: false, error}))
    );
  }

  getAuthLinks() {
    return this.http.get(`${this.authUrl}authLinks`).pipe(
      catchError(error => of({success: false, error}))
    );
  }

  getAdmins() {
    return this.http.get(`${this.authUrl}admins`).pipe(
      catchError(error => of({success: false, error}))
    );
  }

  deleteAdmin(id: number) {
    return this.http.delete(`${this.authUrl}admin/${id}`).pipe(
      catchError(error => of({success: false, error}))
    );
  }

  isInit() {
    return this.http.get(`${this.apiImageUrl}/isInit`).pipe(
      catchError(error => of({success: false, error}))
    );
  }

  getLastTokenUpd() {
    return this.http.get(`${this.apiImageUrl}/lastTokenUpd`).pipe(
      catchError(error => of({success: false, error}))
    );
  }

  getPosts() {
    return this.http.get(`${this.apiImageUrl}/posts`).pipe(
      catchError(error => of({success: false, error}))
    );
  }

  getPost(id) {
    return this.http.get(`${this.apiImageUrl}/post/${id}`).pipe(
      catchError(error => of({success: false, error}))
    );
  }

  deleteImage(id) {
    return this.http.delete(`${this.apiImageUrl}/image/${id}`).pipe(
      catchError(error => of({success: false, error}))
    );
  }

  deletePost(id) {
    return this.http.delete(`${this.apiImageUrl}/post/${id}`).pipe(
      catchError(error => of({success: false, error}))
    );
  }

  updatePost(post) {
    return this.http.put(`${this.apiImageUrl}/post/${post.id}`, JSON.stringify(post)).pipe(
      catchError(error => of({success: false, error}))
    );
  }

}
