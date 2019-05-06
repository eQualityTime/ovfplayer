import { Injectable } from '@angular/core';

interface StackBehaviour {
  addPage(boardKey: string): void;

  back(): string;
}

class FullStackBehaviour implements StackBehaviour {

  private pageStack: string[] = [];

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

@Injectable({
  providedIn: 'root'
})
export class PageStackService {

  private behaviour: StackBehaviour = new FullStackBehaviour();

  constructor() { }

  public addPage(boardKey: string): void {
    this.behaviour.addPage(boardKey);
  }

  public back(): string {
    return this.behaviour.back();
  }
}
