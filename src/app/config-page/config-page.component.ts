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
  @Input() showIconsInSpeechbar = false;
  @Input() displayedButtons: ButtonDisplayConfig;

  constructor(private configService: ConfigService, private router: Router) { }

  ngOnInit() {
    this.boardURL = this.configService.boardURL;
    this.displayedButtons = this.configService.displayedButtons;
    this.showIconsInSpeechbar = this.configService.showIconsInSpeechbar;
  }

  save() {
    this.configService.boardURL = this.boardURL;
    this.configService.displayedButtons = this.displayedButtons;
    this.configService.showIconsInSpeechbar = this.showIconsInSpeechbar;
    // TODO: some kind of validation
    this.router.navigate(['/main']);
  }
}
