import { Injectable } from '@angular/core';
import { ObzService } from './obz.service';
import { Observable, Observer } from 'rxjs';
import { OBFBoard } from './obfboard';
import { OBZBoardSet } from './obzboard-set';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private boardSet: OBZBoardSet;
  private currentBoardKey: string;
  private observer: Observer<OBFBoard>;

  constructor(private obzService: ObzService) {}

  private addObserver = (observer: Observer<OBFBoard>) => {
    // TODO: check we don't already have an observer
    this.observer = observer;
    this.obzService.getBoardSet().subscribe(boardSet => {
      this.setBoardSet(boardSet);
    });
  }

  private setBoardSet(boardSet: OBZBoardSet) {
    this.boardSet = boardSet;
    this.currentBoardKey = boardSet.rootBoardKey;
    this.home();
  }

  getBoard(): Observable<OBFBoard> {
    return new Observable<OBFBoard>(this.addObserver);
  }

  navigateToBoard(boardKey: string) {
    // console.log(`Navigating to page ${boardKey}`);
    this.currentBoardKey = boardKey;
    // TODO: validate this board exists!
    const board = this.boardSet.getBoard(this.currentBoardKey);
    this.observer.next(board);
  }

  home() {
    this.navigateToBoard(this.boardSet.rootBoardKey);
  }
}
