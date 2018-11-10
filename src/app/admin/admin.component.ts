import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../services/service.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  imagesList = [];

  imageData = Object.create(null);

  inOne;

  constructor(private service: ServiceService) { }

  ngOnInit() {
  }

  onChangeInOne() {
    if(this.inOne) this.imageData = Object.create(null); 
  }

  onSubmit(e, form) {
    e.preventDefault();
    let data = new FormData(form);
    if(!this.inOne) { data.append('filesData', JSON.stringify(this.imageData)) };
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
    console.log(e);
    this.imageData[e.file] = {categoty: e.category, tags: e.tags};
  }
}
