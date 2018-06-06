import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StopCircleComponent } from './stop-circle.component';

describe('StopCircleComponent', () => {
  let component: StopCircleComponent;
  let fixture: ComponentFixture<StopCircleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StopCircleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StopCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
