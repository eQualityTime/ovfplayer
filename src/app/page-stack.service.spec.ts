import { TestBed, inject } from '@angular/core/testing';

import {
  PageStackService,
  FullStackBehaviour,
  OptimisedStackBehaviour
} from './page-stack.service';

describe('PageStackService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PageStackService]
    });
  });

  it('should be created', inject([PageStackService], (service: PageStackService) => {
    expect(service).toBeTruthy();
  }));

  it('should work for FullStackBehaviour', () => {
    const behaviour = new FullStackBehaviour();
    expect(behaviour).toBeTruthy();

    const tests = [
      '+PageOne',
      '+PageTwo',
      '-PageOne',
      '+PageOne',
      '-',
      '-',
      '+PageTwo',
      '+PageThree',
      '-PageTwo',
      '+PageTwo',
      '+PageFour',
      '-PageTwo',
      '+PageTwo',
      '-PageOne',
      '+PageOne',
      '-'
    ];

    tests.forEach(test => {
      if (test.startsWith('+')) {
        behaviour.addPage(test.substr(1));
      } else if (test.startsWith('-')) {
        const nextBoard = behaviour.back();
        if (nextBoard) {
          expect(nextBoard).toBe(test.substr(1));
        } else {
          expect(test).toBe('-');
        }
      } else {
        // throw an error if we get here!
        expect(true).toBeFalsy();
      }
    });
  });

  it('should work for OptimisedStackBehaviour', () => {
    const behaviour = new OptimisedStackBehaviour();
    expect(behaviour).toBeTruthy();

    const tests = [
      '+PageOne',
      '+PageTwo',
      '-PageOne',
      '+PageOne',
      '-',
      '-',
      '+PageTwo',
      '+PageThree',
      '-PageTwo',
      '+PageTwo',
      '+PageFour',
      '-PageTwo',
      '+PageTwo',
      '-PageOne',
      '+PageOne',
      '-',
      '+PageTwo',
      '+PageThree',
      '+PageFour',
      '+PageThree',  // optimised will take us back to the previous PageThree just after PageTwo
      '-PageTwo',
      '+PageTwo'
    ];

    tests.forEach(test => {
      if (test.startsWith('+')) {
        behaviour.addPage(test.substr(1));
      } else if (test.startsWith('-')) {
        const nextBoard = behaviour.back();
        if (nextBoard) {
          expect(nextBoard).toBe(test.substr(1));
        } else {
          expect(test).toBe('-');
        }
      } else {
        // throw an error if we get here!
        expect(true).toBeFalsy();
      }
    });
  });
});
