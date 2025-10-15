import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentReviewModalComponent } from './document-review-modal-component';

describe('DocumentReviewModalComponent', () => {
  let component: DocumentReviewModalComponent;
  let fixture: ComponentFixture<DocumentReviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentReviewModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentReviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
