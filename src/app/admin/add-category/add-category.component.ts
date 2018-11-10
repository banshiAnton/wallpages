import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {

  tags;

  constructor() { }

  ngOnInit() {
  }

  onSubmit(category) {
    console.log(this.tags, category);
  }

}
