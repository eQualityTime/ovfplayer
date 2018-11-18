import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigService, ButtonDisplayConfig } from '../config.service';

@Component({
  selector: 'app-config-page',
  templateUrl: './config-page.component.html',
  styleUrls: ['./config-page.component.css']
})
export class ConfigPageComponent implements OnInit {

  @Input() boardURL: string;
  @Input() showIconsInSpeechbar: boolean;
  @Input() speakOnSpeechbarClick: boolean;
  @Input() displayedButtons: ButtonDisplayConfig;

  constructor(private configService: ConfigService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.boardURL = this.configService.boardURL;
    this.displayedButtons = this.configService.displayedButtons;
    this.showIconsInSpeechbar = this.configService.showIconsInSpeechbar;
    this.speakOnSpeechbarClick = this.configService.speakOnSpeechbarClick;

    const configURLParam = this.route.snapshot.queryParamMap.get('boardURL');
    if (configURLParam) {
      this.boardURL = configURLParam;
      this.save();
    }
  }

  save() {
    this.configService.boardURL = this.boardURL;
    this.configService.displayedButtons = this.displayedButtons;
    this.configService.showIconsInSpeechbar = this.showIconsInSpeechbar;
    this.configService.speakOnSpeechbarClick = this.speakOnSpeechbarClick;
    // TODO: some kind of validation
    this.router.navigate(['/main']);
  }
}
