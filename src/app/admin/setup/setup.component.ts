import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../services/service.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {

  state = 0;
  authLinks: any = {};
  vkToken: string;

  constructor(private service: ServiceService) { }

  ngOnInit() {
    this.service.getAuthLinks().subscribe((data: any) => {
      this.authLinks = data;
    });
  }

  setup() {
    this.state = 1;
    this.service.setup().subscribe((data: any) => {
      console.log(data);
      if (data.success) {
        this.state = 2;
        window.location.href = `${window.location.protocol}//${window.location.host}/admin`;
      } else {
        this.state = 3;
      }
    });
  }

  setVKToken() {
    console.log(this.vkToken);
  }

}
