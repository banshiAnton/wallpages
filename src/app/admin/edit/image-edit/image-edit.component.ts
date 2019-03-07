import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Tag } from '../../tag';

@Component({
  selector: 'app-image-edit',
  templateUrl: './image-edit.component.html',
  styleUrls: ['./image-edit.component.css']
})
export class ImageEditComponent implements OnInit {

  @Input() image;

  @Input() categories;

  @Output() deleteImage = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
    this.initTags();
  }

  initTags() {
    this.image.tags = this.categories.find(category => category.id === +this.image.category_id).tags
                      .map(tag => new Tag(tag))
                      .concat(this.image.tags.filter(tag => !tag.readonly)
                      .map(tag => new Tag(tag, false)));
  }

  onChangeCategoty() {
    this.initTags();
  }

  delete() {
    this.deleteImage.emit(this.image.id);
  }

}
