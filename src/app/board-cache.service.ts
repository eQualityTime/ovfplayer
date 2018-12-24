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
import { LocalStorage } from '@ngx-pwa/local-storage';
import { OBZBoardSet } from './obzboard-set';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { OBFBoard } from './obfboard';

@Injectable({
  providedIn: 'root'
})
export class BoardCacheService {

  private static BOARD_CACHE_KEY = 'ovfCurrentBoard';

  constructor(private localStorage: LocalStorage) { }

  public clear(): Observable<boolean> {
    this.log('Clearing local board cache');
    return this.localStorage.removeItem(BoardCacheService.BOARD_CACHE_KEY).pipe(first());
  }

  public retrieve(): Observable<OBZBoardSet> {
    return this.localStorage.getItem(BoardCacheService.BOARD_CACHE_KEY).pipe(map(data => {
      if (data) {
        this.log('Successfully loaded board from cache');

        // TODO: move this to static method inside OBZBoardSet?
        const bs = new OBZBoardSet();
        bs.rootBoardKey = data.rootBoardKey;
        data.images.forEach((value: Blob, key: string) => {
          bs.setImage(key, value);
        });
        data.sounds.forEach((value: string, key: string) => {
          bs.setSound(key, value);
        });
        data.boards.forEach((value: object, key: string) => {
          const board = new OBFBoard().deserialize(value);
          board.setImageResolver(bs);
          board.setSoundResolver(bs);
          bs.setBoard(key, board);
        });
        return bs;
      } else {
        return null;
      }
    }), first());
  }

  public save(boardSet: OBZBoardSet): Observable<boolean> {
    return this.localStorage.setItem(BoardCacheService.BOARD_CACHE_KEY, boardSet).pipe(first());
  }

  private log(message: string) {
    console.log(`BoardCacheService: ${message}`);
  }
}
