import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../services/service.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  isAuth = false;
  links: any;

  constructor(private service: ServiceService, private cookieService: CookieService) { }

  ngOnInit() {
    this.isAuthCheck();
  }

  isAuthCheck() {
    this.service.getAdmin().subscribe((data: any) => {
      this.isAuth = data.success;
      if (!this.isAuth) {
        this.service.getAuthLinks().subscribe((links: any) => {
          console.log('Vk link', links);
          this.links = links;
        });
      }
    });
  }
}
