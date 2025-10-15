import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignSalaryTemplateComponent } from './assign-salary-template-component';

describe('AssignSalaryTemplateComponent', () => {
  let component: AssignSalaryTemplateComponent;
  let fixture: ComponentFixture<AssignSalaryTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignSalaryTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignSalaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
