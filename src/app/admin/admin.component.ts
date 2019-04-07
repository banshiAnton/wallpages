import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../services/service.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  isAuth = false;
  links: any;
  fb: Date;
  ok: Date;

  constructor(private service: ServiceService) { }

  ngOnInit() {
    this.isAuthCheck();
    this.lastUpdateToken();
  }

  lastUpdateToken() {
    this.service.getLastTokenUpd().subscribe((data: any) => {
      console.log(data);
      if (data.success) {
        this.fb = new Date(+data.fb);
        this.ok = new Date(+data.ok);
      }
    });
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
