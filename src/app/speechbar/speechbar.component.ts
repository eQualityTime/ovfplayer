import { Button } from '../obfboard';
import { Component, OnInit } from '@angular/core';
import { ConfigService, ButtonDisplayConfig } from '../config.service';
import { SpeechbarService } from '../speechbar.service';
import { BoardService } from '../board.service';

@Component({
  selector: 'app-speechbar',
  templateUrl: './speechbar.component.html',
  styleUrls: ['./speechbar.component.css']
})
export class SpeechbarComponent implements OnInit {
  private displayedButtons: ButtonDisplayConfig;
  private showIconsInSpeechbar: boolean;

  constructor(private speechbarService: SpeechbarService, private config: ConfigService,
              private boardService: BoardService) { }

  ngOnInit() {
    this.displayedButtons = this.config.displayedButtons;
    this.showIconsInSpeechbar = this.config.showIconsInSpeechbar;
  }

}
