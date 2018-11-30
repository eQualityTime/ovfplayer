import { Component, OnInit } from '@angular/core';
import { ErrorService, ErrorDetails } from '../error.service';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {

  private error: ErrorDetails;

  constructor(private errorService: ErrorService) { }

  ngOnInit() {
    this.error = this.errorService.lastError;
  }

  get errorHRef(): string {
    let href = 'mailto:support@equalitytime.co.uk';
    href += '?subject=' + encodeURI(this.error.message);
    href += '&body=' + encodeURI(this.errorAsString());
    return href;
  }

  private errorAsString(): string {
    let errorString = 'Location: ' + this.error.location;
    errorString += '\nMessage: ' + this.error.message;
    errorString += '\nCause: ' + this.error.causeChain;
    return errorString;
  }
}
