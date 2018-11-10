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
    this.selected.emit({category, file: this.file.fileName, tags: this.tegs});
  }

}
