import { Component, OnInit } from '@angular/core';
import { ScanningService } from '../scanning.service';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  constructor(private scanningService: ScanningService, private configService: ConfigService) { }

  ngOnInit() {
  }

  scanningEnabled(): boolean {
    return this.configService.scanningConfig.enabled;
  }

  handleClick() {
    this.scanningService.handleInteraction();
  }

}
