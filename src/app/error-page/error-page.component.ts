import { Component, OnInit } from '@angular/core';
import { ErrorService, ErrorDetails } from '../error.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {

  error: ErrorDetails;

  constructor(private errorService: ErrorService, private router: Router) { }

  ngOnInit() {
    this.error = this.errorService.lastError;
  }

  goToConfig() {
    this.router.navigate(['/config']);
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
