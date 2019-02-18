import { Component, OnInit, Input } from '@angular/core';
import { state } from '@angular/animations';

@Component({
  selector: 'app-alert-div',
  templateUrl: './alert-div.component.html',
  styleUrls: ['./alert-div.component.css']
})
export class AlertDivComponent implements OnInit {

  @Input() state: number;

  constructor() { }

  ngOnInit() {
  }

}
