/* ::START::LICENCE::
Copyright eQualityTime ©2018, ©2019, ©2020
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
