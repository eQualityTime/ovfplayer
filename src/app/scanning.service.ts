import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable, Subscriber, Subscription } from 'rxjs';

export class Scannable {
  private _priority: number;
  private _type: string;

  constructor(priority: number, type: string) {
    this._priority = priority;
    this._type = type;
  }

  get priority(): number {
    return this._priority;
  }

  set priority(priority: number) {
    this._priority = priority;
  }

  get type(): string {
    return this._type;
  }

  set type(type: string) {
    this._type = type;
  }
}

export class ScannableCollection extends Scannable {
  private children: Scannable[] = [];

  getChildren(): Scannable[] {
    return this.children;
  }

  getChild(index: number): Scannable {
    return this.children[index];
  }

  addChild(child: Scannable) {
    this.children.push(child);
  }

  sortChildren() {
    this.children.sort(this._sortScannables);
  }

  _sortScannables(a: Scannable, b: Scannable): number {
    return a.priority - b.priority;
  }
}

export class ScanningModel {
  currentHighlight: Scannable;
  currentSelection: Scannable;
}

export interface ScannableCollectionProvider extends Subscriber<ScanningModel> {
  // TODO: make this observable so the button page can refresh its buttons?
  getScannableCollections(): ScannableCollection[];
}

@Injectable({
  providedIn: 'root'
})
export class ScanningService {

  private topLevelScannables: ScannableCollection;
  private currentCollection: ScannableCollection;
  private scanningModel: ScanningModel;
  private currentSelectedIndex = 0;
  private observers: ScannableCollectionProvider[];
  private intervalId;

  constructor(private configService: ConfigService) {
    this.topLevelScannables = new ScannableCollection(0, '');
    this.currentCollection = this.topLevelScannables;
    this.scanningModel = new ScanningModel();
    this.observers = [];
    this.configService.scanningConfig.enabled = true;
  }

  getScanningModel(): Observable<ScanningModel> {
    return new Observable<ScanningModel>(this.registerScannable);
  }

  registerScannable = (observer: ScannableCollectionProvider): Subscription => {
    this.observers.push(observer);

    observer.getScannableCollections().forEach(col => col.sortChildren());

    this.topLevelScannables.getChildren().push(...observer.getScannableCollections());
    this.topLevelScannables.sortChildren();

    if (this.observers.length === 1 && this.configService.scanningConfig.enabled) {
      this.intervalId = setInterval(this.updateHighlighted, this.configService.scanningConfig.time);
    }

    return new Subscription(() => this._unsubscribe(observer));
  }

  _unsubscribe(observer: ScannableCollectionProvider) {
    this.observers.splice(this.observers.indexOf(observer), 1);

    if (this.observers.length === 0) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
      this.scanningModel = new ScanningModel();
      this.currentSelectedIndex = 0;
    }
  }

  updateHighlighted = () => {
    if (this.currentSelectedIndex >= this.currentCollection.getChildren().length) {
      this.currentSelectedIndex = 0;
    }

    this.scanningModel.currentHighlight = this.currentCollection.getChild(this.currentSelectedIndex++);
    this.observers.forEach(observer => observer.next(this.scanningModel));
  }

}
