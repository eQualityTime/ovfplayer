import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { ConfigService } from './config.service';
import { UrlUtils } from './url-utils';
import { OBZBoardSet } from './obzboard-set';
import { OBFBoard } from './obfboard';

import * as JSZip from 'jszip';
import { FatalOpenVoiceFactoryError, ErrorCodes } from './errors';

@Injectable({
  providedIn: 'root'
})
export class ObzService {

  private observer: Observer<OBZBoardSet>;

  constructor(private http: HttpClient, private config: ConfigService) { }

  getBoardSet(): Observable<OBZBoardSet> {
    return new Observable<OBZBoardSet>(this.addObserver);
  }

  addObserver = (observer: Observer<OBZBoardSet>) => {
    this.observer = observer;

    this.loadBoardSet(this.config.boardURL);
  }

  public loadBoardSet(boardURL: string) {
    // Decide if we're loading an obz or an obf
    const urlSlug = new UrlUtils().getSlug(boardURL);
    this.log(`Parsed url ${urlSlug}`);

    if (urlSlug.toLowerCase().endsWith('.obf')) {
      this.loadOBFFile(boardURL);
    } else {
      // assume obz by default. For now.
      this.loadOBZFile(boardURL);
    }
  }

  private loadOBFFile(boardURL: string) {
    this.http.get<OBFBoard>(boardURL).subscribe({
      next: (page) => {
        const boardSet = new OBZBoardSet();
        boardSet.rootBoardKey = 'root';
        boardSet.setBoard('root', new OBFBoard().deserialize(page));
        this.observer.next(boardSet);
      },
      error: (err) => {
        this.observer.error(new FatalOpenVoiceFactoryError(ErrorCodes.OBF_LOAD_ERROR, `Failed to load obf from ${boardURL}`, err));
      }
    });
  }

  private getOBZFile(boardURL: string): Observable<Blob> {
    return this.http.get(boardURL, { responseType: 'blob' });
  }

  private loadOBZFile(boardURL: string) {
    this.getOBZFile(boardURL).subscribe(
      (blob: Blob) => {
        this.parseOBZFile(blob).then(boardSet => {
          this.observer.next(boardSet);
        }).catch(error => {
          // error loading zip file
          throw new FatalOpenVoiceFactoryError(ErrorCodes.OBZ_PARSE_ERROR, `Could not parse ${boardURL} as a zip file`, error);
        });
      },
      (error: HttpErrorResponse) => {
        // error downloading file
        this.observer.error(
          new FatalOpenVoiceFactoryError(ErrorCodes.OBZ_DOWNLOAD_ERROR, `Failed to download file ${boardURL}: ${error.message}`)
        );
      }
    );
  }

  parseOBZFile(blob: Blob): Promise<OBZBoardSet> {
    const parseBoard = this.parseBoard;
    const parseImage = this.parseImage;
    const parseSound = this.parseSound;
    const zipper = new JSZip();

    return zipper.loadAsync(blob).then(function(zip) {
      const manifestFile = zip.file('manifest.json');
      if (!manifestFile) {
        throw new FatalOpenVoiceFactoryError(ErrorCodes.MISSING_MANIFEST, 'No manifest file!');
      }
      return manifestFile.async('text').then(function (manifest: string) {
        const manifestJSON = JSON.parse(manifest);
        const boardSet     = new OBZBoardSet();
        boardSet.rootBoardKey = manifestJSON.root;

        let promises = [];
        promises = promises.concat(Object.values(manifestJSON.paths.boards).map(board => parseBoard(zip, board.toString(), boardSet)));

        if (manifestJSON.paths.images) {
          promises = promises.concat(Object.values(manifestJSON.paths.images).map(image => parseImage(zip, image.toString(), boardSet)));
        }

        if (manifestJSON.paths.sounds) {
          promises = promises.concat(Object.values(manifestJSON.paths.sounds).map(sound => parseSound(zip, sound.toString(), boardSet)));
        }

        return Promise.all(promises).then(() => boardSet);
      }, function (fail) {
        // error loading manifest
        throw new FatalOpenVoiceFactoryError(ErrorCodes.MANIFEST_LOAD_ERROR, `Could not load manifest.json`, fail);
      });
    }, function (fail) {
      // error loading zip file
      throw new FatalOpenVoiceFactoryError(ErrorCodes.ZIP_PARSE_ERROR, `Could not parse zip file`, fail);
    });
  }

  private parseImage = (zip, image: string, boardSet: OBZBoardSet): Promise<void> => {
    const encoding = image.toLowerCase().endsWith('.svg') ? 'text' : 'base64';
    const imagePromise = zip.file(image).async(encoding).then(function (contents) {
      boardSet.setImage(image, contents);
    }).catch(error => {
      // error loading image file
      throw new FatalOpenVoiceFactoryError(ErrorCodes.IMAGE_LOAD_ERROR, `Error loading image file ${image}`, error);
    });

    return imagePromise;
  }

  private parseSound = (zip, sound: string, boardSet: OBZBoardSet): Promise<void> => {
    const soundPromise = zip.file(sound).async('base64').then(function (contents) {
      boardSet.setSound(sound, contents);
    }).catch(error => {
      // error loading sound file
      throw new FatalOpenVoiceFactoryError(ErrorCodes.SOUND_LOAD_ERROR, `Error loading sound file ${sound}`, error);
    });

    return soundPromise;
  }

  private parseBoard = (zip, board: string, boardSet: OBZBoardSet): Promise<void> => {
    const boardPromise = zip.file(board).async('text').then(function (contents) {
      boardSet.setBoard(board, new OBFBoard().deserialize(JSON.parse(contents)));
    }).catch(error => {
      // error loading board
      throw new FatalOpenVoiceFactoryError(ErrorCodes.BOARD_LOAD_ERROR, `Error loading board ${board}`, error);
    });

    return boardPromise;
  }

  private log(message: string) {
    console.log(`ObzService: ${message}`);
  }
}
