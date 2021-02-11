import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TimeOutPage } from './time-out.page';

describe('TimeOutPage', () => {
  let component: TimeOutPage;
  let fixture: ComponentFixture<TimeOutPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeOutPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TimeOutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
