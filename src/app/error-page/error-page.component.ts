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
}
