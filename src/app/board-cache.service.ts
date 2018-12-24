/* ::START::LICENCE:: ::END::LICENCE:: */
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
