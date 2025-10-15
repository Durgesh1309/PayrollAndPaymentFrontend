import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeDashBoardComponent } from './home-dash-board-component';

describe('HomeDashBoardComponent', () => {
  let component: HomeDashBoardComponent;
  let fixture: ComponentFixture<HomeDashBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeDashBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeDashBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
