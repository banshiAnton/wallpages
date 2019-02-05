import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../services/service.service';

import { Tag } from '../tag';

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

  loading = false;

  success = false;

  selectedDate = null;

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
  // ((this.selectedDate.getTime() / 1000) + '')
  // ( ( (Date.now() / 1000) + 60 ) + '' )
  onSubmit(e, form) {
    e.preventDefault();
    this.loading = true;
    this.success = false;
    // console.log('Date', this.selectedDate, this.selectedDate.getTime() / 1000);
    let data = new FormData(form);
    data.append('publish_date', this.selectedDate ?  ((this.selectedDate.getTime() / 1000) + '') : ( ( Math.ceil(Date.now() / 1000) + 30 * 2 ) + '' )  );
    if(this.inOne) { 
      if(!this.oneCategory) {
        console.log('Chose category');
        return;
      }
      for(let image in this.imageData) { this.imageData[image]['category'] = this.categories.find(categ => categ.name === this.oneCategory).id }
    };
    for(let image in this.imageData) { console.log(this.imageData[image]['tags'])} //this.imageData[image]['tags'] = this.imageData[image]['tags'].map(tag => tag ? tag.value : '') }//this.imageData[image]['tags'] = this.imageData[image]['tags'].length ? this.imageData[image]['tags'].map(tag => tag.value) : [];
    data.append('filesData', JSON.stringify(this.imageData))
    this.service.postImages(data).subscribe((data: any) => {
      this.loading = false;
      console.log('Response data', data);
      // if(data.results.every(item => item.success)) {
      //   this.success = true;
      // }
    });
  }

  onChange(inputFiles) {
    this.imagesList = [];
    console.log(inputFiles.files);//FileReader
    if(inputFiles.files.length > 5) {
      alert('Не больше 5 файлов');
      inputFiles.value = "";
      return;
    }
    for(let file of inputFiles.files) {//readAsDataURL
      let reader = new FileReader();
      reader.addEventListener("load",  () => {
        this.imagesList.push({src: reader.result, fileName: file.name});
        this.imageData[file.name] = Object.create(null);
        this.imageData[file.name]['tags'] = [];
      }, false);
      reader.readAsDataURL(file);
    }
  }

  onImgSelect(e) {
    if(e.file && !this.imageData[e.file]) this.imageData[e.file] = Object.assign(this.imageData[e.file] || {});
    if(e.tags) this.imageData[e.file]['tags'] = e.tags;
    if(e.category) this.imageData[e.file]['category'] = e.category;
  }

}