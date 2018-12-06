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
    this.sortChildren();
  }

  addChildren(newChildren: Scannable[]) {
    this.children.push(...newChildren);
    this.sortChildren();
  }

  removeChildren(oldChildren: Scannable[]) {
    oldChildren.forEach(scannable => {
      const index = this.children.indexOf(scannable);
      if (index >= 0) {
        this.children.splice(index, 1);
      }
    });
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

    if (this.configService.scanningConfig.enabled) {
      document.onkeydown = this.handleInteraction.bind(this);
    }
  }

  getScanningModel(): Observable<ScanningModel> {
    return new Observable<ScanningModel>(this.registerScannable);
  }

  registerScannable = (observer: ScannableCollectionProvider): Subscription => {
    this.observers.push(observer);

    this.topLevelScannables.addChildren(observer.getScannableCollections());
    this.startScanning();

    return new Subscription(() => this._unsubscribe(observer));
  }

  _unsubscribe(observer: ScannableCollectionProvider) {
    if (this.observers.includes(observer)) {
      this.observers.splice(this.observers.indexOf(observer), 1);
    }
    this.topLevelScannables.removeChildren(observer.getScannableCollections());

    this.currentCollection = this.topLevelScannables;

    if (this.observers.length === 0) {
      this.stopScanning();
      this.scanningModel = new ScanningModel();
    }
  }

  handleInteraction() {
    if (this.scanningModel.currentHighlight) {
      this.updateSelected();

      if (this.scanningModel.currentSelection.hasChildren()) {
        this.currentCollection = <ScannableCollection> this.scanningModel.currentSelection;
      } else {
        this.currentCollection = this.topLevelScannables;
      }
    }
  }

  private startScanning() {
    this.currentSelectedIndex = 0;

    if (this.intervalId === undefined && this.observers.length >= 1 && this.configService.scanningConfig.enabled) {
      this.intervalId = setInterval(this.updateHighlighted, this.configService.scanningConfig.time);
    }
  }

  private stopScanning() {
    clearInterval(this.intervalId);
    this.intervalId = undefined;
  }

  private updateHighlighted = () => {
    if (this.currentSelectedIndex >= this.currentCollection.getChildren().length) {
      this.currentSelectedIndex = 0;
    }

    this.scanningModel.currentHighlight = this.currentCollection.getChild(this.currentSelectedIndex++);
    this.notifyObservers();
  }

  private updateSelected = () => {
    this.stopScanning();
    const current = this.scanningModel.currentHighlight;
    this.scanningModel.currentSelection = current;
    this.scanningModel.currentHighlight = undefined;
    this.notifyObservers();

    // stay on the selection for one [time] then clear selection and restart scanning
    setTimeout(() => {
      this.scanningModel.currentSelection = undefined;
      this.notifyObservers();
      this.startScanning();
    }, this.configService.scanningConfig.time);
  }

  private notifyObservers() {
    this.observers.forEach(observer => observer.next(this.scanningModel));
  }
}
