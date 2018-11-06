import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { OBFPage } from './obfpage';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  // TODO: delete these eventually, but leaving here for now to copy into config URL!!!
//  private pageURL = 'https://openboards.s3.amazonaws.com/examples/url_images.obf';
//  private pageURL = 'https://openboards.s3.amazonaws.com/examples/inline_images.obf';
//  private pageURL = 'https://openboards.s3.amazonaws.com/examples/simple.obf';

  private currentPage: string = null;

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) { }

  private log(message: string) {
    console.log(`PageService: ${message}`);
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // console.error(error); // log to console instead

      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  setPage(pageURL: string) {
    console.log(`Setting current page to ${pageURL}`);
    this.currentPage = pageURL;
  }

  getPage(): Observable<OBFPage> {

    if (this.currentPage === null) {
      this.currentPage = this.config.getBoardURL();
    }
    return this.http.get<OBFPage>(this.currentPage).pipe(
      map(page => {
        console.log(page);
        return new OBFPage().deserialize(page);
      }),
      catchError(this.handleError<OBFPage>('getPage'))
    );
  }
}
