import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../services/service.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  constructor( private service: ServiceService ) { }

  ngOnInit() {
    this.getPosts();
  }

  getPosts() {
    this.service.getPosts().subscribe( ( data: any ) => {
      console.log('Post', data);

      if ( data.subscribe ) {
        
      }
    });
  }
}
