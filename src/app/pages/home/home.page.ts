import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppTheme, ThemeService } from '@lib/services/theme';
import { Subject, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.css'],
})
export class HomePage implements OnInit, OnDestroy {
  currentTheme!: AppTheme | null;
  identifyForm: FormGroup;
  formattedMessage = '';
  manufdate = '';
  hwsn = '';
  videochip = '';
  biosv = '';
  hasResult = false;
  hasError = false;
  manufacturingGuess: string[];
  videoChipGuess: string[];
  biosVersionGuess: string[];
  factoryGuess: string[];
  factoryName = '';
  productionGuess: string[];
  possibleRevisions: string[];
  mismatch: string[];
  snPattern = /^(\d{12}|\d{7} \d{5})$/;
  isoDatePattern = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;

  private _destroy$ = new Subject();

  constructor(private _themeService: ThemeService, private formBuilder: FormBuilder) {
    this.identifyForm = this.formBuilder.group({
      manufdate: [
        '',
        {
          validators: [Validators.required, Validators.pattern(this.isoDatePattern)],
          updateOn: 'blur',
        },
      ],
      hwsn: [
        '',
        {
          validators: [Validators.required, Validators.pattern(this.snPattern)],
          updateOn: 'blur',
        },
      ],
      videochip: ['unknown'],
      biosv: ['unknown'],
    });

    this.manufacturingGuess = [];
    this.videoChipGuess = [];
    this.biosVersionGuess = [];
    this.factoryGuess = [];
    this.productionGuess = [];
    this.possibleRevisions = [];
    this.mismatch = [];
  }

  ngOnInit(): void {
    this._themeService.currentTheme$
      .pipe(takeUntil(this._destroy$))
      .subscribe((theme) => (this.currentTheme = theme));

    this.onChanges();
  }

  onChanges(): void {
    let skip = true;
    this.identifyForm.valueChanges.subscribe(
      (val: { manufdate: string; hwsn: string; videochip: string; biosv: string }) => {
        console.log(val);

        this.manufdate = val.manufdate;
        if (!this.identifyForm.get('manufdate')!.valid) {
          console.log('Date invalid');
          return;
        } else {
          this.manufactureDateCheck();
          console.log('P');
        }

        this.hwsn = val.hwsn.replace(' ', '');
        console.log('hwsn', this.hwsn);
        console.log(this.identifyForm.get('hwsn')!.valid);
        if (this.identifyForm.get('hwsn')!.valid) {
          skip = false;
          this.hardwareSerialNumberCheck();
        }

        this.videochip = val.videochip;
        this.videoChipCheck();

        this.biosv = val.biosv;
        this.biosVersionCheck();
        console.log('skip', skip);

        if (skip === false) {
          this.checkMatches();
        }
      },
    );
  }

  manufactureDateCheck(): void {
    console.log('Date check');

    const checkDate = Date.parse(this.manufdate);

    const oneZeroFrom = Date.parse('2001-01-01');
    const oneZeroTo = Date.parse('2002-10-31');

    const oneOneFrom = Date.parse('2002-11-01');
    const oneOneTo = Date.parse('2003-04-30');

    const oneTwoFiveFrom = Date.parse('2003-05-01');
    const oneTwoFiveTo = Date.parse('2004-03-31');

    const oneSixFrom = Date.parse('2004-04-01');

    if (checkDate >= oneZeroFrom && checkDate <= oneZeroTo) {
      this.manufacturingGuess = ['1.0'];
    }
    if (checkDate >= oneOneFrom && checkDate <= oneOneTo) {
      this.manufacturingGuess = ['1.1'];
    }
    if (checkDate >= oneTwoFiveFrom && checkDate <= oneTwoFiveTo) {
      this.manufacturingGuess = ['1.2', '1.3', '1.4', '1.5'];
    }
    if (checkDate >= oneSixFrom) {
      this.manufacturingGuess = ['1.6'];
    }
  }

  hardwareSerialNumberCheck(): void {
    // TODO
    //
    // https://www.ogxbox.com/forums/index.php?/topic/59-identifying-your-xbox-revision/
    //
    // LNNNNNN YWWFF
    // L is the number of the production line within the factory.
    // NNNNNN is the number of the Xbox produced during the workweek.
    // Y is the last digit of the production year
    // WW is the number of the week of the production year.
    // FF is the code of the factory where the Xbox was manufactured
    //
    // 2120565 21703

    const l = this.hwsn.slice(0, 1);
    const nnnnnn = this.hwsn.slice(1, 7);
    const y = this.hwsn.slice(7, 8);
    const ww = this.hwsn.slice(8, 10);
    const ff = this.hwsn.slice(10, 12);

    console.log('L', l);
    console.log('NNNNNN', nnnnnn);
    console.log('Y', y);
    console.log('WW', ww);
    console.log('FF', ff);

    this.factoryCheck(ff);
    const yw = y + ww.slice(0, 1);
    this.productionCheck(yw);
  }

