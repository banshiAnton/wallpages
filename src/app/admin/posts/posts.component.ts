import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../../services/service.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  posts = [];

  constructor( private router: Router, private service: ServiceService ) { }

  ngOnInit() {
    this.getPosts();
  }

  getPosts() {
    this.service.getPosts().subscribe( ( data: any ) => {
      console.log('Post', data);
      if ( data.success ) {
        this.posts = data.posts;
      }
    });
  }

  delete(id) {
    if ( !confirm('Вы действительно хотите удалить пост ?') ) { return; }

    this.service.deletePost(id).subscribe( (data: any) => {
      console.log('Delete post', data);
      if ( data.success ) {
        this.router.navigate(['admin/posts']);
      }
    } );
  }

}
