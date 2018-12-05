import { TestBed, inject } from '@angular/core/testing';

import { ScanningService, ScanningModel, ScannableCollection, ScannableCollectionProvider } from './scanning.service';
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
        enabled: false,
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
    inject([ScanningService], (service: ScanningService) => {
      const sub = service.getScanningModel().subscribe(new TestProvider([],
        (scanningModel: ScanningModel) => {
          // just don't call done and it will error with a timeout
        }
      ));

      // time is set to 0, so wait 1 second and if it hasn't started assume it won't
      setTimeout(() => {
        sub.unsubscribe();
        done();
      }, 1000);
    })();
  });

  it('should start if config has scanning enabled', done => {
    inject([ScanningService, ConfigService], (service: ScanningService, config: ConfigService) => {
      config.scanningConfig.enabled = true;
      const sub = service.getScanningModel().subscribe(new TestProvider([],
        (scanningModel: ScanningModel) => {
          expect(scanningModel).toBeTruthy();
          sub.unsubscribe();
          done();
        }
      ));
    })();
  });

  // it('should stop if no observers left', done => {
  //   inject([ScanningService, ConfigService], (service: ScanningService, config: ConfigService) => {
  //     config.scanningConfig.enabled = true;
  //     service.getScanningModel().subscribe(new TestProvider([],
  //       (scanningModel: ScanningModel) => {
  //         expect(scanningModel).toBeTruthy();
  //         done();
  //       }
  //     )).unsubscribe();
  //   })();
  // });

  it('should scan children in order', done => {
    inject([ScanningService, ConfigService], (service: ScanningService, config: ConfigService) => {
      config.scanningConfig.enabled = true;
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
    inject([ScanningService, ConfigService], (service: ScanningService, config: ConfigService) => {
      config.scanningConfig.enabled = true;
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
    inject([ScanningService, ConfigService], (service: ScanningService, config: ConfigService) => {
      config.scanningConfig.enabled = true;
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

  // it('should select an item on interaction', done => {
  //   inject([ScanningService, ConfigService], (service: ScanningService, config: ConfigService) => {
  //     config.scanningConfig.enabled = true;
  //     const sub = service.getScanningModel().subscribe(new TestProvider([],
  //       (scanningModel: ScanningModel) => {
  //         expect(scanningModel).toBeTruthy();
  //         sub.unsubscribe();
  //         done();
  //       }
  //     ));
  //   })();
  // });
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
