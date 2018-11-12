import { Component, OnInit, Input } from '@angular/core';
import { Button, Image } from '../obfboard';

@Component({
  selector: 'app-obf-button',
  templateUrl: './obf-button.component.html',
  styleUrls: ['./obf-button.component.css']
})
export class ObfButtonComponent implements OnInit {

  @Input()butt: Button;
  @Input()image: Image;
  @Input()clickHandler: (Button) => void;

  constructor() { }

  ngOnInit() {
  }

}
