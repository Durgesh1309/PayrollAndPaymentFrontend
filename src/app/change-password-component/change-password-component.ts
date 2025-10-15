// src/app/employee/change-password/change-password-component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ChangePasswordRequest, ChangePasswordService, ApiResponseDTO } from '../Services/change-password-service';
import { finalize } from 'rxjs/operators';

// Cross-field: new == confirm
function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const np = group.get('newPassword')?.value;
  const cp = group.get('confirmNewPassword')?.value;
  return np && cp && np !== cp ? { passwordsMismatch: true } : null;
}

// Cross-field: new != current
function notEqualToCurrentValidator(group: AbstractControl): ValidationErrors | null {
  const cur = group.get('currentPassword')?.value;
  const np = group.get('newPassword')?.value;
  return cur && np && cur === np ? { sameAsCurrent: true } : null;
}

// Single-field: strong password rules
function strongPasswordValidator(ctrl: AbstractControl): ValidationErrors | null {
  const v: string = ctrl.value ?? '';
  if (!v) return null;
  const tooShort = v.length < 8;
  const noUpper = !/[A-Z]/.test(v);
  const noLower = !/[a-z]/.test(v);
  const noDigit = !/[0-9]/.test(v);
  const noSpecial = !/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\;/`~]/.test(v);
  return (tooShort || noUpper || noLower || noDigit || noSpecial)
    ? { weakPassword: true }
    : null;
}

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="card">
    <h3>Change Password</h3>

    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div class="form-field">
        <label>Current password</label>
        <input type="password" formControlName="currentPassword" autocomplete="current-password" />
        <div class="err" *ngIf="form.get('currentPassword')?.touched && form.get('currentPassword')?.invalid">
          {{ controlError('currentPassword') }}
        </div>
      </div>

      <div class="form-field">
        <label>New password</label>
        <input type="password" formControlName="newPassword" autocomplete="new-password" />
        <div class="hint">
          Must be 8+ characters and include uppercase, lowercase, digit, and special character.
        </div>
        <div class="err" *ngIf="form.get('newPassword')?.touched && form.get('newPassword')?.invalid">
          {{ controlError('newPassword') }}
        </div>
      </div>

      <div class="form-field">
        <label>Confirm new password</label>
        <input type="password" formControlName="confirmNewPassword" autocomplete="new-password" />
        <div class="err" *ngIf="form.errors?.['passwordsMismatch'] && form.get('confirmNewPassword')?.touched">
          New password and confirmation do not match.
        </div>
      </div>

      <div class="err" *ngIf="form.errors?.['sameAsCurrent']">
        New password must be different from current password.
      </div>

      <div class="err" *ngIf="formError">{{ formError }}</div>
      <div class="ok" *ngIf="successMsg">{{ successMsg }}</div>

      <button type="submit" [disabled]="busy || form.invalid">
        {{ busy ? 'Updating...' : 'Update Password' }}
      </button>
    </form>
  </div>
  `,
  styles: [`
    .card { padding: 16px; border: 1px solid #ddd; border-radius: 8px; max-width: 420px; }
    .form-field { margin-bottom: 12px; display: flex; flex-direction: column; }
    .err { color: #b00020; font-size: 12px; margin-top: 4px; }
    .ok { color: #0a8f08; font-size: 12px; margin-top: 8px; }
    .hint { font-size: 12px; color: #666; }
    button { min-width: 140px; }
  `]
})
export class ChangePasswordComponent {
  @Input() orgId!: number;
  @Input() employeeId!: number;
  @Input() logoutAfterSuccess = false;
  @Output() changed = new EventEmitter<void>();

  busy = false;
  formError = '';
  successMsg = '';

  private fb = inject(FormBuilder);
  private svc = inject(ChangePasswordService);

  form: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8), strongPasswordValidator]],
    confirmNewPassword: ['', [Validators.required]]
  }, { validators: [passwordsMatchValidator, notEqualToCurrentValidator] });

  controlError(ctrl: string): string {
    const c = this.form.get(ctrl)!;
    if (c.errors?.['server']) return c.errors['server'];
    if (c.errors?.['required']) return 'This field is required.';
    if (c.errors?.['minlength']) return `Minimum length is ${c.errors['minlength'].requiredLength}.`;
    if (c.errors?.['weakPassword']) return 'Password must be 8+ chars with uppercase, lowercase, digit, and special character.';
    return 'Invalid value.';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.formError = '';
    this.successMsg = '';
    this.busy = true;

    const payload = this.form.getRawValue() as ChangePasswordRequest;

    this.svc.changePassword(this.orgId, this.employeeId, payload)
      .pipe(finalize(() => this.busy = false))
      .subscribe({
        next: (res: ApiResponseDTO | string) => {
          const message = typeof res === 'string'
            ? res
            : (res?.message ?? 'Password updated successfully.');
          this.successMsg = message;
          this.changed.emit();
          if (this.logoutAfterSuccess) {
            localStorage.removeItem('jwtToken'); // use the same key you set on login
            window.location.href = '/login';
          } else {
            this.form.reset();
          }
        },
        error: (err) => {
          const msg: string =
            err?.error?.message ||
            err?.error?.error ||
            err?.message ||
            'Failed to update password.';

          const lower = msg.toLowerCase();
          if (lower.includes('current password')) {
            this.form.get('currentPassword')?.setErrors({ server: msg });
          } else if (lower.includes('match')) {
            this.form.get('confirmNewPassword')?.setErrors({ server: msg });
            this.form.setErrors({ passwordsMismatch: true });
          } else if (lower.includes('password') || lower.includes('policy')) {
            this.form.get('newPassword')?.setErrors({ server: msg });
          } else {
            this.formError = msg;
          }
        }
      });
  }
}
