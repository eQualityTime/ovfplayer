import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ConfigService, ButtonDisplayConfig } from '../config.service';
import { SpeechbarService } from '../speechbar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-speechbar',
  templateUrl: './speechbar.component.html',
  styleUrls: ['./speechbar.component.css']
})
export class SpeechbarComponent implements OnInit, OnDestroy {
  private _displayedButtons: ButtonDisplayConfig;
  private _showIconsInSpeechbar: boolean;
  private speakingSubscription: Subscription;
  speaking: boolean;

  constructor(
    private speechbarService: SpeechbarService,
    private config: ConfigService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this._displayedButtons = this.config.displayedButtons;
    this._showIconsInSpeechbar = this.config.showIconsInSpeechbar;
    this.speakingSubscription = this.speechbarService.getSpeaking().subscribe(speaking => {
      this.speaking = speaking;
      this.cdRef.detectChanges();
    });
  }

  ngOnDestroy() {
    this.speakingSubscription.unsubscribe();
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
