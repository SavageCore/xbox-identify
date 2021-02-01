import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TypeofPipe } from './typeof.pipe';

@NgModule({
  declarations: [TypeofPipe],
  imports: [CommonModule],
  exports: [TypeofPipe],
})
export class TypeofModule {}
