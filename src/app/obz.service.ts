import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { ConfigService } from './config.service';
import { UrlUtils } from './url-utils';
import { OBZBoardSet } from './obzboard-set';
import { OBFBoard } from './obfboard';

import * as JSZip from 'jszip';
import { FatalOpenVoiceFactoryError, OpenVoiceFactoryError } from './errors';

interface ParsedBoard {
  path: string;
  board: OBFBoard;
}

interface ParsedImage {
  path: string;
  imageData: string;
}

interface ParsedSound {
  path: string;
  soundData: string;
}

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

    const boardURL = this.config.boardURL;
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
        this.observer.error(new FatalOpenVoiceFactoryError(`Failed to load obf from ${boardURL}`, err));
      }
    });
  }

  private getOBZFile(boardURL: string): Observable<Blob> {
    return this.http.get(boardURL, { responseType: 'blob' });
  }

  private loadOBZFile(boardURL: string) {

    const log = this.log;

    this.getOBZFile(boardURL).subscribe(blob => {

      const parseBoards = this.parseBoards;
      const parseImages = this.parseImages;
      const parseSounds = this.parseSounds;
      const observer    = this.observer;

      log(`Got some data of size ${blob.size}`);
      const zipper = new JSZip();
      zipper.loadAsync(blob).then(function(zip) {
        zip.file('manifest.json').async('text').then(function (manifest: string) {
          // log(`Manifest contents: ${manifest}`);
          const manifestJSON = JSON.parse(manifest);
          const boardSet     = new OBZBoardSet();
          boardSet.rootBoardKey = manifestJSON.root;

          parseBoards(zip, manifestJSON.paths.boards).subscribe({
            next(ret: ParsedBoard) {
              boardSet.setBoard(ret.path, ret.board);
            },
            error(error: any) {
              // error parsing a board
              observer.error(new FatalOpenVoiceFactoryError(`Error parsing boards for ${boardURL}`, error));
            },
            complete() {
              parseImages(zip, manifestJSON.paths.images).subscribe({
                next(ret: ParsedImage) {
                  boardSet.setImage(ret.path, ret.imageData);
                },
                error(error: any) {
                  // error loading images
                  observer.error(new FatalOpenVoiceFactoryError(`Error loading images for ${boardURL}`, error));
                },
                complete() {
                  parseSounds(zip, manifestJSON.paths.sounds).subscribe({
                    next(ret: ParsedSound) {
                      boardSet.setSound(ret.path, ret.soundData);
                    },
                    error(error: any) {
                      // error loading sounds
                      observer.error(new FatalOpenVoiceFactoryError(`Error loading sounds for ${boardURL}`, error));
                    },
                    complete() {
                      observer.next(boardSet);
                    }
                  });
                }
              });
            }
          });
        });
      }).catch(error => {
        // error loading zip file
        observer.error(new FatalOpenVoiceFactoryError(`Could not parse ${boardURL} as a zip file`, error));
      });
    },
    (error: HttpErrorResponse) => {
      // error downloading file
      this.observer.error(new FatalOpenVoiceFactoryError(`Failed to load file ${boardURL}: ${error.message}`));
    });
  }

  private parseImages = (zip, images): Observable<ParsedImage> => {
    this.log('Parsing images');
    const log = this.log;
    function loader(observer: Observer<ParsedImage>) {
      const promises = [];
      if (images) {
        Object.entries(images).forEach(([key, value]) => {
          // log(`Image key ${key} path ${value}`);
          const encoding = value.toString().toLowerCase().endsWith('.svg') ? 'text' : 'base64';
          promises.push(zip.file(value).async(encoding).then(function (contents) {
            // TODO: remove
            throw new TypeError('bum');
            // observer.next({
            //   path: value.toString(),
            //   imageData: contents
            // });
          }).catch(error => {
            // error loading image file
            observer.error(new FatalOpenVoiceFactoryError(`Error loading image file ${value.toString()}`, error));
          }));
        });
      }
      Promise.all(promises).then(() => {
        observer.complete();
      });
    }
    return new Observable(loader);
  }

  private parseSounds = (zip, sounds): Observable<ParsedSound> => {
    this.log('Parsing sounds');
    const log = this.log;
    function loader(observer: Observer<ParsedSound>) {
      const promises = [];
      if (sounds) {
        Object.entries(sounds).forEach(([key, value]) => {
          // log(`Sound key ${key} path ${value}`);
          promises.push(zip.file(value).async('base64').then(function (contents) {
            observer.next({
              path: value.toString(),
              soundData: contents
            });
          }).catch(error => {
            // error loading sound file
            observer.error(new FatalOpenVoiceFactoryError(`Error loading sound file ${value.toString()}`, error));
          }));
        });
      }
      Promise.all(promises).then(() => {
        observer.complete();
      });
    }
    return new Observable(loader);
  }

  private parseBoards = (zip, boards): Observable<ParsedBoard> => {
    this.log('Parsing boards');
    const log = this.log;
    function loader(observer: Observer<ParsedBoard>) {
      const promises = [];
      Object.entries(boards).forEach(([key, value]) => {
        // log(`Board key ${key} path ${value}`);
        promises.push(zip.file(value).async('text').then(function (contents) {
          observer.next({
            path: value.toString(),
            board: new OBFBoard().deserialize(JSON.parse(contents))
          });
        }).catch(error => {
          // error loading board
          observer.error(new FatalOpenVoiceFactoryError(`Error loading board ${value.toString}`, error));
        }));
      });

      Promise.all(promises).then(() => {
        observer.complete();
      });
    }
    return new Observable(loader);
  }

  private log(message: string) {
    console.log(`ObzService: ${message}`);
  }
}