  videoChipCheck(): void {
    if (this.videochip === 'conexant') {
      this.videoChipGuess = ['1.0', '1.1', '1.2', '1.3'];
    }
    if (this.videochip === 'focus') {
      this.videoChipGuess = ['1.4', '1.5'];
    }
    if (this.videochip === 'xcalibur') {
      this.videoChipGuess = ['1.6'];
    }
    if (this.videochip === 'unknown') {
      this.videoChipGuess = ['?'];
    }
  }

  biosVersionCheck(): void {
    if (this.biosv === '3944' || this.biosv === '4034' || this.biosv === '4036' || this.biosv === '4627') {
      this.biosVersionGuess = ['1.0'];
    }
    if (this.biosv === '4817' || this.biosv === '4972') {
      this.biosVersionGuess = ['1.1'];
    }
    if (this.biosv === '5101' || this.biosv === '5713') {
      this.biosVersionGuess = ['1.1', '1.2', '1.3', '1.4', '1.5'];
    }
    if (this.biosv === '5838') {
      this.biosVersionGuess = ['1.6'];
    }
    if (this.biosv === 'unknown') {
      this.biosVersionGuess = ['?'];
    }
  }

  factoryCheck(ff: string): void {
    if (ff === '02') {
      this.factoryGuess = ['1.0', '1.1'];
      this.factoryName = 'Mexico';
    }
    if (ff === '03') {
      this.factoryGuess = ['1.0'];
      this.factoryName = 'Hungary';
    }
    if (ff === '05') {
      this.factoryGuess = ['1.2', '1.3', '1.4', '1.5', '1.6'];
      this.factoryName = 'China';
    }
    if (ff === '06') {
      this.factoryGuess = ['1.2', '1.3', '1.4', '1.5', '1.6'];
      this.factoryName = 'Taiwan';
    }
  }

  productionCheck(yw: string): void {
    console.log('productionCheck', yw);
    if (yw === '20' || yw === '21') {
      this.productionGuess = ['1.0'];
    } else if (yw === '23') {
      this.productionGuess = ['1.0', '1.1'];
    } else if (yw === '24' || yw === '25') {
      this.productionGuess = ['1.1'];
    } else if (yw === '30') {
      this.productionGuess = ['1.2'];
    } else if (yw === '31' || yw === '32') {
      this.productionGuess = ['1.3'];
    } else if (yw === '33') {
      this.productionGuess = ['1.4', '1.5'];
    } else if (yw === '42') {
      this.productionGuess = ['1.6'];
    } else {
      this.productionGuess = ['?'];
    }
  }

  checkMatches(): void {
    this.hasError = false;
    this.mismatch = [];

    if (!this.manufacturingGuess.some((r) => this.factoryGuess.includes(r))) {
      this.mismatch.push('factory');

      this.hasError = true;
    }
    // Filter possible revisions by manufacturing date and factory
    let possiblities = this.manufacturingGuess.filter((e) => this.factoryGuess.includes(e));

    // Further filter by production date
    if (!possiblities.some((r) => this.productionGuess.includes(r))) {
      this.mismatch.push('production date');

      this.hasError = true;
      return;
    }
    possiblities = possiblities.filter((e) => this.productionGuess.includes(e));

    // Further filter by video chip if known
    if (this.videochip !== 'unknown') {
      if (!possiblities.some((r) => this.videoChipGuess.includes(r))) {
        this.mismatch.push('video chip');

        this.hasError = true;
        return;
      }
      possiblities = possiblities.filter((e) => this.videoChipGuess.includes(e));
    }

    // Further filter by bios revision if known
    if (this.biosv !== 'unknown') {
      if (!possiblities.some((r) => this.biosVersionGuess.includes(r))) {
        this.mismatch.push('bios version');

        this.hasError = true;
        return;
      }

      possiblities = possiblities.filter((e) => this.biosVersionGuess.includes(e));
    }

    this.possibleRevisions = possiblities;
    this.hasResult = true;
  }

  ngOnDestroy(): void {
    this._destroy$.complete();
    this._destroy$.unsubscribe();
  }

  handleThemeChange(theme: AppTheme): void {
    this._themeService.setTheme(theme);
  }
}
