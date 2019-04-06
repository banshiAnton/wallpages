import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';
import { MainAdminGuard } from '../guards/main-admin.guard';
import { InitGuard } from '../guards/init.guard';

import { AdminComponent } from '../admin/admin.component';
import { AddImagesComponent } from '../admin/add-images/add-images.component';
import { AddCategoryComponent } from '../admin/add-category/add-category.component';
import { AddAdminComponent } from '../admin/add-admin/add-admin.component';
import { SetupComponent } from '../admin/setup/setup.component';
import { HomeComponent } from '../home/home.component';
import { PostsComponent } from '../admin/posts/posts.component';
import { EditComponent } from '../admin/edit/edit.component';

const routes: Routes = [
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'admin', component: AdminComponent, canActivateChild: [AuthGuard],
    children: [
      { path: 'addImages', component: AddImagesComponent, canActivate: [ InitGuard ] },
      { path: 'addCategory', component: AddCategoryComponent, canActivate: [ InitGuard ] },
      { path: 'addAdmin', component: AddAdminComponent, canActivate: [ MainAdminGuard ] },
      { path: 'setup', component: SetupComponent, canActivate: [ MainAdminGuard ] },
      { path: 'posts', component: PostsComponent, canActivate: [ InitGuard ] },
      { path: 'edit/:postId', component: EditComponent, canActivate: [ InitGuard ] },
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
