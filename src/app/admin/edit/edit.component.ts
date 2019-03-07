import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../../services/service.service';

import {
  tap, switchMap, timeout, catchError
} from 'rxjs/operators';
import { from } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  post: any;

  categories = [];

  isLoaded: boolean;

  constructor(private router: Router, private routerActive: ActivatedRoute, private service: ServiceService) {}

  ngOnInit() {
    this.getCategories();
    this.loadPost();
  }


  loadPost() {
    this.routerActive.params.pipe(switchMap( (params: any) => this.service.getPost(+params.postId)))
                      .subscribe( (data: any) => {
                        console.log('Post', data);
                        if ( data.success ) {
                          this.isLoaded = true;
                          this.post = data.post;
                        }
                      });
  }

  getCategories() {
    this.service.getCategories().subscribe((data: any) => {
      console.log('Categories', data);
      if ( data.success ) {
        this.categories = data.categories;
      }
    });
  }

  update() {
    console.log('Post update', this.post);
  }

  delete() {
    console.log('Post delete', this.post.id);
    this.service.deletePost(this.post.id).subscribe( (data: any) => {
      console.log('Delete post', data);
      if ( data.success ) {
        this.router.navigate(['admin/posts']);
      }
    } );
  }


  onDeleteImage(id: number) {
    this.service.deleteImage(id).subscribe( (data: any) => {
      console.log('Delete data', data);
      if ( data.success ) {
        this.findAndRemoveById(data.id);
      }
    });
  }

  private findAndRemoveById(id: number) {
    const imageToDelete = this.post.images.find( (image: any) => image.id === +id );

    this.post.images.splice(1, this.post.images.indexOf(imageToDelete));
  }

}
