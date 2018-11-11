import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../services/service.service';

import { Tag } from './tag';

@Component({
  selector: 'app-add-images',
  templateUrl: './add-images.component.html',
  styleUrls: ['./add-images.component.css']
})
export class AddImagesComponent implements OnInit {

  imagesList = [];

  imageData = Object.create(null);

  inOne;

  oneCategory;

  categories;

  constructor(private service: ServiceService) { 
    this.service.getCategories().subscribe((data: any) => {
      if(data.success) {
        this.categories = data.categories.map(categ => {
          categ.tags = categ.tags.map(tag => new Tag(tag));
          return categ;
        });
      }
    })
  }

  ngOnInit() {
  }

  onSubmit(e, form) {
    e.preventDefault();
    let data = new FormData(form);
    if(this.inOne) { 
      for(let image in this.imageData) { this.imageData[image]['category'] = this.categories.find(categ => categ.name === this.oneCategory).id }
    };
    for(let image in this.imageData) { this.imageData[image]['tags'] = this.imageData[image]['tags'].map(tag => tag.value); }
    data.append('filesData', JSON.stringify(this.imageData))
    this.service.postImages(data).subscribe((data: any) => {
      console.log(data);
    });
  }

  onChange(inputFiles) {
    console.log(inputFiles.files);//FileReader
    for(let file of inputFiles.files) {//readAsDataURL
      let reader = new FileReader();
      reader.addEventListener("load",  () => {
        this.imagesList.push({src: reader.result, fileName: file.name});
      }, false);
      reader.readAsDataURL(file);
    }
  }

  onImgSelect(e) {
    if(e.file && !this.imageData[e.file]) this.imageData[e.file] = Object.assign(this.imageData[e.file] || {});
    if(e.tags) this.imageData[e.file]['tags'] = e.tags;
    console.log()
    if(e.category) this.imageData[e.file]['category'] = e.category;
  }

}