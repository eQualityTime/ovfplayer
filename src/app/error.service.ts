import { Injectable } from '@angular/core';

export class ErrorDetails {
  location: string;
  message: string;
  causeChain: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private _lastError: ErrorDetails;

  constructor() { }

  get lastError(): ErrorDetails {
    return this._lastError;
  }

  set lastError(error: ErrorDetails) {
    this._lastError = error;
  }
}
