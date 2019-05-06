import { Injectable } from '@angular/core';

interface StackBehaviour {
  addPage(boardKey: string): void;

  back(): string;
}

export class FullStackBehaviour implements StackBehaviour {

  protected pageStack: string[] = [];

  addPage(boardKey: string): void {
    this.pageStack.push(boardKey);
  }

  back(): string {
    // top of stack will be current page, only remove if we can go back
    if (this.pageStack.length > 1) {
      this.pageStack.pop();
      return this.pageStack.pop();
    } else {
      return null;
    }
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

  constructor() { }

  public addPage(boardKey: string): void {
    this.behaviour.addPage(boardKey);
  }

  public back(): string {
    return this.behaviour.back();
  }
}
