import { Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

import { AuthStatus } from '../../enums';

import { AuthService, FormsValidatorsService } from '../../services';

@Component({
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
})
export class RegisterPageComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);

  private formsValidatorsService = inject(FormsValidatorsService);

  public myForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(this.formsValidatorsService.emailPattern),
      ],
    ],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    localStorage.setItem('url', this.router.url);
  }

  public isValidField(field: string): boolean | null {
    return this.formsValidatorsService.isValidField(this.myForm, field);
  }

  public getErrorMessage(field: string): string | null {
    return this.formsValidatorsService.getErrorMessage(this.myForm, field);
  }

  public register(): void {
    if (this.myForm.valid) {
      this.authService.setAuthStatus(AuthStatus.checking);

      const { name, email, password } = this.myForm.value;

      this.authService.register(name, email, password).subscribe({
        next: () => {
          this.router.navigateByUrl('/dashboard');
        },

        error: (message) => {
          Swal.fire('Error', message, 'error');
          this.authService.setAuthStatus(AuthStatus.notAuthenticated);
        },
      });
    }

    this.myForm.markAllAsTouched();
  }
}
