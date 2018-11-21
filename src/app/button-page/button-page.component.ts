import { Component, OnInit, Output } from '@angular/core';
import { BoardService } from '../board.service';
import { SpeechbarService } from '../speechbar.service';
import { OBFBoard, Button, LoadBoardAction } from '../obfboard';

@Component({
  selector: 'app-button-page',
  templateUrl: './button-page.component.html',
  styleUrls: ['./button-page.component.css']
})
export class ButtonPageComponent implements OnInit {

  @Output() board: OBFBoard;

  actionPerformers: {[key: string]: () => void} = {
    ':clear' : this.speechbarService.clear.bind(this.speechbarService),
    ':backspace' : this.speechbarService.backspace.bind(this.speechbarService),
    ':speak' : this.speechbarService.speak.bind(this.speechbarService),
    ':home' : this.boardService.home.bind(this.boardService)
  };

  constructor(private boardService: BoardService, private speechbarService: SpeechbarService) { }

  ngOnInit() {
    this.loadBoard();
  }

  loadBoard(): void {
    this.boardService.getBoard().subscribe(this.setBoard);
  }

  private setBoard = (board: OBFBoard) => {
    this.board = board;
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
      button.actions.forEach(action => this.performAction(action));
      addToSpeechBar = false;
    }

    if (button.loadBoardAction) {
      const loadBoardAction: LoadBoardAction = button.loadBoardAction;

      if (loadBoardAction.path) {
        this.boardService.navigateToBoard(loadBoardAction.path);
      } else if (loadBoardAction.dataUrl) {
        // TODO: fix this back up!
        // this.pageService.setPage(loadBoardAction.dataUrl);
        // TODO: shouldn't need to call loadPage anymore!
        // this.loadPage();
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

  performAction(action: string) {
    const actionPerformer = this.actionPerformers[action];

    if (actionPerformer) {
      actionPerformer();
    } else {
      console.log('Unsupported action: ' + action);
    }
  }

  calculateRowHeight(): string {
    return (100 / this.board.grid.rows).toString() + '%';
  }
}
