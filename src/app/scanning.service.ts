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

  hasChildren(): boolean {
    return false;
  }
}

export class ScannableCollection extends Scannable {
  private children: Scannable[] = [];

  hasChildren(): boolean {
    return this.children.length > 0;
  }

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
  }

  getScanningModel(): Observable<ScanningModel> {
    return new Observable<ScanningModel>(this.registerScannable);
  }

  registerScannable = (observer: ScannableCollectionProvider): Subscription => {
    this.observers.push(observer);

    observer.getScannableCollections().forEach(col => col.sortChildren());

    this.topLevelScannables.getChildren().push(...observer.getScannableCollections());
    this.topLevelScannables.sortChildren();
    this.startScanning();

    return new Subscription(() => this._unsubscribe(observer));
  }

  _unsubscribe(observer: ScannableCollectionProvider) {
    this.observers.splice(this.observers.indexOf(observer), 1);
    observer.getScannableCollections().forEach(scannable => {
      const collection = <ScannableCollection> scannable;
      this.topLevelScannables.getChildren().splice(this.topLevelScannables.getChildren().indexOf(collection), 1);
    });

    this.currentCollection = this.topLevelScannables;

    if (this.observers.length === 0) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
      this.scanningModel = new ScanningModel();
    }
  }

  startScanning() {
    this.currentSelectedIndex = 0;

    if (this.observers.length === 1 && this.configService.scanningConfig.enabled) {
      this.intervalId = setInterval(this.updateHighlighted, this.configService.scanningConfig.time);
    }
  }

  updateHighlighted = () => {
    if (this.currentSelectedIndex >= this.currentCollection.getChildren().length) {
      this.currentSelectedIndex = 0;
    }

    this.scanningModel.currentHighlight = this.currentCollection.getChild(this.currentSelectedIndex++);
    this.observers.forEach(observer => observer.next(this.scanningModel));
  }

  updateSelected = () => {
    const current = this.scanningModel.currentHighlight;
    this.scanningModel.currentSelection = current;
    this.scanningModel.currentHighlight = undefined;
    this.observers.forEach(observer => observer.next(this.scanningModel));
    clearInterval(this.intervalId);
    this.intervalId = undefined;

    setTimeout(() => {
      this.scanningModel.currentSelection = undefined;
      this.observers.forEach(observer => observer.next(this.scanningModel));
      this.startScanning();
    }, this.configService.scanningConfig.time);
  }

  selectCurrent() {
    if (this.scanningModel.currentHighlight) {
      this.updateSelected();

      if (this.scanningModel.currentSelection.hasChildren()) {
        this.currentCollection = <ScannableCollection> this.scanningModel.currentSelection;
      } else {
        this.currentCollection = this.topLevelScannables;
      }
    }
  }

}
