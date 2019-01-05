import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../services/service.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {

  authLinks:any = {};

  constructor(private service: ServiceService) { }

  ngOnInit() {
    this.service.getAuthLinks().subscribe((data:any) => {
      this.authLinks = data;
    })
  }

}
