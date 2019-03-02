import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../services/service.service';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.css']
})
export class AddAdminComponent implements OnInit {

  vkid: string;
  state = 0;

  admins = [];

  constructor(private service: ServiceService) { }

  ngOnInit() {
    this.isAuth();
  }

  isAuth() {
    this.service.getAdmins().subscribe((data: any) => {
      console.log(data);
      if (data.success) {
        this.admins = data.admins;
      }
    });
  }

  onAdd(e) {
    this.state = 1;
    e.preventDefault();
    console.log(this.vkid);
    this.service.addAdmin(this.vkid).subscribe((data: any) => {
      console.log(data);
      if (data.success) {
        this.state = 2;
        window.location.reload();
      } else {
        this.state = 3;
      }
    });
  }

  onDelete(id: number) {
    this.service.deleteAdmin(id).subscribe((data: any) => {
      console.log(data);
      if (data.success) {
        window.location.reload();
      } else {
        this.state = 3;
      }
    });
  }

}
