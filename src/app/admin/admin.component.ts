import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../services/service.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  imagesList = [];

  imageData = [];

  constructor(private service: ServiceService) { }

  ngOnInit() {
  }

  onSubmit(e, form) {
    e.preventDefault();
    let data = new FormData(form);
    data.append('filesData', JSON.stringify(this.imageData));
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
    this.imageData.push(e);
  }
}
