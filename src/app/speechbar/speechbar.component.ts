import { Button } from '../obfpage';
import { Component, OnInit } from '@angular/core';
import { SpeechbarService } from '../speechbar.service';

@Component({
  selector: 'app-speechbar',
  templateUrl: './speechbar.component.html',
  styleUrls: ['./speechbar.component.css']
})
export class SpeechbarComponent implements OnInit {

  constructor(private speechbarService: SpeechbarService) { }

  ngOnInit() {
  }

}
