import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CsvValidatorService } from './csv-validator.service';

@NgModule({
  providers: [
    CsvValidatorService
  ],
  imports: [
    CommonModule
  ],
  declarations: []
})
export class CsvValidatorModule {}