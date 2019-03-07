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
  
  constructor(private router: ActivatedRoute, private service: ServiceService) {
    router.params.pipe(switchMap( (params: any) => service.getPost(+params.postId)))
                      .subscribe( (data: any) => {
                        console.log('Post', data);
                        if ( data.success ) {
                          this.post = data.post;
                        }
                      });
  }

  ngOnInit() {
  }

}
