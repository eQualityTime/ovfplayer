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
import { TestBed, inject } from '@angular/core/testing';

import { SpeechbarService, ButtonFacade } from './speechbar.service';
import { Button } from '../../obfboard';

describe('SpeechbarService', () => {

  const mockButton = new Button().deserialize({
    id: 1,
    label: 'hello',
    vocalization: 'vocal'
  }, null);
  const differentMockButton = new Button().deserialize({
    id: 2,
    label: 'goodbye'
  }, null);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpeechbarService]
    });
  });

  it('should be created', inject([SpeechbarService], (service: SpeechbarService) => {
    expect(service).toBeTruthy();
  }));

  it('should handle append actions - button + append', (done) => {

    let counter = 0;

    inject([SpeechbarService], (service: SpeechbarService) => {
      service.getButtons().subscribe((buttons) => {
        counter++;
        switch (counter) {
          case 1:
            // first instance will be empty
            expect(buttons.length).toBe(0);
            break;
          case 2:
            // should now have single button
            expect(buttons.length).toBe(1);
            expect(buttons[0].label).toBe('hello');
            expect(buttons[0].vocalization).toBe('vocal');
            break;
          case 3:
            // single button with 'less' appended
            expect(buttons.length).toBe(1);
            expect(buttons[0].label).toBe('helloless');
            expect(buttons[0].vocalization).toBe('vocalless');
            done();
            break;
          default:
            done();
        }
      });

      // add a button
      service.addButton(mockButton);
      // do an append action
      service.appendButton(mockButton, '+less');
    })();
  });

  it('should handle append actions - append + append', done => {
    let counter = 0;

    inject([SpeechbarService], (service: SpeechbarService) => {
      service.getButtons().subscribe(buttons => {
        counter++;
        switch (counter) {
          case 1:
            // first instance will be empty
            expect(buttons.length).toBe(0);
            break;
          case 2:
            // should now have single 'append' button
            expect(buttons.length).toBe(1);
            expect(buttons[0].label).toBe('less');
            expect(buttons[0].vocalization).toBe(undefined);
            break;
          case 3:
            // single 'append' button with 'less' appended
            expect(buttons.length).toBe(1);
            expect(buttons[0].label).toBe('lessless');
            expect(buttons[0].vocalization).toBe(undefined);
            done();
            break;
          default:
            done();
        }
      });

      // do an append action
      service.appendButton(mockButton, '+less');
      // do another append action
      service.appendButton(mockButton, '+less');
    })();
  });

  it('should handle space actions - button + append + space + append', done => {
    let counter = 0;

    inject([SpeechbarService], (service: SpeechbarService) => {
      service.getButtons().subscribe(buttons => {
        counter++;
        switch (counter) {
          case 1:
            // first instance will be empty
            expect(buttons.length).toBe(0);
            break;
          case 2:
            // should now have single button
            expect(buttons.length).toBe(1);
            expect(buttons[0].label).toBe('hello');
            expect(buttons[0].vocalization).toBe('vocal');
            break;
          case 3:
            // single button with 'less' appended
            expect(buttons.length).toBe(1);
            expect(buttons[0].label).toBe('helloless');
            expect(buttons[0].vocalization).toBe('vocalless');
            break;
          case 4:
            // two buttons; 'happyless' & 'less'
            expect(buttons.length).toBe(2);
            expect(buttons[0].label).toBe('helloless');
            expect(buttons[0].vocalization).toBe('vocalless');
            expect(buttons[1].label).toBe('less');
            expect(buttons[1].vocalization).toBe(undefined);
            done();
            break;
          default:
            done();
        }
      });

      // add a button
      service.addButton(mockButton);
      // do an append action
      service.appendButton(mockButton, '+less');
      // space
      service.space();
      // do another append action
      service.appendButton(mockButton, '+less');
    })();
  });

  it('should handle space actions - append + space + button + append', done => {
    let counter = 0;

    inject([SpeechbarService], (service: SpeechbarService) => {
      service.getButtons().subscribe(buttons => {
        counter++;
        switch (counter) {
          case 1:
            // first instance will be empty
            expect(buttons.length).toBe(0);
            break;
          case 2:
            // should now have single 'append' button
            expect(buttons.length).toBe(1);
            expect(buttons[0].label).toBe('less');
            expect(buttons[0].vocalization).toBe(undefined);
            break;
          case 3:
            // two buttons
            expect(buttons.length).toBe(2);
            expect(buttons[0].label).toBe('less');
            expect(buttons[0].vocalization).toBe(undefined);
            expect(buttons[1].label).toBe('hello');
            expect(buttons[1].vocalization).toBe('vocal');
            break;
          case 4:
            // two buttons; 'happy' & 'happyless'
            expect(buttons.length).toBe(2);
            expect(buttons[0].label).toBe('less');
            expect(buttons[0].vocalization).toBe(undefined);
            expect(buttons[1].label).toBe('helloless');
            expect(buttons[1].vocalization).toBe('vocalless');
            done();
            break;
          default:
            done();
        }
      });

      service.appendButton(mockButton, '+less');
      service.space();
      service.addButton(mockButton);
      service.appendButton(mockButton, '+less');
    })();
  });

  it('should handle backspace actions', done => {
    let counter = 0;

    inject([SpeechbarService], (service: SpeechbarService) => {
      service.getButtons().subscribe(buttons => {
        counter++;
        switch (counter) {
          case 1:
            // first instance will be empty
            expect(buttons.length).toBe(0);
            break;
          case 2:
            // should now have single button
            expect(buttons.length).toBe(1);
            expect(buttons[0].label).toBe('hello');
            break;
          case 3:
            // two buttons
            expect(buttons.length).toBe(2);
            expect(buttons[0].label).toBe('hello');
            expect(buttons[1].label).toBe('goodbye');
            break;
          case 4:
            // just the first button
            expect(buttons.length).toBe(1);
            expect(buttons[0].label).toBe('hello');
            done();
            break;
          default:
            done();
        }
      });

      // add a button
      service.addButton(mockButton);
      // add a different button
      service.addButton(differentMockButton);
      // backspace
      service.backspace();
    })();
  });

  it('should handle clear actions', done => {
    let counter = 0;

    inject([SpeechbarService], (service: SpeechbarService) => {
      service.getButtons().subscribe(buttons => {
        counter++;
        switch (counter) {
          case 1:
            // first instance will be empty
            expect(buttons.length).toBe(0);
            break;
          case 2:
            // should now have single button
            expect(buttons.length).toBe(1);
            expect(buttons[0].label).toBe('hello');
            break;
          case 3:
            // two buttons
            expect(buttons.length).toBe(2);
            expect(buttons[0].label).toBe('hello');
            expect(buttons[1].label).toBe('goodbye');
            break;
          case 4:
            // just the first button
            expect(buttons.length).toBe(0);
            done();
            break;
          default:
            done();
        }
      });

      // add a button
      service.addButton(mockButton);
      // add a different button
      service.addButton(differentMockButton);
      // clear
      service.clear();
    })();
  });
});

