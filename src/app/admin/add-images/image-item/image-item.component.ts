import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-image-item',
  templateUrl: './image-item.component.html',
  styleUrls: ['./image-item.component.css']
})
export class ImageItemComponent implements OnInit, OnChanges {

  @Input() file;
  @Input() inOne;

  @Input() categories;

  tags = [];

  @Output() selected = new EventEmitter<any>();

  constructor() { }

  ngOnChanges() {
    if(this.inOne.inOne && this.inOne.category) {
      this.tags = this.categories.find(categ => categ.name === this.inOne.category).tags;
    } else {
      this.tags = [];
    }
  }

  ngOnInit() {
    if(this.inOne.inOne && this.inOne.category) {
      this.tags = this.categories.find(categ => categ.name === this.inOne.category).tags;
    } else {
      this.tags = [];
    }
  }

  onSelect(category) {
    this.tags = this.categories.find(categ => categ.name === category).tags;
    console.log('test select', {category: this.categories.find(categ => categ.name === category).id, file: this.file.fileName, tags: this.tags.filter(tag => !tag.readonly)});
    this.selected.emit({category: this.categories.find(categ => categ.name === category).id, file: this.file.fileName, tags: this.tags.filter(tag => !tag.readonly)});
  }

  onTagChange() {
    console.log('test tags input', {file: this.file.fileName, tags: this.tags.filter(tag => !tag.readonly)});
    this.selected.emit({file: this.file.fileName, tags: this.tags.filter(tag => !tag.readonly)});
  }
}
