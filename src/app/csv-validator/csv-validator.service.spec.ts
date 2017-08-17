import { DebugElement, ReflectiveInjector } from '@angular/core';

import { CsvValidatorService } from '../../../export';

describe('Csv Validator Service', () => {
  let csvValidator: CsvValidatorService;

  beforeEach(() => {
    this.injector = ReflectiveInjector.resolveAndCreate([
      CsvValidatorService
    ]);
    csvValidator = this.injector.get(CsvValidatorService);
  });

  it('service should be created', () => {
    expect(csvValidator).toBeTruthy();
  });

  it('count of expected delimiter are the same for each line. should return expected delimiter.', () => {
    expect(csvValidator.detectCSV('a;b;c\n1;2;3', { delimiter: ';' })).toEqual({ delimiter: ";" });
  });

  it('count of expected delimiter are not the same for each line. should return null', () => {
    expect(csvValidator.detectCSV('a;b;c\n1;23', { delimiter: ';' })).toEqual(null);
  });

  it('expected delimiter is not found. should return null', () => {
    expect(csvValidator.detectCSV('a,b,c\n', { delimiter: ';' })).toEqual(null);
  });

  it('not a csv. should return null', () => {
    expect(csvValidator.detectCSV('abcdef', { delimiter: ';' })).toEqual(null);
  });

  it('one line csv. should return expected delimiter', () => {
    expect(csvValidator.detectCSV('a;b;c;d;e;f', { delimiter: ';' })).toEqual({ delimiter: ';' });
  });

  it('count of another possible delimiter is greater than count of expected delimiter. should return null', () => {
    expect(csvValidator.detectCSV('a;b,c\nd,e,f', { delimiter: ';' })).toEqual(null);
  });

  it('not valid expected delimiter. should return null', () => {
    expect(csvValidator.detectCSV('a;b,c\nd,e,f', { delimiter: ')' })).toEqual(null);
  });
});