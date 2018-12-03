import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-obfpage',
  template: `<div class="obfpage"><div class="inner"><ng-content></ng-content></div></div>`,
  styles: [`
    .obfpage {
      width: 100%;
      height: 100%;
      background-color: lightsteelblue;
      position: absolute;
    }
    .inner {
      margin: 20px;
    }
  `]
})
export class OBFPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
