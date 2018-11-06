import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-config-page',
  templateUrl: './config-page.component.html',
  styleUrls: ['./config-page.component.css']
})
export class ConfigPageComponent implements OnInit {

  @Input() boardURL = '';

  constructor(private configService: ConfigService, private router: Router) { }

  ngOnInit() {
    this.boardURL = this.configService.getBoardURL();
  }

  save() {
    this.configService.updateBoardURL(this.boardURL);
    // TODO: some kind of validation
    this.router.navigate(['/main']);
  }
}
