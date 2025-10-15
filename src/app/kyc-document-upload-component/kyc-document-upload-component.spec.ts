import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycDocumentUploadComponent } from './kyc-document-upload-component';

describe('KycDocumentUploadComponent', () => {
  let component: KycDocumentUploadComponent;
  let fixture: ComponentFixture<KycDocumentUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KycDocumentUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KycDocumentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