describe('SpeechbarService.ButtonFacade', () => {

  const mockButton = new Button().deserialize({
    id: 1,
    label: 'hello',
    vocalization: 'vocal'
  }, null);

  it('should be created', () => {
    const fb = new ButtonFacade(mockButton);
    expect(fb).toBeTruthy();
  });

  it('should pass through', () => {
    const fb = new ButtonFacade(mockButton);
    expect(fb.id).toBe('1');
    expect(fb.label).toBe('hello');
    expect(fb.vocalization).toBe('vocal');
  });

  it('should facade', () => {
    const fb = new ButtonFacade(mockButton);
    fb.append('a');
    expect(fb.id).toBe('1');
    expect(fb.label).toBe('helloa');
    expect(fb.vocalization).toBe('vocala');
  });
});

describe('SpeechbarService.utteranceConstruction', () => {
  it('should append period if no punctuation', inject([SpeechbarService], (service: SpeechbarService) => {
    const vocals = ['I', 'hello'];
    expect(service.buildSentence(vocals)).toBe('I hello .');
  }));

  it('should not append period if punctuation', inject([SpeechbarService], (service: SpeechbarService) => {
    let vocals = ['I', 'hello?'];
    expect(service.buildSentence(vocals)).toBe('I hello?');
    vocals = ['I', 'hello!'];
    expect(service.buildSentence(vocals)).toBe('I hello!');
    vocals = ['I', 'hello.'];
    expect(service.buildSentence(vocals)).toBe('I hello.');
  }));

  it('should not append period if no vocalisations', inject([SpeechbarService], (service: SpeechbarService) => {
    const vocals = [];
    expect(service.buildSentence(vocals)).toBe('');
  }));
});
