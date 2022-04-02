import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UppercaseInputDirective } from './directives/uppercase-input.directive';

@NgModule({
  declarations: [
    UppercaseInputDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports:[
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UppercaseInputDirective
  ]
})
export class SharedModule { }
