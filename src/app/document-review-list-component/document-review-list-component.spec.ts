import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentReviewListComponent } from './document-review-list-component';

describe('DocumentReviewListComponent', () => {
  let component: DocumentReviewListComponent;
  let fixture: ComponentFixture<DocumentReviewListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentReviewListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentReviewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
