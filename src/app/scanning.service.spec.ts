/*
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
*/
import { TestBed, inject } from '@angular/core/testing';

import { ScanningService, ScanningModel, ScannableCollection, ScannableCollectionProvider, Scannable } from './scanning.service';
import { ConfigService } from './config.service';
import { Subscriber } from 'rxjs';

describe('ScanningService', () => {
  let configServiceStub: Partial<ConfigService>;

  beforeEach(() => {
    configServiceStub = {
      displayedButtons: {
        showSpeakButton: false,
        showHomeButton: false,
        showBackspaceButton: false,
        showClearButton: false
      },
      scanningConfig: {
        enabled: true,
        time: 0
      }
    };

    TestBed.configureTestingModule({
      providers: [
        ScanningService,
        {provide: ConfigService, useValue: configServiceStub}
      ]
    });
  });

  it('should be created', inject([ScanningService], (service: ScanningService) => {
    expect(service).toBeTruthy();
  }));

  it('should not start if config has scanning disabled', done => {
    inject([ScanningService, ConfigService], (service: ScanningService, config: ConfigService) => {
      config.scanningConfig.enabled = false;
      const serviceSpy = spyOn<any>(service, 'startScanning').and.callThrough();
      const sub = service.getScanningModel().subscribe(new TestProvider([],
        (scanningModel: ScanningModel) => {
          expect(true).toBeFalsy();
          sub.unsubscribe();
          done();
        }
      ));

      // time is set to 0, so wait 1 second and if it hasn't started assume it won't
      setTimeout(() => {
        expect(serviceSpy).not.toHaveBeenCalled();
        sub.unsubscribe();
        done();
      }, 1000);
    })();
  });

  it('should start if config has scanning enabled', done => {
    inject([ScanningService], (service: ScanningService) => {
      const sub = service.getScanningModel().subscribe(new TestProvider([],
        (scanningModel: ScanningModel) => {
          expect(scanningModel).toBeTruthy();
          sub.unsubscribe();
          done();
        }
      ));
    })();
  });

  it('should stop if no observers left', done => {
    inject([ScanningService], (service: ScanningService) => {
      const serviceSpy = spyOn<any>(service, 'stopScanning').and.callThrough();
      service.getScanningModel().subscribe(new TestProvider([],
        (scanningModel: ScanningModel) => {
        }
      )).unsubscribe();
      expect(serviceSpy).toHaveBeenCalled();
      done();
    })();
  });

  it('should scan children in order', done => {
    inject([ScanningService], (service: ScanningService) => {
      let count = 0;
      const rows = [
        new ScannableCollection(0, 'a'),
        new ScannableCollection(1, 'b')
      ];

      const sub = service.getScanningModel().subscribe(new TestProvider(rows,
        (scanningModel: ScanningModel) => {
          expect(scanningModel.currentHighlight).toBe(rows[count++]);
          if (count === rows.length) {
            sub.unsubscribe();
            done();
          }
        }
      ));
    })();
  });

  it('should order children by priority', done => {
    inject([ScanningService], (service: ScanningService) => {
      let count = 0;
      const rows = [
        new ScannableCollection(1, 'a'),
        new ScannableCollection(0, 'b')
      ];

      const sub = service.getScanningModel().subscribe(new TestProvider(rows,
        (scanningModel: ScanningModel) => {
          expect(scanningModel.currentHighlight).toBe(rows[count === 0 ? 1 : 0]);
          count++;
          if (count === rows.length) {
            sub.unsubscribe();
            done();
          }
        }
      ));
    })();
  });

  it('should iterate over children repeatedly', done => {
    inject([ScanningService], (service: ScanningService) => {
      let count = 0;
      const rows = [
        new ScannableCollection(0, 'a'),
        new ScannableCollection(1, 'b')
      ];

      const sub = service.getScanningModel().subscribe(new TestProvider(rows,
        (scanningModel: ScanningModel) => {
          const index = count > rows.length - 1 ? count - rows.length : count;
          expect(scanningModel.currentHighlight).toBe(rows[index]);
          count++;
          if (count === rows.length * 2) {
            sub.unsubscribe();
            done();
          }
        }
      ));
    })();
  });

  it('should select an item on interaction', done => {
    inject([ScanningService], (service: ScanningService) => {
      let count = 0;
      const rows = [
        new ScannableCollection(0, 'a'),
        new ScannableCollection(1, 'b')
      ];

      const sub = service.getScanningModel().subscribe(new TestProvider(rows,
        (scanningModel: ScanningModel) => {
          if (count === 1) {
            service.handleInteraction();
          }

          if (count === 2) {
            expect(scanningModel.currentHighlight).toBe(undefined);
            expect(scanningModel.currentSelection).toBe(rows[1]);
            sub.unsubscribe();
            done();
          }

          count++;
        }
      ));
    })();
  });

  it('should clear selection on the next tick', done => {
    inject([ScanningService], (service: ScanningService) => {
      let count = 0;
      const rows = [
        new ScannableCollection(0, 'a'),
        new ScannableCollection(1, 'b')
      ];

      const sub = service.getScanningModel().subscribe(new TestProvider(rows,
        (scanningModel: ScanningModel) => {
          if (count === 1) {
            service.handleInteraction();
          }

          if (count === 3) {
            expect(scanningModel.currentSelection).toBe(undefined);
            sub.unsubscribe();
            done();
          }

          count++;
        }
      ));
    })();
  });

  it('should restart scanning if selection has no children', done => {
    inject([ScanningService], (service: ScanningService) => {
      let count = 0;
      const rows = [
        new ScannableCollection(0, 'a'),
        new ScannableCollection(1, 'b')
      ];

      const sub = service.getScanningModel().subscribe(new TestProvider(rows,
        (scanningModel: ScanningModel) => {
          if (count === 0 && ++count) { // inline for atomicity
            service.handleInteraction();
          } else {
            if (scanningModel.currentHighlight !== undefined) {
              expect(scanningModel.currentHighlight).toBe(rows[count - 1]);
              count++;
            }
          }

          if (count > rows.length) {
            sub.unsubscribe();
            done();
          }
        }
      ));
    })();
  });

  it('should scan children if selection has children', done => {
    inject([ScanningService], (service: ScanningService) => {
      let count = 0;
      const rows = [
        new ScannableCollection(0, 'a'),
        new ScannableCollection(1, 'b')
      ];

      rows[0].addChild(new Scannable(0, 'c'));
      rows[0].addChild(new Scannable(1, 'd'));

      const sub = service.getScanningModel().subscribe(new TestProvider(rows,
        (scanningModel: ScanningModel) => {
          if (count === 0 && ++count) { // inline for atomicity
            service.handleInteraction();
          } else {
            if (scanningModel.currentHighlight !== undefined) {
              expect(scanningModel.currentHighlight).toBe(rows[0].getChildren()[count - 1]);
              count++;
            }
          }

          if (count > rows.length) {
            sub.unsubscribe();
            done();
          }
        }
      ));
    })();
  });

  it('should iterate over children repeatedly', done => {
    inject([ScanningService], (service: ScanningService) => {
      let count = 0;
      const rows = [
        new ScannableCollection(0, 'a'),
        new ScannableCollection(1, 'b')
      ];

      rows[0].addChild(new Scannable(0, 'c'));
      rows[0].addChild(new Scannable(1, 'd'));

      const sub = service.getScanningModel().subscribe(new TestProvider(rows,
        (scanningModel: ScanningModel) => {
          if (count === 0 && ++count) { // inline for atomicity
            service.handleInteraction();
          } else {
            if (scanningModel.currentHighlight !== undefined) {
              const index = count > rows.length ? count - rows.length : count;
              expect(scanningModel.currentHighlight).toBe(rows[0].getChildren()[index - 1]);
              count++;
            }
          }

          if (count > rows.length * 2) {
            sub.unsubscribe();
            done();
          }
        }
      ));
    })();
  });

  it('should go back to the top level when a child with no children is selected', done => {
    inject([ScanningService], (service: ScanningService) => {
      let count = 0;
      const rows = [
        new ScannableCollection(0, 'a'),
        new ScannableCollection(1, 'b')
      ];

      rows[0].addChild(new Scannable(0, 'c'));
      rows[0].addChild(new Scannable(1, 'd'));

      const sub = service.getScanningModel().subscribe(new TestProvider(rows,
        (scanningModel: ScanningModel) => {
          if (count === 0 && ++count) { // inline for atomicity
            service.handleInteraction();
          } else {
            if (scanningModel.currentHighlight !== undefined) {
              if (count === 1 && ++count) { // inline for atomicity
                service.handleInteraction();
              } else {
                expect(scanningModel.currentHighlight).toBe(rows[0]);
                count++;
              }
            }
          }

          if (count === 3) {
            sub.unsubscribe();
            done();
          }
        }
      ));
    })();
  });
});

class TestProvider extends Subscriber<ScanningModel> implements ScannableCollectionProvider {
  private rows: ScannableCollection[];

  constructor(rows: ScannableCollection[], next: (ScanningModel) => void) {
    super(next);
    this.rows = rows;
  }

  getScannableCollections(): ScannableCollection[] {
    return this.rows;
  }
}
