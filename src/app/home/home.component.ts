import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../services/service.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  categories = [];
  images = [];

  constructor(private service: ServiceService) { }

  ngOnInit() {
    this.loadCategoris();
    this.loadImages();
  }

  loadCategoris() {
    this.service.getCategories().subscribe((data:any) => {
      if(data.success) {
        this.categories = data.categories;
      }
    })
  }

  loadImages() {
    this.service.getImages().subscribe((data:any) => {
      if(data.success) {
        this.images = data.results;
      }
    })
  }

  selectCategory(category) {
    let query:any= { count: 10, offset: 0, category: category.id }
    console.log(query);
    this.service.getImages(query).subscribe((data:any) => {
      if(data.success) {
        this.images = data.results;
      }
    })
  }
}
