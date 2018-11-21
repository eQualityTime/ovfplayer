import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { ConfigService } from './config.service';
import { UrlUtils } from './url-utils';
import { OBZBoardSet } from './obzboard-set';
import { OBFBoard } from './obfboard';

import * as JSZip from 'jszip';

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
    // TODO: test if we already have an observer and error?
    this.observer = observer;

    // Decide if we're loading an obz or an obf
    const urlSlug = new UrlUtils().getSlug(this.config.boardURL);
    this.log(`Parsed url ${urlSlug}`);

    if (urlSlug.toLowerCase().endsWith('.obf')) {
      this.loadOBFFile();
    } else {
      // assume obz by default. For now.
      this.loadOBZFile();
    }
  }

  private loadOBFFile() {
    this.http.get<OBFBoard>(this.config.boardURL).subscribe({
      next: (page) => {
        const boardSet = new OBZBoardSet();
        boardSet.rootBoardKey = 'root';
        boardSet.setBoard('root', new OBFBoard().deserialize(page));
        this.observer.next(boardSet);
      }
    });
  }

  private getOBZFile(): Observable<Blob> {
    return this.http.get(this.config.boardURL, { responseType: 'blob' });
  }

  private loadOBZFile() {

    const log = this.log;

    this.getOBZFile().subscribe(blob => {

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
            complete() {
              parseImages(zip, manifestJSON.paths.images).subscribe({
                next(ret: ParsedImage) {
                  boardSet.setImage(ret.path, ret.imageData);
                },
                complete() {
                  parseSounds(zip, manifestJSON.paths.sounds).subscribe({
                    next(ret: ParsedSound) {
                      boardSet.setSound(ret.path, ret.soundData);
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
      });
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
            observer.next({
              path: value.toString(),
              imageData: contents
            });
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

