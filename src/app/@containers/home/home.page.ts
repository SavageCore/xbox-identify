import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Path } from '@core/structs';

@Component({
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  path = Path;
  identifyForm: FormGroup;
  formattedMessage: string;
  manufdate: string;
  hwsn: string;
  videochip: string;
  biosv: string;
  hasResult = false;
  hasError = false;
  manufacturingGuess: string[];
  videoChipGuess: string[];
  biosVersionGuess: string[];
  factoryGuess: string[];
  factoryName: string;
  productionGuess: string[];
  possibleRevisions: string[];
  mismatch: string[];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.identifyForm = this.formBuilder.group({
      manufdate: '2004-02-23',
      hwsn: '4023354 40905',
      videochip: 'unknown',
      biosv: 'unknown',
    });

    this.onChanges();
  }

  onChanges(): void {
    let skip = true;
    this.identifyForm.valueChanges.subscribe(
      (val: {
        manufdate: string;
        hwsn: string;
        videochip: string;
        biosv: string;
      }) => {
        console.log(val);

        this.manufdate = val.manufdate;
        if (this.manufdate.length !== 10) {
          return;
        } else {
          this.manufactureDateCheck();
        }

        this.hwsn = val.hwsn.replace(' ', '');
        if (this.hwsn.length === 12) {
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
      }
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
    if (
      this.biosv === '3944' ||
      this.biosv === '4034' ||
      this.biosv === '4036' ||
      this.biosv === '4627'
    ) {
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
    // // Determine if manufacturing date and video chip contain the same versions
    // console.log(
    //   'Manufacturing date + Video chip',
    //   this.manufacturingGuess.some((r) => this.videoChipGuess.includes(r))
    // );
    // if (!this.manufacturingGuess.some((r) => this.videoChipGuess.includes(r))) {
    //   this.mismatch.push('manufacturing date and video chip');
    //   console.log(this.mismatch);

    //   this.hasError = true;
    // }
    if (!this.manufacturingGuess.some((r) => this.factoryGuess.includes(r))) {
      this.mismatch.push('manufacturing date and factory');
      console.log(this.mismatch);

      this.hasError = true;
    }
    // Create new array of revisions that exist in both manufacturing date and factory
    const intersection = this.manufacturingGuess.filter((e) =>
      this.factoryGuess.includes(e)
    );

    this.possibleRevisions = intersection;
    this.hasResult = true;

    // if () {
    //   console.log('MATCH: Manufacturing date and video chip');
    // } else if (this.videoChipGuess.includes('?')) {
    //   console.log('PARTIAL: Unknown video chip');
    // } else {
    //   console.log('FAIL: Manufacturing date and video chip');
    // }
  }
}
