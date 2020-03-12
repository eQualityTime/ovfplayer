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
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from, of } from 'rxjs';
import { flatMap, catchError, first } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';
import { UrlUtils } from '../../url-utils';
import { OBZBoardSet } from '../../obzboard-set';
import { OBFBoard } from '../../obfboard';

import * as JSZip from 'jszip';
import { FatalOpenVoiceFactoryError, ErrorCodes } from '../../errors';
import { BoardCacheService } from '../board-cache/board-cache.service';
import { ProgressService } from '../progress/progress.service';

@Injectable({
  providedIn: 'root'
})
export class ObzService {

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private boardCache: BoardCacheService,
    private progress: ProgressService
  ) { }

  getBoardSet(): Observable<OBZBoardSet> {
    return this.loadBoardSet(this.config.boardURL);
  }

  public loadBoardSet(boardURL: string): Observable<OBZBoardSet> {
    return this.boardCache.retrieve().pipe(catchError(err => this.loadFromNetwork(boardURL)));
  }

  private loadFromNetwork(boardURL: string): Observable<OBZBoardSet> {

    this.progress.progress(ProgressService.message('Downloading'));
    this.log(`Loading ${boardURL} from internet`);

    const urlSlug = new UrlUtils().getSlug(boardURL);
    this.log(`Parsed url ${urlSlug}`);

    // Decide if we're loading an obz or an obf
    if (urlSlug.toLowerCase().endsWith('.obf')) {
      return this.loadOBFFile(boardURL);
    } else {
      // assume obz by default. For now.
      return this.loadOBZFile(boardURL);
    }
  }

  private cacheBoardSet = (boardURL: string, boardSet: OBZBoardSet): Observable<OBZBoardSet> => {
    this.progress.progress(ProgressService.message('Parsing'));
    this.log(`Blobifying ${boardURL}`);
    return boardSet.blobify(this.http, this.progress).pipe(
      flatMap(blobified => {
        this.progress.progress(ProgressService.message('Caching'));
        this.log(`Caching ${boardURL}`);
        return this.boardCache.save(blobified);
      }),
      first(),
      catchError(error => {
        console.error(`Cache of ${boardURL} failed`, error);
        // may as well carry on though as we have loaded the board
        return of(boardSet);
      })
    );
  }

  private loadOBFFile(boardURL: string): Observable<OBZBoardSet> {
    return this.http.get<OBFBoard>(boardURL).pipe(
      flatMap(page => {
        const boardSet = new OBZBoardSet();
        boardSet.rootBoardKey = 'root';
        boardSet.setBoard('root', new OBFBoard().deserialize(page));
        return this.cacheBoardSet(boardURL, boardSet);
      }),
      catchError(err => throwError(
        new FatalOpenVoiceFactoryError(ErrorCodes.OBF_LOAD_ERROR, `Failed to load obf from ${boardURL}`, err)
      )
    ));
  }

  private getOBZFile(boardURL: string): Observable<Blob> {
    return this.http.get(boardURL, { responseType: 'blob' }).pipe(
      catchError((error: HttpErrorResponse) => throwError(
        new FatalOpenVoiceFactoryError(ErrorCodes.OBZ_DOWNLOAD_ERROR, `Failed to download file ${boardURL}: ${error.message}`)
      ))
    );
  }

  private loadOBZFile(boardURL: string): Observable<OBZBoardSet> {

    return this.getOBZFile(boardURL).pipe(
      flatMap(blob => {
        return this.parseOBZFile(blob).pipe(
          catchError(error => throwError(
            new FatalOpenVoiceFactoryError(ErrorCodes.OBZ_PARSE_ERROR, `Could not parse ${boardURL} as a zip file`, error)
          ))
        );
      }),
      flatMap(boardSet => this.cacheBoardSet(boardURL, boardSet))
    );
  }

  parseOBZFile(blob: Blob): Observable<OBZBoardSet> {
    const parseBoard = this.parseBoard;
    const parseImage = this.parseImage;
    const parseSound = this.parseSound;
    const validate   = this.validate;
    const zipper = new JSZip();

    return from(zipper.loadAsync(blob).then(function(zip) {
      const manifestFile = zip.file('manifest.json');
      if (!manifestFile) {
        throw new FatalOpenVoiceFactoryError(ErrorCodes.MISSING_MANIFEST, 'No manifest file!');
      }
      return manifestFile.async('text').then(function (manifest: string) {

        let manifestJSON = null;
        try {
          manifestJSON = JSON.parse(manifest);
        } catch (error) {
          throw new FatalOpenVoiceFactoryError(ErrorCodes.MANIFEST_JSON_ERROR, 'manifest.json is not json', error);
        }
        const boardSet = new OBZBoardSet();
        boardSet.rootBoardKey = manifestJSON.root;

        let promises = [];
        promises = promises.concat(Object.values(manifestJSON.paths.boards).map(board => parseBoard(zip, board.toString(), boardSet)));

        if (manifestJSON.paths.images) {
          promises = promises.concat(Object.values(manifestJSON.paths.images).map(image => parseImage(zip, image.toString(), boardSet)));
        }

        if (manifestJSON.paths.sounds) {
          promises = promises.concat(Object.values(manifestJSON.paths.sounds).map(sound => parseSound(zip, sound.toString(), boardSet)));
        }

        return Promise.all(promises).then(() => validate(boardSet));
      }, function (fail) {
        // error loading manifest
        throw new FatalOpenVoiceFactoryError(ErrorCodes.MANIFEST_LOAD_ERROR, 'Could not load manifest.json', fail);
      });
    }, function (fail) {
      // error loading zip file
      throw new FatalOpenVoiceFactoryError(ErrorCodes.ZIP_PARSE_ERROR, 'Could not parse zip file', fail);
    }));
  }

  private validate(boardSet: OBZBoardSet): OBZBoardSet {

    // test that root board is in board set
    const rootBoard = boardSet.getBoard(boardSet.rootBoardKey);
    if (!rootBoard) {
      throw new FatalOpenVoiceFactoryError(
        ErrorCodes.INVALID_ROOT,
        `OBZ specifies a root of '${boardSet.rootBoardKey}' but this path is not present`
      );
    }

    // TODO: validate all paths and references in board set
    return boardSet;
  }

  private parseImage = (zip, image: string, boardSet: OBZBoardSet): Promise<void> => {
    const imageFile = zip.file(image);
    if (!imageFile) {
      throw new FatalOpenVoiceFactoryError(ErrorCodes.IMAGE_NOT_THERE, `Image ${image} is not present in obz`);
    }
    const imagePromise = imageFile.async('blob').then(function (contents) {
      boardSet.setImage(image, contents);
    }).catch(error => {
      // error loading image file
      throw new FatalOpenVoiceFactoryError(ErrorCodes.IMAGE_LOAD_ERROR, `Error loading image file ${image}`, error);
    });

    return imagePromise;
  }

  private parseSound = (zip, sound: string, boardSet: OBZBoardSet): Promise<void> => {
    const soundFile = zip.file(sound);
    if (!soundFile) {
      throw new FatalOpenVoiceFactoryError(ErrorCodes.SOUND_NOT_THERE, `Sound ${sound} is not present in obz`);
    }
    const soundPromise = soundFile.async('base64').then(function (contents) {
      boardSet.setSound(sound, contents);
    }).catch(error => {
      // error loading sound file
      throw new FatalOpenVoiceFactoryError(ErrorCodes.SOUND_LOAD_ERROR, `Error loading sound file ${sound}`, error);
    });

    return soundPromise;
  }

  private parseBoard = (zip, board: string, boardSet: OBZBoardSet): Promise<void> => {
    const boardFile = zip.file(board);
    if (!boardFile) {
      throw new FatalOpenVoiceFactoryError(ErrorCodes.BOARD_NOT_THERE, `Board ${board} is not present in obz`);
    }
    const boardPromise = boardFile.async('text').then(function (contents) {
      boardSet.setBoard(board, new OBFBoard().deserialize(JSON.parse(contents)));
    }).catch(error => {
      // error loading board
      throw new FatalOpenVoiceFactoryError(ErrorCodes.BOARD_PARSE_ERROR, `Error parsing board ${board}`, error);
    });

    return boardPromise;
  }

  private log(message: string) {
    console.log(`ObzService: ${message}`);
  }
}
