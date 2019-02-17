import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../services/service.service';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.css']
})
export class AddAdminComponent implements OnInit {

  vkid: string;

  constructor(private service: ServiceService) { }

  ngOnInit() {
  }

  onAdd(e) {
    e.preventDefault();
    console.log(this.vkid);
    this.service.addAdmin(this.vkid).subscribe(data => {
      console.log(data);
    }).unsubscribe();
  }

}
