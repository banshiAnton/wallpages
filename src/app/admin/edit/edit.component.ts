import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiceService } from '../../services/service.service';

import {
  tap, switchMap, timeout, catchError
} from 'rxjs/operators';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  post: any;

  categories = [];

  constructor(private router: ActivatedRoute, private service: ServiceService) {

  }

  ngOnInit() {
    this.loadPost();
    this.getCategories();
  }


  loadPost() {
    this.router.params.pipe(switchMap( (params: any) => this.service.getPost(+params.postId)))
                      .subscribe( (data: any) => {
                        console.log('Post', data);
                        if ( data.success ) {
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

  updatePost() {
    console.log('Post', this.post);
  }

}
