import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationDashBoardComponent } from './organization-dash-board-component';

describe('OrganizationDashBoardComponent', () => {
  let component: OrganizationDashBoardComponent;
  let fixture: ComponentFixture<OrganizationDashBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationDashBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationDashBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
