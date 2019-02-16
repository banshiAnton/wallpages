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

  state = 0;

  selectedDate = null;

  constructor(private service: ServiceService) {
    this.service.getCategories().subscribe((data: any) => {
      if (data.success) {
        this.categories = data.categories.map(categ => {
          categ.tags = categ.tags.map(tag => new Tag(tag));
          return categ;
        });
      }
    });
  }

  ngOnInit() {
  }

  onSubmit(e, form) {
    e.preventDefault();
    this.state = 1;

    if (this.inOne) {
      if (!this.oneCategory) {
        console.log('Chose category');
        return;
      }
      for(const image in this.imageData) {
        this.imageData[image]['category'] = this.categories.find(categ => categ.name === this.oneCategory).id;
      }
    }

    const data = new FormData(form);
    const date = this.selectedDate ?  ((this.selectedDate.getTime() / 1000) + '') : ( ( Math.ceil(Date.now() / 1000) + 30 * 2 ) + '' );
    data.append('publish_date', date);

    data.append('filesData', JSON.stringify(this.imageData));
    this.service.postImages(data).subscribe((result: any) => {
      console.log('Response data', result);
      this.state = result.success ? 2 : 3;
    });
  }

  onChange(inputFiles) {
    this.imagesList = [];
    console.log(inputFiles.files); // FileReader
    if (inputFiles.files.length > 5) {
      alert('Не больше 5 файлов');
      inputFiles.value = '';
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
