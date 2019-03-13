import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../services/service.service';

import { Tag } from '../tag';

@Component({
  selector: 'app-add-images',
  templateUrl: './add-images.component.html',
  styleUrls: ['./add-images.component.css'],
})
export class AddImagesComponent implements OnInit {

  imagesList = [];

  imageData = Object.create(null);

  inOne;

  files = [];

  oneCategory;

  categories;

  state = 0;

  selectedDate: Date;

  constructor(private service: ServiceService) {

  }

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.service.getCategories().subscribe((data: any) => {
      if (data.success) {
        this.categories = data.categories.map(categ => {
          categ.tags = categ.tags.map(tag => new Tag(tag));
          return categ;
        });
      }
    });
  }

  onSubmit(e, form) {
    e.preventDefault();

    if (this.inOne) {
      if (!this.oneCategory) {
        alert('Выберите категорию');
        return;
      }
      for (const image in this.imageData) {
        if (image in this.imageData) {
          this.imageData[image]['category'] = this.categories.find(categ => categ.name === this.oneCategory).id;
        }
      }
    }

    const data = new FormData(form);

    data.delete('images');

    console.log('If', data.has('images'), data.has('images[]'));

    this.files.forEach(file => {
      data.append('images', file);
    });

    const publish_date = this.selectedDate ? +(new Date(this.selectedDate)) : Date.now();
    data.append('publish_date', publish_date + '');

    data.append('filesData', JSON.stringify(this.imageData));

    this.state = 1;

    this.service.postImages(data).subscribe((result: any) => {
      console.log('Response data', result);
      if (result.success) {
        this.state = 2;
        location.reload();
      } else {
        this.state = 3;
      }
    });
  }

  onChange(inputFiles) {
    // this.imagesList = [];
    for (let i = 0; i < inputFiles.files.length; i++) {
      this.files.push(inputFiles.files[i]);
    }

    console.log('Files', inputFiles.files, this.files); // FileReader
    if (inputFiles.files.length > 5 || this.imagesList.length > 5 || this.files.length > 5) {
      alert('Не больше 5 файлов');
      inputFiles.value = '';
      this.imagesList = this.files = [];
      return;
    }
    for (const file of inputFiles.files) {// readAsDataURL
      const reader = new FileReader();
      reader.addEventListener('load',  () => {
        this.imagesList.push({src: reader.result, fileName: file.name});
        this.imageData[file.name] = Object.create(null);
        this.imageData[file.name]['tags'] = [];
      }, false);
      reader.readAsDataURL(file);
    }
  }

  onImgSelect(e) {
    if (e.file && !this.imageData[e.file]) {
      this.imageData[e.file] = Object.assign(this.imageData[e.file] || {});
    }
    if (e.tags) {
      this.imageData[e.file]['tags'] = e.tags;
    }
    if (e.category) {
      this.imageData[e.file]['category'] = e.category;
    }
  }

}
