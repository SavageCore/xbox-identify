import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { REPOSITORY_URL } from '@lib/constants';
import { AuthService, ThemeService } from '@lib/services';
import { AppTheme } from '@lib/services/theme';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, LogoComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
  public readonly repositoryURL = REPOSITORY_URL;
  public currentTheme!: AppTheme | null;

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _themeService: ThemeService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this._themeService.currentTheme$.subscribe((theme) => {
      this.currentTheme = theme;
      this._changeDetectorRef.detectChanges();
    });
  }

  onClickSignOut(): void {
    this._authService.logout();
    this._router.navigateByUrl('/auth/login');
  }
}
