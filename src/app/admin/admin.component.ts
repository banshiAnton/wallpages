import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../services/service.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  isAuth = false;
  vkAuthLink: string = '';
  fbAuthLink: string = '';
  okAuthLink: string = '';

  constructor(private service: ServiceService) { }

  ngOnInit() {
    this.service.getUser().subscribe((data:any) => {
      this.isAuth = data.success;
      if(!this.isAuth) {
        this.service.getVKAuthLink().subscribe((data:any) => {
            this.vkAuthLink = data.link;
        })
      } else {
        this.service.getFBAuthLink().subscribe((data:any) => {
          this.fbAuthLink = data.link;
        })
        this.service.getOKAuthLink().subscribe((data:any) => {
          this.okAuthLink = data.link;
        })
      }
    })
  }
}
