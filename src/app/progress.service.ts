import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

export class ProgressObject {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  private observer: Observer<ProgressObject>;

  static message(msg: string): ProgressObject {
    const ret = new ProgressObject();
    ret.message = msg;
    return ret;
  }

  constructor() {}

  getProgress = (): Observable<ProgressObject> => {
    return new Observable(this.addObserver);
  }

  private addObserver = (observer: Observer<ProgressObject>) => {
    this.observer = observer;
  }

  progress = (progObj: ProgressObject) => {
    if (this.observer) {
      this.observer.next(progObj);
    }
  }
}
