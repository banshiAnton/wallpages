import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';

import { AppRoutingModule } from './router/app-routing.module';
import { ImageItemComponent } from './admin/add-images/image-item/image-item.component';
import { AddImagesComponent } from './admin/add-images/add-images.component';
import { AddCategoryComponent } from './admin/add-category/add-category.component';
import { HomeComponent } from './home/home.component';
import { AddAdminComponent } from './admin/add-admin/add-admin.component';
import { SetupComponent } from './admin/setup/setup.component';
import { AlertDivComponent } from './alert-div/alert-div.component';
import { PostsComponent } from './admin/posts/posts.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    ImageItemComponent,
    AddImagesComponent,
    AddCategoryComponent,
    HomeComponent,
    AddAdminComponent,
    SetupComponent,
    AlertDivComponent,
    PostsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    TagInputModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
