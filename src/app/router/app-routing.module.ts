import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from '../admin/admin.component';
import { AddImagesComponent } from '../admin/add-images/add-images.component';
import { AddCategoryComponent } from '../admin/add-category/add-category.component';
import { AddAdminComponent } from '../admin/add-admin/add-admin.component';
import { HomeComponent } from '../home/home.component';

const routes: Routes = [
  { path: 'admin', component: AdminComponent},
  { path: 'admin/addImages', component: AddImagesComponent },
  { path: 'admin/addCategoty', component: AddCategoryComponent },
  { path: 'admin/addAdmin', component: AddAdminComponent },
  { path: 'home', component: HomeComponent }
  
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
