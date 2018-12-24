/* ::START::LICENCE:: ::END::LICENCE:: */
import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { plainToClass } from 'class-transformer';
import { OBZBoardSet } from './obzboard-set';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BoardCacheService {

  private static BOARD_CACHE_KEY = 'ovfCurrentBoard';

  constructor(private localStorage: LocalStorage) { }

  public clear(): Observable<boolean> {
    this.log('Clearing local board cache');
    return this.localStorage.removeItem(BoardCacheService.BOARD_CACHE_KEY);
  }

  public retrieve(): Observable<OBZBoardSet> {
    return this.localStorage.getItem(BoardCacheService.BOARD_CACHE_KEY).pipe(map(data => {
      if (data) {
        this.log('Successfully loaded board from cache');
        // TODO: can we just use our normal deserialize here?
        const bs = <any>plainToClass(OBZBoardSet, data);
        // TODO: this is a bit of a hack....
        data.images.forEach((value: Blob, key: string) => {
          bs.images.set(key, value);
        });
        return (<OBZBoardSet>bs).resolveIntegrity();
      } else {
        return null;
      }
    }));
  }

  public save(boardSet: OBZBoardSet): Observable<boolean> {
    return this.localStorage.setItem(BoardCacheService.BOARD_CACHE_KEY, boardSet);
  }

  private log(message: string) {
    console.log(`BoardCacheService: ${message}`);
  }
}
