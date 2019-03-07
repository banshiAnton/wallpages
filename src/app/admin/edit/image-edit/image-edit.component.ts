import { Component, OnInit, Input } from '@angular/core';

import { Tag } from '../../tag';

@Component({
  selector: 'app-image-edit',
  templateUrl: './image-edit.component.html',
  styleUrls: ['./image-edit.component.css']
})
export class ImageEditComponent implements OnInit {

  @Input() image;

  @Input() categories;

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

}
