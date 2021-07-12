import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { LocalStorageService } from '../services/local-storage.service';
import { Card } from '../models/card';
import { ScoresService } from '../services/scores.service';


const circleR = 80;
const circleDasharray = 2 * Math.PI * circleR;
export interface record {
  answer: string;
  id: number;
}
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [LocalStorageService],
})
export class HomePage {
  doc: any;
  records: Card[] = [];
  localCardName: string = 'card';
  loading: boolean = true;
  message: string = 'Loading card...';
  timerStarted: boolean = false;
  counterAnswers: number = 0;
  noCards: boolean = false;
  score = 0;
  timeup: boolean = false;
  noTime: boolean = false;
  whenClicked = [false, false, false, false];

  time: BehaviorSubject<string> = new BehaviorSubject('00:00');
  percent: BehaviorSubject<number> = new BehaviorSubject(100);

  timer: number;

  interval;

  startDuration = 1;

  circleR = circleR;
  circleDasharray = circleDasharray;

  constructor(
    private router: Router,
    private firestore: AngularFirestore,
    private localStorageService: LocalStorageService,
    private scoresService: ScoresService
  ) {}

  ionViewWillEnter() {
    console.log('ionViewWillEnter event');
  }
  ionViewDidEnter() {
    console.log('ionViewDidEnter event');
    this.loading = true;
    // this.message = 'Loading card...';
    this.timerStarted = false;
    this.countAnswers();
    if (this.counterAnswers) {
      this.noCards = true;
    }
    console.log('there are no cards: ', this.noCards);
  }
  ionViewWillLeave() {
    console.log('ionViewWillLeave event');
    this.records = [];
  }
  ionViewDidLeave() {
    console.log('ionViewDidLeave event');
  }

  startTimer(duration: number) {
    clearInterval(this.interval);
    this.timerStarted = true;
    this.timer = duration * 35;
    this.updateTimeValue();
    setTimeout(() => {
      this.interval = setInterval(() => {
        this.updateTimeValue();
      }, 1000);
 }, 2000);
  }

  stopTimer() {
    clearInterval(this.interval);
    this.time.next('00:00');
  }

  percentageOffset(percent) {
    const percentFloat = percent / 100;
    return circleDasharray * (1 - percentFloat);
  }

  swapDuration() {
    this.startDuration = this.startDuration === 1 ? 0.5 : 1;
  }

  updateTimeValue() {
    let minutes: any = this.timer / 60;
    let seconds: any = this.timer % 60;

    minutes = String('0' + Math.floor(minutes)).slice(-2);
    seconds = String('0' + Math.floor(seconds)).slice(-2);

    const text = minutes + ':' + seconds;
    this.time.next(text);

    const totalTime = this.startDuration * 35;
    const percentage = ((totalTime - this.timer) / totalTime) * 100;
    this.percent.next(percentage);

    --this.timer;

    if (this.timer < 0) {
      // this.startTimer(this.startDuration);
      this.stopTimer();
      this.noTime = true;

      // this.router.navigate(['/time-out']);
    }

    if (this.timer < 5) {
      this.timeup = true;
      console.log('timer is less than 5');
    }
  }

  refresh(ev) {
    this.localStorageService.saveData(this.localCardName, this.records);
    setTimeout(() => {
      console.log(
        'locals ',
        this.localStorageService.getData(this.localCardName)
      );
      ev.detail.complete();
      this.records = [];
      this.countAnswers();
    }, 3000);
  }

  public getRandomNumber(maxItems: number): number {
    const min = 0;
    const max = maxItems;
    console.log('max ', max);
    const floor = (
      Math.floor(Math.random() * (max - min + 1)) + min
    ).toString();
    if (floor.includes('.')) {
      return parseInt(floor.split('.')[0]);
    }
    return parseInt(floor);
  }

  public getAnswers(maxItems: number): any {
    const randomNumber = this.getRandomNumber(maxItems);
    return new Promise(async (resolve) => {
      await firebase
        .firestore()
        .collection('/answers/')
        .where('id', '==', randomNumber)
        .limit(1)
        .get()
        .then((res) => {
          const localCard = this.localStorageService.getData(
            this.localCardName
          );
          res.forEach((ref) => {
            const duplicate = this.records.find((s) => s.id === ref.data().id);
            if (typeof duplicate === 'undefined') {
              if (localCard?.length > 0) {
                const duplicateLocal = localCard.find(
                  (s) => s.id === ref.data().id
                );
                if (typeof duplicateLocal === 'undefined') {
                  console.log(`${randomNumber} does not Exist locally`);
                  this.records.push(ref.data() as Card);
                } else {
                  console.log(`${randomNumber} exists locally already`);
                }
              } else {
                console.log(`${randomNumber} does not Exist`);
                this.records.push(ref.data() as Card);
              }
            } else {
              if (JSON.stringify(duplicate).length > 0) {
                console.log(`${randomNumber} exists already`);
              }
            }
          });
          if (localCard?.length < maxItems) {
            if (this.records.length < 5) {
              this.loading = true;
              this.getAnswers(maxItems);
            } else if (this.records.length === 5) {
              this.loading = false;
              if (localCard?.length > 0) {
                let temporaryRecord: Card[];
                temporaryRecord = [...localCard, ...this.records];
                this.localStorageService.saveData(
                  this.localCardName,
                  temporaryRecord
                );
              } else {
                this.localStorageService.saveData(
                  this.localCardName,
                  this.records
                );
              }
            }
          } else {
            this.message = 'No cards left...';
            this.noCards = true;
          }
          resolve(this.records);
        });
    });
  }

  public refreshGame(): any {
    console.log('records:', this.records);
    // const localCard = this.localStorageService.getData(this.localCardName);
    if (this.records?.length <= 0) {
      this.localStorageService.removeData(this.localCardName);
      window.location.reload();
    }
  }

  public countAnswers(): any {
    return new Promise(async (resolve) => {
      await firebase
        .firestore()
        .collection('/answers/')
        .get()
        .then((snap) => {
          // this.counterAnswers = snap.size;
          resolve(this.getAnswers(snap.size));
        });
    });
  }

  public addScore(): any {
    if ( this.score < 50 ) {
    this.score = this.score + 10;
    }

 }

 tracked(item, index){
  return index;
}
}



