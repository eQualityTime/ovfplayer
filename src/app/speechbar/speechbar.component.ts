import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ConfigService, ButtonDisplayConfig } from '../config.service';
import { SpeechbarService } from '../speechbar.service';
import { Subscription, Subscriber } from 'rxjs';
import { BoardService } from '../board.service';
import { Button } from '../obfboard';
import { ScanningService, ScanningModel, Scannable, ScannableCollection, ScannableCollectionProvider } from '../scanning.service';

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

  constructor(
    private boardService: BoardService,
    private speechbarService: SpeechbarService,
    private config: ConfigService,
    private scanningService: ScanningService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this._displayedButtons = this.config.displayedButtons;
    this._showIconsInSpeechbar = this.config.showIconsInSpeechbar;
    this.speakingSubscription = this.speechbarService.getSpeaking().subscribe(speaking => {
      this.speaking = speaking;
      this.cdRef.detectChanges();
    });
    this.buttonsSubscription = this.speechbarService.getButtons().subscribe(buttons => {
      this.buttons = buttons;
    });
    this.registerWithScanner();
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

  registerWithScanner(): void {
    const buttons: ScannableButton[] = [];

    if (this._displayedButtons.showSpeakButton) {
      buttons.push(new ScannableButton('speak', this.speak.bind(this), 0));
    }
    if (this._displayedButtons.showHomeButton) {
      buttons.push(new ScannableButton('home', this.home.bind(this), 1));
    }
    if (this.config.speakOnSpeechbarClick) {
      buttons.push(new ScannableButton('speechbar', this.speechbarClick.bind(this), 2));
    }
    if (this._displayedButtons.showBackspaceButton) {
      buttons.push(new ScannableButton('backspace', this.backspace.bind(this), 3));
    }
    if (this._displayedButtons.showClearButton) {
      buttons.push(new ScannableButton('clear', this.clear.bind(this), 4));
    }

    this.scanningSubscription = this.scanningService.getScanningModel().subscribe(
      new ScannableSpeechbarProvider(buttons, this.updateScanning)
    );
  }

  private updateScanning = (scanningModel: ScanningModel) => {
    this.scanningModel = scanningModel;

    if (this.scanningModel.currentSelection && this.scanningModel.currentSelection.type === ScannableButton.TYPE) {
      (<ScannableButton> this.scanningModel.currentSelection).handler();
    }
  }

  containerScanHighlight(): boolean {
    return this.scanningModel && this.scanningModel.currentHighlight &&
        this.scanningModel.currentHighlight.type === ScannableSpeechbarRow.TYPE;
  }

  containerScanSelect(): boolean {
    return this.scanningModel && this.scanningModel.currentSelection &&
        this.scanningModel.currentSelection.type === ScannableSpeechbarRow.TYPE;
  }

  buttonScanHighlight(name: string): boolean {
    if (this.scanningModel && this.scanningModel.currentHighlight &&
        this.scanningModel.currentHighlight.type === ScannableButton.TYPE) {
      return (<ScannableButton> this.scanningModel.currentHighlight).name === name;
    } else {
      return false;
    }
  }

  buttonScanSelect(name: string): boolean {
    if (this.scanningModel && this.scanningModel.currentSelection &&
        this.scanningModel.currentSelection.type === ScannableButton.TYPE) {
      return (<ScannableButton> this.scanningModel.currentSelection).name === name;
    } else {
      return false;
    }
  }
}

class ScannableSpeechbarProvider extends Subscriber<ScanningModel> implements ScannableCollectionProvider {
  private rows: ScannableSpeechbarRow[];

  constructor(buttons: ScannableButton[], next: (ScanningModel) => void) {
    super(next);
    this.rows = [new ScannableSpeechbarRow(buttons, 0)];
  }

  getScannableCollections(): ScannableCollection[] {
    return this.rows;
  }
}

class ScannableSpeechbarRow extends ScannableCollection {
  static TYPE = 'SpeechbarRow';

  constructor(buttons: ScannableButton[], priority: number) {
    super(priority, ScannableSpeechbarRow.TYPE);
    buttons.forEach(button => this.addChild(button));
  }
}

class ScannableButton extends Scannable {
  static TYPE = 'SpeechbarButton';
  private _name: string;
  private _handler: () => void;

  constructor(name: string, handler: () => void, priority: number) {
    super(priority, ScannableButton.TYPE);
    this._name = name;
    this._handler = handler;
  }

  get name(): string {
    return this._name;
  }

  get handler(): () => void {
    return this._handler;
  }

  set name(name: string) {
    this._name = name;
  }

  set handler(handler: () => void) {
    this._handler = handler;
  }
}
