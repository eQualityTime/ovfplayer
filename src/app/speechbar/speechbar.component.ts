/* ::START::LICENCE::
Copyright eQualityTime ©2018
This file is part of OVFPlayer.
OVFPlayer is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
OVFPlayer is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with OVFPlayer.  If not, see <https://www.gnu.org/licenses/>.
::END::LICENCE:: */
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ConfigService, ButtonDisplayConfig } from '../services/config/config.service';
import { SpeechbarService } from '../services/speechbar/speechbar.service';
import { Subscription, Subscriber } from 'rxjs';
import { BoardService } from '../services/board/board.service';
import { Button } from '../obfboard';
import {
  ScanningService,
  ScanningModel,
  Scannable,
  ScannableCollection,
  ScannableCollectionProvider
} from '../services/scanning/scanning.service';
import { PageStackService } from '../services/page-stack/page-stack.service';

class ScannableButton extends Scannable {
  static TYPE = 'SpeechbarButton';
  private _label: string;
  private _handler: () => void;
  private speechbarComponent: SpeechbarComponent;

  constructor(label: string, handler: () => void, priority: number, speechbarComponent: SpeechbarComponent) {
    super(priority, ScannableButton.TYPE);
    this._label = label;
    this._handler = handler;
    this.speechbarComponent = speechbarComponent;
  }

  get label(): string {
    return this._label;
  }

  get handler(): () => void {
    return this._handler;
  }

  set label(label: string) {
    this._label = label;
  }

  set handler(handler: () => void) {
    this._handler = handler;
  }

  isHighlighted(): boolean {
    return this.speechbarComponent.scanningModel && this.speechbarComponent.scanningModel.currentHighlight === this;
  }

  isSelected(): boolean {
    return this.speechbarComponent.scanningModel && this.speechbarComponent.scanningModel.currentSelection === this;
  }
}

class ScannableSpeechbarRow extends ScannableCollection {
  static TYPE = 'SpeechbarRow';
  speak: ScannableButton;
  home: ScannableButton;
  speechbar: ScannableButton;
  backspace: ScannableButton;
  clear: ScannableButton;
  back: ScannableButton;
  private speechbarComponent: SpeechbarComponent;

  constructor(displayedButtons: ButtonDisplayConfig, speakOnSpeechbarClick: boolean, speechbarComponent: SpeechbarComponent) {
    super(0, ScannableSpeechbarRow.TYPE);
    this.speechbarComponent = speechbarComponent;

    if (displayedButtons.showSpeakButton) {
      this.speak = new ScannableButton('Speak', speechbarComponent.speak.bind(speechbarComponent), 0, speechbarComponent);
      this.addChild(this.speak);
    }
    if (displayedButtons.showHomeButton) {
      this.home = new ScannableButton('Home', speechbarComponent.home.bind(speechbarComponent), 1, speechbarComponent);
      this.addChild(this.home);
    }
    if (speakOnSpeechbarClick) {
      this.speechbar = new ScannableButton('speechbar', speechbarComponent.speechbarClick.bind(speechbarComponent), 2, speechbarComponent);
      this.addChild(this.speechbar);
    }
    if (displayedButtons.showBackspaceButton) {
      this.backspace = new ScannableButton('Backspace', speechbarComponent.backspace.bind(speechbarComponent), 3, speechbarComponent);
      this.addChild(this.backspace);
    }
    if (displayedButtons.showClearButton) {
      this.clear = new ScannableButton('Clear', speechbarComponent.clear.bind(speechbarComponent), 4, speechbarComponent);
      this.addChild(this.clear);
    }
    if (displayedButtons.showBackButton) {
      this.back = new ScannableButton('Back', speechbarComponent.back.bind(speechbarComponent), 5, speechbarComponent);
      this.addChild(this.back);
    }
  }

  isHighlighted(): boolean {
    return this.speechbarComponent.scanningModel && this.speechbarComponent.scanningModel.currentHighlight === this;
  }

  isSelected(): boolean {
    return this.speechbarComponent.scanningModel && this.speechbarComponent.scanningModel.currentSelection === this;
  }
}

class ScannableSpeechbarProvider extends Subscriber<ScanningModel> implements ScannableCollectionProvider {
  private rows: ScannableSpeechbarRow[];

  constructor(displayedButtons: ButtonDisplayConfig, speakOnSpeechbarClick: boolean, speechbarComponent: SpeechbarComponent) {
    super((scanningModel: ScanningModel) => {
      speechbarComponent.scanningModel = scanningModel;

      if (speechbarComponent.scanningModel.currentSelection &&
        speechbarComponent.scanningModel.currentSelection.type === ScannableButton.TYPE) {
        (<ScannableButton>speechbarComponent.scanningModel.currentSelection).handler();
      }
    });
    this.rows = [new ScannableSpeechbarRow(displayedButtons, speakOnSpeechbarClick, speechbarComponent)];
  }

  getScannableCollections(): ScannableCollection[] {
    return this.rows;
  }
}

@Component({
  selector: 'app-speechbar',
  templateUrl: './speechbar.component.html',
  styleUrls: ['./speechbar.component.css']
})
export class SpeechbarComponent implements OnInit, OnDestroy {
  private _displayedButtons: ButtonDisplayConfig;
  private _showIconsInSpeechbar: boolean;
  private speakingSubscription: Subscription;
  private buttonsSubscription: Subscription;
  private scanningSubscription: Subscription;
  speaking: boolean;
  buttons: Button[];
  scanningModel: ScanningModel;
  buttonRow: ScannableSpeechbarRow;
  stackContents: boolean;

  constructor(
    private boardService: BoardService,
    private speechbarService: SpeechbarService,
    private config: ConfigService,
    private scanningService: ScanningService,
    private cdRef: ChangeDetectorRef,
    private pageStackService: PageStackService
  ) { }

  ngOnInit() {
    this._displayedButtons = this.config.displayedButtons;
    this._showIconsInSpeechbar = this.config.showIconsInSpeechbar;
    const provider = new ScannableSpeechbarProvider(this._displayedButtons, this.config.speakOnSpeechbarClick, this);
    this.buttonRow = <ScannableSpeechbarRow> provider.getScannableCollections()[0];
    this.scanningSubscription = this.scanningService.getScanningModel().subscribe(provider);
    this.speakingSubscription = this.speechbarService.getSpeaking().subscribe(speaking => {
      this.speaking = speaking;
      this.cdRef.detectChanges();
    });
    this.buttonsSubscription = this.speechbarService.getButtons().subscribe(buttons => {
      this.buttons = buttons;
    });
    this.pageStackService.hasContent.subscribe(val => {
      this.stackContents = val;
    });
    this.stackContents = this.pageStackService.stackHasContent();
  }

  ngOnDestroy() {
    if (this.speakingSubscription) {
      this.speakingSubscription.unsubscribe();
    }
    if (this.buttonsSubscription) {
      this.buttonsSubscription.unsubscribe();
    }
    if (this.scanningSubscription) {
      this.scanningSubscription.unsubscribe();
    }
  }

  get displayedButtons(): ButtonDisplayConfig {
    return this._displayedButtons;
  }

  get showIconsInSpeechbar(): boolean {
    return this._showIconsInSpeechbar;
  }

  speechbarClick() {
    if (this.config.speakOnSpeechbarClick) {
      this.speechbarService.speak();
    }
  }

  speak() {
    this.speechbarService.speak();
  }

  home() {
    this.boardService.home();
  }

  backspace() {
    this.speechbarService.backspace();
  }

  clear() {
    this.speechbarService.clear();
  }

  back() {
    this.boardService.back();
  }
}
