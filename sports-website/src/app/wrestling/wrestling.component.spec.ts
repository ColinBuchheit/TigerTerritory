import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrestlingComponent } from './wrestling.component';

describe('WrestlingComponent', () => {
  let component: WrestlingComponent;
  let fixture: ComponentFixture<WrestlingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WrestlingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WrestlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
