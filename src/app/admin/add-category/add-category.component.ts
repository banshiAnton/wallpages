import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../services/service.service';

import { Tag } from '../tag';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {

  tags = [];
  categories = [];
  selected = {name: null, tags: [], id: null};
  addName: string;

  addState = 0;
  updState = 0;

  constructor(private service: ServiceService) {
  }

  ngOnInit() {
    this.getCaterories();
  }

  getCaterories() {
    this.service.getCategories().subscribe((data: any) => {
      if (data.success) {
        this.categories = data.categories.map(categ => {
          categ.tags = categ.tags.map(tag => {
            return new Tag(tag, false);
          });
          return categ;
        });
      }
    });
  }

  onAdd() {

    this.addState = 1;

    console.log(this.tags, this.addName);
    this.service.addCategory(this.addName.toLowerCase(), this.tags.map((item: any) => {
      return item.value;
    })).subscribe((data: any) => {
      console.log(data);
      if (data.success) {
        this.addState = 2;
        location.reload();
      } else {
        this.addState = 3;
      }
    });
  }

  onSelect(category) {
    console.log('Selected', category);
    this.selected = Object.assign({}, this.categories.find(categ => categ.name === category));
    console.log(this.selected);
  }

  onUpdata() {

    this.updState = 1;

    this.selected.name = this.selected.name.toLowerCase();

    console.log('On updata', this.selected);
    this.service.updateCategory(this.selected).subscribe((data: any) => {
      console.log(data);
      if (data.success) {
        this.updState = 2;
        location.reload();
      } else {
        this.updState = 3;
      }
    });
  }

  // onDelete() {
  //   console.log('On delete', this.selected);
  //   this.service.deleteCategory(this.selected.id).subscribe((data:any) => {
  //     if(data.success) {
  //       console.log(data);
  //     }
  //   })
  // }

}
