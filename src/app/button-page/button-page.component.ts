import { Component, OnInit, Output, OnDestroy } from '@angular/core';
import { BoardService } from '../board.service';
import { SpeechbarService } from '../speechbar.service';
import { OBFBoard, Button, LoadBoardAction } from '../obfboard';
import { Subscription, Subscriber } from 'rxjs';
import { ScanningService, ScanningModel, ScannableCollectionProvider, ScannableCollection, Scannable } from '../scanning.service';
import { ThrowStmt } from '@angular/compiler';

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
    this.board = board;
    this.registerWithScanner();
  }

  registerWithScanner(): void {
    this.scanningSubscription = this.scanningService.getScanningModel().subscribe(
      new ScannableButtonRowProvider(this.board.grid.order, this.updateScanning)
    );
  }

  private updateScanning = (scanningModel: ScanningModel) => {
    this.scanningModel = scanningModel;

    if (this.scanningModel.currentSelection && this.scanningModel.currentSelection.type === ScannableButton.TYPE) {
      const button = this.board.getButton((<ScannableButton> this.scanningModel.currentSelection).buttonId);
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

  currentScanHighlightRow(row: string[]): boolean {
    const highlight = this.scanningModel && this.scanningModel.currentHighlight;
    if (highlight && highlight.type === ScannableButtonRow.TYPE) {
      return row === (<ScannableButtonRow> highlight).row;
    } else {
      return false;
    }
  }

  currentScanSelectRow(row: string[]): boolean {
    const selection = this.scanningModel && this.scanningModel.currentSelection;
    if (selection && selection.type === ScannableButtonRow.TYPE) {
      return row === (<ScannableButtonRow> selection).row;
    } else {
      return false;
    }
  }

  currentScanHighlightCell(cell: string): boolean {
    const highlight = this.scanningModel && this.scanningModel.currentHighlight;
    if (highlight && highlight.type === ScannableButton.TYPE) {
      return cell === (<ScannableButton> highlight).buttonId;
    } else {
      return false;
    }
  }

  currentScanSelectCell(cell: string): boolean {
    const selection = this.scanningModel && this.scanningModel.currentSelection;
    if (selection && selection.type === ScannableButton.TYPE) {
      return cell === (<ScannableButton> selection).buttonId;
    } else {
      return false;
    }
  }
}

class ScannableButtonRowProvider extends Subscriber<ScanningModel> implements ScannableCollectionProvider {
  private rows: ScannableButtonRow[];

  constructor(rawRows: string[][], next: (ScanningModel) => void) {
    super(next);
    this.rows = rawRows.map((row, index) => new ScannableButtonRow(row, index));
  }

  getScannableCollections(): ScannableCollection[] {
    return this.rows;
  }
}

class ScannableButtonRow extends ScannableCollection {
  static TYPE = 'OBFButtonRow';
  private _row: string[];

  constructor(row: string[], priority: number) {
    super(priority, ScannableButtonRow.TYPE);
    this._row = row;
    this._row.forEach((buttonId, index) => {
      this.addChild(new ScannableButton(buttonId, index));
    });
  }

  get row(): string[] {
    return this._row;
  }

  set row(row: string[]) {
    this._row = row;
  }
}

class ScannableButton extends Scannable {
  static TYPE = 'OBFButton';
  private _buttonId: string;

  constructor(buttonId: string, priority: number) {
    super(priority, ScannableButton.TYPE);
    this._buttonId = buttonId;
  }

  get buttonId(): string {
    return this._buttonId;
  }

  set buttonId(buttonId: string) {
    this._buttonId = buttonId;
  }
}
