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
import { OBFBoard } from './obfboard';
import { ImageResolver } from './image-resolver';
import { SoundResolver } from './sound-resolver';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Observable, forkJoin, of } from 'rxjs';
import { ProgressService } from './progress.service';

export class OBZBoardSet implements ImageResolver, SoundResolver {

  private boards: Map<string, OBFBoard> = new Map();
  private images: Map<string, Blob> = new Map();
  private sounds: Map<string, string> = new Map();

  rootBoardKey: string;

  public getBoard(boardKey: string): OBFBoard {
    return this.boards.get(boardKey);
  }

  public setBoard(boardKey: string, board: OBFBoard) {
    this.boards.set(boardKey, board);
    board.setImageResolver(this);
    board.setSoundResolver(this);
  }

  public setImage(imageKey: string, imageData: Blob) {
    this.images.set(imageKey, imageData);
  }

  public setSound(soundKey: string, soundData: string) {
    this.sounds.set(soundKey, soundData);
  }

  public getImageData(imagePath: string): Blob {
    return this.images.get(imagePath);
  }

  public getSoundData(soundPath: string): string {
    return this.sounds.get(soundPath);
  }

  public blobify(httpClient: HttpClient, progress: ProgressService): Observable<OBZBoardSet> {

    // TODO: go through boards and load other boards from board actions (until there are no more new ones!)

    // TODO: error handling might be nice...

    // go through all url & data images & sounds and blobify into maps
    progress.progress(ProgressService.message('Pre-caching images'));
    return this.blobifyImages(httpClient).pipe(
      map(imageResult => this)
    );

    // TODO: sounds
  }

  private blobifyImages(httpClient: HttpClient): Observable<boolean> {

    console.log('blobifyImages');
    const observables = [];

    this.boards.forEach(board => {
      board.images.forEach(image => {
        // if image already has a path, then don't worry
        if (!image.path) {
          // try data first
          if (image.data && image.contentType) {
            const key = `data:${image.id}`;
            // TODO: we could use the content type from here that we're stripping off
            const data = image.data.substr(image.data.indexOf(',') + 1);
            this.setImage(key, this.base64ToBlob(data, image.contentType));
            // set path to key so render code will look up blob in images
            image.path = key;
            // remove data as we don't need to cache it too
            image.data = null;
          } else if (image.url) {
            // load url into blob
            console.log(`Loading image ${image.url}`);
            observables.push(httpClient.get(image.url, { responseType: 'blob' }).pipe(
              tap(blob => {
                const key = `url:${image.id}`;
                this.setImage(key, blob);
                image.path = key;
                image.url = null;
              })
            ));
          }
        }
      });
    });

    return observables.length > 0 ? forkJoin(...observables) : of(true);
  }

  private base64ToBlob(data: string, type: string): Blob {
    const byteArray = new Uint8Array(Array.from(atob(data)).map(char => char.charCodeAt(0)));
    return new Blob([byteArray], { type: type });
  }
}
