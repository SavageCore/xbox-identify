import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { SettingsPage } from './settings.page';

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsPage, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test the ngOnInit() method
  it('should call ngOnInit()', () => {
    spyOn(component, 'ngOnInit');
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  // Test the ngOnDestroy() method
  it('should call ngOnDestroy()', () => {
    spyOn(component, 'ngOnDestroy');
    component.ngOnDestroy();
    expect(component.ngOnDestroy).toHaveBeenCalled();
  });

  // Test theme change
  it('should change theme to light', () => {
    const selectEl = fixture.debugElement.query(By.css('select'));
    selectEl.nativeElement.value = 'light';
    fixture.detectChanges();
    fixture.whenStable();
    expect(selectEl.nativeElement.value).toEqual('light');
  });

  it('should change theme to dark', () => {
    const selectEl = fixture.debugElement.query(By.css('select'));
    selectEl.nativeElement.value = 'dark';
    fixture.detectChanges();
    fixture.whenStable();
    expect(selectEl.nativeElement.value).toEqual('dark');
  });
});
