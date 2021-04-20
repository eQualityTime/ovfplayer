/* ::START::LICENCE::
Copyright eQualityTime ©2018, ©2019, ©2020, ©2021
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
        const nextBoard = behaviour.getPrevious();
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
        const nextBoard = behaviour.getPrevious();
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
