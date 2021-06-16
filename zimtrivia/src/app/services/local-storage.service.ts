import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Card } from '../models/card';

@Injectable()
export class LocalStorageService {
  private logData: Card[] = [];
  private logger = new Subject<Card[]>();

  constructor() {}

  public checkChange(): Observable<any> {
    return this.logger.asObservable();
  }

  public saveData(key: string, data: Card[]): void {
    localStorage.setItem(key, JSON.stringify(data));
    this.getData(key);
  }

  public getData(key: string): Card[] {
    if (localStorage.getItem(key)) {
      this.logData = JSON.parse(localStorage.getItem(key)) || [];
    }
    this.logger.next(this.logData);
    return this.logData;
  }

  public removeData(key: string): void {
    localStorage.removeItem(key);
    this.logData = [];
    this.logger.next(this.logData);
  }
}
