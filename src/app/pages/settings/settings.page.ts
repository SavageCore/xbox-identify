import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppTheme, ThemeService } from '@lib/services/theme';
import { Subject, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.css'],
})
export class SettingsPage implements OnInit, OnDestroy {
  public currentTheme!: AppTheme | null;
  public settingsForm: FormGroup;

  private _destroy$ = new Subject();

  constructor(private _themeService: ThemeService, private formBuilder: FormBuilder) {
    this.settingsForm = this.formBuilder.group({
      theme: [''],
    });
  }

  ngOnInit(): void {
    this._themeService.currentTheme$
      .pipe(takeUntil(this._destroy$))
      .subscribe((theme) => (this.currentTheme = theme));

    if (this.currentTheme) {
      this.settingsForm.controls['theme'].setValue(this.currentTheme);
    }

    this.settingsForm.controls['theme'].valueChanges.subscribe((theme) => {
      this.handleThemeChange(theme);
    });
  }

  ngOnDestroy(): void {
    this._destroy$.complete();
    this._destroy$.unsubscribe();
  }

  handleThemeChange(theme: AppTheme): void {
    this._themeService.setTheme(theme);
  }
}
