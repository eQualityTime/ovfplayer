import { TestBed, inject } from '@angular/core/testing';

import { SpeechbarService, ButtonFacade } from './speechbar.service';
import { Button } from './obfboard';

describe('SpeechbarService', () => {

  const mockButton = new Button().deserialize({
    id: 1,
    label: 'hello',
    vocalization: 'vocal'
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
            // should now have single button
            expect(buttons.length).toBe(1);
            expect(buttons[0].label).toBe('less');
            expect(buttons[0].vocalization).toBe(null);
            break;
          case 3:
            // single button with 'less' appended
            expect(buttons.length).toBe(1);
            expect(buttons[0].label).toBe('lessless');
            expect(buttons[0].vocalization).toBe(null);
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
            // two buttons; 'happyless' & 'happy'
            expect(buttons.length).toBe(2);
            expect(buttons[0].label).toBe('helloless');
            expect(buttons[0].vocalization).toBe('vocalless');
            expect(buttons[1].label).toBe('less');
            expect(buttons[1].vocalization).toBe(null);
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
            // should now have single button
            expect(buttons.length).toBe(1);
            expect(buttons[0].label).toBe('less');
            expect(buttons[0].vocalization).toBe(null);
            break;
          case 3:
            // two buttons
            expect(buttons.length).toBe(2);
            expect(buttons[0].label).toBe('less');
            expect(buttons[0].vocalization).toBe(null);
            expect(buttons[1].label).toBe('hello');
            expect(buttons[1].vocalization).toBe('vocal');
            break;
          case 4:
            // two buttons; 'happy' & 'happyless'
            expect(buttons.length).toBe(2);
            expect(buttons[0].label).toBe('less');
            expect(buttons[0].vocalization).toBe(null);
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

  it('should override label', () => {
    const fb = new ButtonFacade(mockButton, 'less');
    expect(fb.id).toBe('1');
    expect(fb.label).toBe('less');
    expect(fb.vocalization).toBe(null);
  });

  it('should override label and append', () => {
    const fb = new ButtonFacade(mockButton, 'less');
    fb.append('less');
    expect(fb.id).toBe('1');
    expect(fb.label).toBe('lessless');
    expect(fb.vocalization).toBe(null);
  });
});
