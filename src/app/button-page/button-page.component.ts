import { Component, OnInit, Output, OnDestroy } from '@angular/core';
import { BoardService } from '../board.service';
import { SpeechbarService } from '../speechbar.service';
import { OBFBoard, Button, LoadBoardAction, Grid } from '../obfboard';
import { Subscription, Subscriber } from 'rxjs';
import { ScanningService, ScanningModel, ScannableCollectionProvider, ScannableCollection, Scannable } from '../scanning.service';

@Component({
  selector: 'app-button-page',
  templateUrl: './button-page.component.html',
  styleUrls: ['./button-page.component.css']
})
export class ButtonPageComponent implements OnInit, OnDestroy {

  @Output() board: OBFBoard;
  private scanningModel: ScanningModel;
  private boardSubscription: Subscription;
  private scanningSubscription: Subscription;
  private buttonProvider: ScannableButtonRowProvider;

  actionPerformers: {[key: string]: () => void} = {
    ':clear' : this.speechbarService.clear.bind(this.speechbarService),
    ':backspace' : this.speechbarService.backspace.bind(this.speechbarService),
    ':speak' : this.speechbarService.speak.bind(this.speechbarService),
    ':home' : this.boardService.home.bind(this.boardService),
    ':space': this.speechbarService.space.bind(this.speechbarService)
  };

  constructor(private boardService: BoardService, private speechbarService: SpeechbarService, private scanningService: ScanningService) { }

  ngOnInit() {
    this.loadBoard();
  }

  ngOnDestroy() {
    this.boardSubscription.unsubscribe();
    this.scanningSubscription.unsubscribe();
  }

  loadBoard(): void {
    this.boardSubscription = this.boardService.getBoard().subscribe(this.setBoard);
  }

  private setBoard = (board: OBFBoard) => {
    if (this.scanningSubscription) {
      this.scanningSubscription.unsubscribe();
    }
    this.board = board;
    this.registerWithScanner();
  }

  registerWithScanner(): void {
    this.buttonProvider = new ScannableButtonRowProvider(this.board, this.updateScanning);
    this.scanningSubscription = this.scanningService.getScanningModel().subscribe(this.buttonProvider);
  }

  private updateScanning = (scanningModel: ScanningModel) => {
    this.scanningModel = scanningModel;

    if (this.scanningModel.currentSelection && this.scanningModel.currentSelection.type === ScannableButton.TYPE) {
      const button = (<ScannableButton> this.scanningModel.currentSelection).button;
      this.handleButtonClick(button);
    }
  }

  handleButtonClick(button: Button) {
    if (button.soundId) {
      const sound = this.board.getSound(button.soundId);

      if (sound) {
        const soundSource = sound.getSource();

        if (soundSource) {
          const audioSound = new Audio(soundSource);
          audioSound.play();
        }
      }
    }

    let addToSpeechBar = true;
    if (button.actions.length > 0) {
      button.actions.forEach(action => this.performAction(button, action));
      addToSpeechBar = false;
    }

    if (button.loadBoardAction) {
      const loadBoardAction: LoadBoardAction = button.loadBoardAction;

      if (loadBoardAction.path) {
        this.boardService.navigateToBoard(loadBoardAction.path);
      } else if (loadBoardAction.dataUrl) {
        this.boardService.navigateToExternalBoard(loadBoardAction.dataUrl);
      } else if (loadBoardAction.url) {
        // TODO: redirect whole page to site!
      }

      // at this point we would still be adding things to the speech bar
      // we only want to do this if there is a vocalisation
      // so if there isn't a vocalisation; set addToSpeechBar to false
      if (!button.vocalization) {
        addToSpeechBar = false;
      }
    }

    if (addToSpeechBar) {
      this.speechbarService.addButton(button);
    }
  }

  performAction(button: Button, action: string) {

    if (action.startsWith('+')) {
      this.speechbarService.appendButton(button, action);
    } else {
      const actionPerformer = this.actionPerformers[action];

      if (actionPerformer) {
        actionPerformer();
      } else {
        console.log('Unsupported action: ' + action);
      }
    }
  }

  calculateRowHeight(): string {
    return (100 / this.board.grid.rows).toString() + '%';
  }
}

class ScannableButtonRowProvider extends Subscriber<ScanningModel> implements ScannableCollectionProvider {
  private rows: ScannableButtonRow[];

  constructor(board: OBFBoard, nextHandler: (ScanningModel) => void) {
    super(nextHandler);
    this.rows = board.grid.order.map((row, index) => new ScannableButtonRow(board, row, index + 1));
  }

  getScannableCollections(): ScannableCollection[] {
    return this.rows;
  }
}

class ScannableButtonRow extends ScannableCollection {
  static TYPE = 'OBFButtonRow';
  displayButtons = [];

  constructor(board: OBFBoard, row: string[], priority: number) {
    super(priority, ScannableButtonRow.TYPE);

    row.forEach((buttonId, index) => {
      if (buttonId) {
        const button = new ScannableButton(board.getButton(buttonId), index);
        this.addChild(button);
        this.displayButtons.push(button);
      } else {
        this.displayButtons.push(undefined);
      }
    });
  }
}

class ScannableButton extends Scannable {
  static TYPE = 'OBFButton';
  private _button: Button;

  constructor(button: Button, priority: number) {
    super(priority, ScannableButton.TYPE);
    this._button = button;
  }

  get button(): Button {
    return this._button;
  }

  set button(button: Button) {
    this._button = button;
  }
}
