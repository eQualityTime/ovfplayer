import { Component, OnInit, Output } from '@angular/core';
import { PageService } from '../page.service';
import { SpeechbarService } from '../speechbar.service';
import { OBFPage, Button, LoadBoardAction } from '../obfpage';

@Component({
  selector: 'app-button-page',
  templateUrl: './button-page.component.html',
  styleUrls: ['./button-page.component.css']
})
export class ButtonPageComponent implements OnInit {

  @Output() page: OBFPage;

  actionPerformers: {[key: string]: () => void} = {
    ':clear' : this.speechbarService.clear.bind(this.speechbarService),
    ':backspace' : this.speechbarService.backspace.bind(this.speechbarService),
    ':speak' : this.speechbarService.speak.bind(this.speechbarService)
  };

  constructor(private pageService: PageService, private speechbarService: SpeechbarService) { }

  ngOnInit() {
    this.loadPage();
  }

  loadPage(): void {
    this.pageService.getPage().subscribe(
      page => this.page = page
    );
  }

  handleButtonClick(button: Button) {
    if (button.soundId) {
      const sound = this.page.getSound(button.soundId);

      if (sound && (sound.data || sound.url)) {
        const audioSound = new Audio(sound.data || sound.url);
        audioSound.play();
      }
    }

    let addToSpeechBar = true;
    if (button.actions.length > 0) {
      button.actions.forEach(action => this.performAction(action));
      addToSpeechBar = false;
    }

    if (button.loadBoardAction) {
      const loadBoardAction: LoadBoardAction = button.loadBoardAction;

      // TODO: handle path!
      if (loadBoardAction.dataUrl) {
        this.pageService.setPage(loadBoardAction.dataUrl);
        this.loadPage();
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
}
