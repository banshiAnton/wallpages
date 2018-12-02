import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../services/service.service';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.css']
})
export class AddAdminComponent implements OnInit {

  email: string;

  constructor(private service: ServiceService) { }

  ngOnInit() {
  }

  onAdd(e) {
    e.preventDefault();
    console.log(this.email);
    this.service.addAdmin(this.email).subscribe(data => {
      console.log(data);
    })
  }

}
