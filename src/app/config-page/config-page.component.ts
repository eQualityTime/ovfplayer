import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService, ButtonDisplayConfig } from '../config.service';

@Component({
  selector: 'app-config-page',
  templateUrl: './config-page.component.html',
  styleUrls: ['./config-page.component.css']
})
export class ConfigPageComponent implements OnInit {

  @Input() boardURL = '';
  @Input() displayedButtons: ButtonDisplayConfig;

  constructor(private configService: ConfigService, private router: Router) { }

  ngOnInit() {
    this.boardURL = this.configService.getBoardURL();
    this.displayedButtons = this.configService.getDisplayedButtons();
  }

  save() {
    this.configService.updateBoardURL(this.boardURL);
    this.configService.updateDisplayedButtons(this.displayedButtons);
    // TODO: some kind of validation
    this.router.navigate(['/main']);
  }
}
