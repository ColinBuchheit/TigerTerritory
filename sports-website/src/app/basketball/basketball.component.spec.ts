import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasketballComponent } from './basketball.component';

describe('BasketballComponent', () => {
  let component: BasketballComponent;
  let fixture: ComponentFixture<BasketballComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasketballComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasketballComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
