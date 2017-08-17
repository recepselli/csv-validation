import { CsvValidationPage } from './app.po';

describe('csv-validation App', () => {
  let page: CsvValidationPage;

  beforeEach(() => {
    page = new CsvValidationPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
