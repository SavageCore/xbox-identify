import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
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

  // Test form validation
  it('should validate the manufacturing date format within the form', () => {
    component.identifyForm.controls['manufdate'].setValue('2002-10-25');
    expect(component.identifyForm.controls['manufdate'].valid).toBeTruthy();
  });

  it('should validate the serial number format within the form', () => {
    component.identifyForm.controls['hwsn'].setValue('216488624305');
    expect(component.identifyForm.controls['hwsn'].valid).toBeTruthy();

    component.identifyForm.controls['hwsn'].setValue('2164886 24305');
    expect(component.identifyForm.controls['hwsn'].valid).toBeTruthy();

    component.identifyForm.controls['hwsn'].setValue('216488624305a');
    expect(component.identifyForm.controls['hwsn'].valid).toBeFalsy();
  });
});
