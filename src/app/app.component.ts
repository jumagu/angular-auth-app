import { Router } from '@angular/router';
import { Component, computed, effect, inject } from '@angular/core';

import { AuthService } from './auth/services/auth.service';

import { AuthStatus } from './auth/enums';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  private currentRoute = localStorage.getItem('url') || '/auth/login';

  public finishedAuthCheck = computed<boolean>(() => {
    if (this.authService.authStatus() === AuthStatus.checking) return false;

    return true;
  });

  public authStatusChanged = effect(() => {
    switch (this.authService.authStatus()) {
      case AuthStatus.checking:
        return;

      case AuthStatus.authenticated:
        this.router.navigateByUrl('/dashboard');
        return;

      case AuthStatus.notAuthenticated:
        this.router.navigateByUrl(this.currentRoute);
        return;
    }
  });
}
