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
import { Subject } from 'rxjs';

interface StackBehaviour {
  addPage(boardKey: string): void;

  getPrevious(): string;

  size(): number;
}

export class FullStackBehaviour implements StackBehaviour {

  protected pageStack: string[] = [];

  addPage(boardKey: string): void {
    this.pageStack.push(boardKey);
  }

  getPrevious(): string {
    // top of stack will be current page, only remove if we can go back
    if (this.pageStack.length > 1) {
      this.pageStack.pop();
      return this.pageStack.pop();
    } else {
      return null;
    }
  }

  size(): number {
    return this.pageStack.length;
  }
}

export class OptimisedStackBehaviour extends FullStackBehaviour {

  addPage(boardKey: string): void {
    const index = this.pageStack.indexOf(boardKey);
    if (index > -1) {
      this.pageStack = this.pageStack.slice(0, index + 1);
    } else {
      super.addPage(boardKey);
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class PageStackService {

  private behaviour: StackBehaviour = new OptimisedStackBehaviour();

  public hasContent = new Subject<boolean>();

  constructor() { }

  private updateContentObservable(): void {
    this.hasContent.next(this.stackHasContent());
  }

  public stackHasContent(): boolean {
    return this.behaviour.size() > 1;
  }

  public addPage(boardKey: string): void {
    this.behaviour.addPage(boardKey);
    this.updateContentObservable();
  }

  public getPrevious(): string {
    const ret = this.behaviour.getPrevious();
    this.updateContentObservable();
    return ret;
  }
}
