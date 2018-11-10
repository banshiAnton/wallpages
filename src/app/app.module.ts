import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';

import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!

import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';

import { AppRoutingModule } from './router/app-routing.module';
import { ImageItemComponent } from './admin/add-images/image-item/image-item.component';
import { AddImagesComponent } from './admin/add-images/add-images.component';
import { AddCategoryComponent } from './admin/add-category/add-category.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    ImageItemComponent,
    AddImagesComponent,
    AddCategoryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    TagInputModule, 
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
