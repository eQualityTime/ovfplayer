import { Injectable } from '@angular/core';
import { LocalStorage } from 'ngx-store';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  @LocalStorage() boardURL = 'https://openboards.s3.amazonaws.com/examples/url_images.obf';

  constructor() { }

  getBoardURL(): string {
    return this.boardURL;
  }

  updateBoardURL(boardURL: string) {
    this.boardURL = boardURL;
  }
}
