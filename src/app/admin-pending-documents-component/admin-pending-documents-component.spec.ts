import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPendingDocumentsComponent } from './admin-pending-documents-component';

describe('AdminPendingDocumentsComponent', () => {
  let component: AdminPendingDocumentsComponent;
  let fixture: ComponentFixture<AdminPendingDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPendingDocumentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPendingDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
