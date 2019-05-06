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
import { Injectable } from '@angular/core';
import { ObzService } from './obz.service';
import { Observable, Observer } from 'rxjs';
import { OBFBoard } from './obfboard';
import { OBZBoardSet } from './obzboard-set';
import { PageStackService } from './page-stack.service';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private boardSet: OBZBoardSet;
  private currentBoardKey: string;
  private observer: Observer<OBFBoard>;

  constructor(
    private obzService: ObzService,
    private pageStackService: PageStackService
  ) {}

  private addObserver = (observer: Observer<OBFBoard>) => {
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
    this.currentBoardKey = boardKey;
    const board = this.boardSet.getBoard(this.currentBoardKey);
    this.observer.next(board);
    this.pageStackService.addPage(boardKey);
  }

  back() {
    const boardKey = this.pageStackService.back();
    if (boardKey) {
      this.navigateToBoard(boardKey);
    }
  }

  navigateToExternalBoard(boardKey: string) {
    this.obzService.loadBoardSet(boardKey);
  }

  home() {
    this.navigateToBoard(this.boardSet.rootBoardKey);
  }
}
