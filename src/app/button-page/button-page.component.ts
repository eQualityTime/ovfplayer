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
import { Component, OnInit, Output, OnDestroy } from '@angular/core';
import { BoardService } from '../board.service';
import { SpeechbarService } from '../speechbar.service';
import { OBFBoard, Button, LoadBoardAction } from '../obfboard';
import { Subscription, Subscriber } from 'rxjs';
import { ScanningService, ScanningModel, ScannableCollectionProvider, ScannableCollection, Scannable } from '../scanning.service';
import { ConfigService } from '../config.service';
import { CustomActionService } from '../custom-action.service';

class ScannableButton extends Scannable {
  static TYPE = 'OBFButton';
  private _button: Button;
  private provider: ScannableButtonRowProvider;

  constructor(provider: ScannableButtonRowProvider, button: Button, priority: number) {
    super(priority, ScannableButton.TYPE);
    this._button = button;
    this.provider = provider;
  }

  get button(): Button {
    return this._button;
  }

  set button(button: Button) {
    this._button = button;
  }

  isHighlighted(): boolean {
    return this.provider.getScanningHighlight() === this;
  }

  isSelection(): boolean {
    return this.provider.getScanningSelection() === this;
  }
}

class ScannableButtonRow extends ScannableCollection {
  static TYPE = 'OBFButtonRow';
  private provider: ScannableButtonRowProvider;
  displayButtons = [];
  rowHeight: string;

  constructor(provider: ScannableButtonRowProvider, board: OBFBoard, row: string[], priority: number, rowHeight: string) {
    super(priority, ScannableButtonRow.TYPE);
    this.provider = provider;
    this.rowHeight = rowHeight;

    row.forEach((buttonId, index) => {
      if (buttonId) {
        const button = new ScannableButton(provider, board.getButton(buttonId), index);
        this.addChild(button);
        this.displayButtons.push(button);
      } else {
        this.displayButtons.push(undefined);
      }
    });
  }

  isHighlighted(): boolean {
    return this.provider.getScanningHighlight() === this;
  }

  isSelection(): boolean {
    return this.provider.getScanningSelection() === this;
  }
}

class ScannableButtonRowProvider extends Subscriber<ScanningModel> implements ScannableCollectionProvider {
  private rows: ScannableButtonRow[];
  private scanningModel: ScanningModel;

  constructor(board: OBFBoard, buttonPressHandler: (Button) => void) {
    super((scanningModel: ScanningModel) => {
      this.scanningModel = scanningModel;

      if (this.scanningModel.currentSelection && this.scanningModel.currentSelection.type === ScannableButton.TYPE) {
        const button = (<ScannableButton>this.scanningModel.currentSelection).button;
        buttonPressHandler(button);
      }
    });
    const rowHeight = (100 / board.grid.rows).toString() + '%';
    this.rows = board.grid.order.map((row, index) => new ScannableButtonRow(this, board, row, index + 1, rowHeight));
  }

  getScannableCollections(): ScannableCollection[] {
    return this.rows;
  }

  getScanningHighlight(): Scannable {
    return this.scanningModel && this.scanningModel.currentHighlight;
  }

  getScanningSelection(): Scannable {
    return this.scanningModel && this.scanningModel.currentSelection;
  }
}

@Component({
  selector: 'app-button-page',
  templateUrl: './button-page.component.html',
  styleUrls: ['./button-page.component.css']
})
export class ButtonPageComponent implements OnInit, OnDestroy {

  @Output()
  board: OBFBoard;

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

  constructor(
    private boardService: BoardService,
    private speechbarService: SpeechbarService,
    private scanningService: ScanningService,
    private configService: ConfigService,
    private customActionService: CustomActionService
  ) { }

  ngOnInit() {
    this.loadBoard();
  }

  ngOnDestroy() {
    if (this.boardSubscription) {
      this.boardSubscription.unsubscribe();
    }

    if (this.scanningSubscription) {
      this.scanningSubscription.unsubscribe();
    }
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
    this.buttonProvider = new ScannableButtonRowProvider(this.board, this.handleButtonClick.bind(this));
    this.scanningSubscription = this.scanningService.getScanningModel().subscribe(this.buttonProvider);
  }

  handleButtonClick(button: Button) {
    let soundToPlay = false;

    if (button.soundId) {
      const sound = this.board.getSound(button.soundId);

      if (sound) {
        const soundSource = sound.getSource();

        if (soundSource) {
          soundToPlay = true;
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

      // don't say the button if there's also a sound... that'd be weird...
      if (!soundToPlay && this.configService.buttonBehaviourConfig.speakOnTrigger) {
        this.speechbarService.sayButton(button);
      }
    }
  }

  performAction(button: Button, action: string) {

    if (action.startsWith('+')) {
      this.speechbarService.appendButton(button, action);
    } else if (action.startsWith(':ext')) {
      this.customActionService.handle(button, action);
    } else {
      const actionPerformer = this.actionPerformers[action];

      if (actionPerformer) {
        actionPerformer();
      } else {
        console.log('Unsupported action: ' + action);
      }
    }
  }
}
