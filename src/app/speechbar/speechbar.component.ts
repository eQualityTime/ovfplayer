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
  private _displayedButtons: ButtonDisplayConfig;
  private _showIconsInSpeechbar: boolean;

  constructor(private speechbarService: SpeechbarService, private config: ConfigService,
              private boardService: BoardService) { }

  ngOnInit() {
    this._displayedButtons = this.config.displayedButtons;
    this._showIconsInSpeechbar = this.config.showIconsInSpeechbar;
  }

  get displayedButtons() : ButtonDisplayConfig {
    return this._displayedButtons;
  }

  get showIconsInSpeechbar() : boolean {
    return this._showIconsInSpeechbar;
  }
}
