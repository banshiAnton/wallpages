import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-image-item',
  templateUrl: './image-item.component.html',
  styleUrls: ['./image-item.component.css']
})
export class ImageItemComponent implements OnInit {

  @Input() file;
  @Input() inOne;

  tegs;

  @Output() selected = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  onSelect(category) {
    console.log('test select', {category, file: this.file.fileName, tags: this.tegs});
    this.selected.emit({category, file: this.file.fileName, tags: this.tegs});
  }

  onTagChange() {
    console.log('test tegs input', {file: this.file.fileName, tags: this.tegs});
    this.selected.emit({file: this.file.fileName, tags: this.tegs});
  }
}
