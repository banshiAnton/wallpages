import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';
import { MainAdminGuard } from '../guards/main-admin.guard';

import { AdminComponent } from '../admin/admin.component';
import { AddImagesComponent } from '../admin/add-images/add-images.component';
import { AddCategoryComponent } from '../admin/add-category/add-category.component';
import { AddAdminComponent } from '../admin/add-admin/add-admin.component';
import { SetupComponent } from '../admin/setup/setup.component';
import { HomeComponent } from '../home/home.component';

const routes: Routes = [
  { path: 'admin', component: AdminComponent, canActivateChild: [AuthGuard],
    children: [
      { path: 'addImages', component: AddImagesComponent },
      { path: 'addCategoty', component: AddCategoryComponent },
      { path: 'addAdmin', component: AddAdminComponent, canActivate: [MainAdminGuard] },
      { path: 'setup', component: SetupComponent },
    ]
  },
  { path: 'home', component: HomeComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
