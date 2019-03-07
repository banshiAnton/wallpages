import { Component, OnInit } from '@angular/core';
import { ServiceService } from './services/service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'client';
  fb: Date;
  ok: Date;

  constructor(private servise: ServiceService) {}

  ngOnInit() {
    //this.lastUpdateToken();
  }

  lastUpdateToken() {
    this.servise.getLastTokenUpd().subscribe((data: any) => {
      console.log(data);
      if (data.success) {
        this.fb = new Date(+data.fb);
        this.ok = new Date(+data.ok);
      }
    });
  }

}
