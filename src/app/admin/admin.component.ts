import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../services/service.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  isAuth = false;

  constructor(private service: ServiceService) { }

  ngOnInit() {
    this.service.getUser().subscribe((data:any) => {
      this.isAuth = data.success;
    })
  }

  auth(e, pwd) {
    e.preventDefault();
    console.log(pwd);
    this.service.login(pwd).subscribe((data:any) => {
      if(data.success) {
        window.localStorage.setItem('token', data.token);
        console.log(window.localStorage.getItem('token'));
        this.isAuth = true;
      }
    })
  }

}
