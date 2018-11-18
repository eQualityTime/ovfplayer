import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ConfigService, ButtonDisplayConfig } from '../config.service';
import { SpeechbarService } from '../speechbar.service';

@Component({
  selector: 'app-speechbar',
  templateUrl: './speechbar.component.html',
  styleUrls: ['./speechbar.component.css']
})
export class SpeechbarComponent implements OnInit {
  private _displayedButtons: ButtonDisplayConfig;
  private _showIconsInSpeechbar: boolean;
  speaking: boolean;

  constructor(
    private speechbarService: SpeechbarService,
    private config: ConfigService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this._displayedButtons = this.config.displayedButtons;
    this._showIconsInSpeechbar = this.config.showIconsInSpeechbar;
    this.speechbarService.getSpeaking().subscribe(speaking => {
      this.speaking = speaking;
      this.cdRef.detectChanges();
    });
  }

  get displayedButtons(): ButtonDisplayConfig {
    return this._displayedButtons;
  }

  get showIconsInSpeechbar(): boolean {
    return this._showIconsInSpeechbar;
  }

  speechbarClick(): void {
    if (this.config.speakOnSpeechbarClick) {
      this.speechbarService.speak();
    }
  }
}
