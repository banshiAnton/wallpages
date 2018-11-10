import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../services/service.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {

  tags;

  constructor(private service: ServiceService) { }

  ngOnInit() {
  }

  onSubmit(category) {
    console.log(this.tags, category);
    this.service.addCategory(category, this.tags.map((item: any) => {
      return item.value
    })).subscribe((data: any) => {
      console.log(data);
    })
  }

}
