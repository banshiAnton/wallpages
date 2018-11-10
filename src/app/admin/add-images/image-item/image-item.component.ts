import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-image-item',
  templateUrl: './image-item.component.html',
  styleUrls: ['./image-item.component.css']
})
export class ImageItemComponent implements OnInit {

  @Input() file;
  @Input() inOne;

  tags;

  @Output() selected = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  onSelect(category) {
    console.log('test select', {category, file: this.file.fileName, tags: this.tags});
    this.selected.emit({category, file: this.file.fileName, tags: this.tags});
  }

  onTagChange() {
    console.log('test tags input', {file: this.file.fileName, tags: this.tags});
    this.selected.emit({file: this.file.fileName, tags: this.tags});
  }
}
