import { Injectable } from '@angular/core';

@Injectable()
export class CsvValidatorService {
  private fileExtensionRegex = /.+.csv/i;

  /**
   * Detects if the content of a CSV (in the sense of character seperated values) is valid and determine the delimiter character.
   * Number of delimiters must be the same in each line for it to be considered valid.
   *
   * It takes a second param called "opts", a object containing:
   * delimiter: Delimiter to detect, default to ";"
   * expectedDelimiterCount: Expected count of delimiters in the first line of the CSV. This should be used to ensure that the CSV has 
   * the expected number of columns.
   * 
   * Exemples of usage:
   * let isCsv = detectCSV('a;b;c\n1;2;3', { delimiter: ';' });
   *   returns: { delimiter: ";" }
   *
   * let isCsv = detectCSV('a;b;c\n1;23', { delimiter: ';' });
   *   returns: null
   *
   * let isCsv = detectCSV('lal,ala', { delimiter: ';' });
   *   returns: null
   *
   * let isCsv = detectCSV('lalala', { delimiter: ';' });
   *   returns: null
   * 
   * Check service specs to get more examples
   *
   * @param content Csv content as text
   * @param opts opts (see examples above)
   */
  public detectCSV(content, opts) {
    opts = opts || {};
    if (Buffer.isBuffer(content)) {
      content = content + '';
    }

    const delimiters = [',', ';', '\t', '|'];
    const expectedDelimiter = opts.delimiter || ';';
    const uglyLines = content.split(/[\n\r]+/g);

    // removes all empty strings from array
    const csvLines = uglyLines.filter(entry => /\S/.test(entry));

    // counts delimiters in header
    const headerCount = this.countDelimiters(csvLines[0], delimiters, expectedDelimiter);

    if (opts.expectedDelimiterCount) {
      if (headerCount !== opts.expectedDelimiterCount) {
        return null;
      }
    }

    if (headerCount) {
      // counts delimiters in the whole content
      const wholeContentCount = this.countDelimiters(content, delimiters, expectedDelimiter);
      if (wholeContentCount) {
        const isCountOk = this.validateCount(wholeContentCount, headerCount, csvLines.length);
        if (isCountOk) {
          return {
            delimiter: expectedDelimiter
          }
        }
      }
    }
    return null;
  }

  /**
   * Determines wether a file has a .csv extension (to improve validation).
   * @param fileName
   */
  public isCsvExtension(fileName: string): boolean {
    return !!fileName.match(this.fileExtensionRegex);
  }

  private countDelimiters(content, items, expectedDelimiter) {
    let ignoreString = false;
    const itemCount: any = {};
    let contentLength;
    content ? contentLength = content.length : contentLength = 0;

    items.forEach((item) => {
      itemCount[item] = 0;
    });

    for (let i = 0; i < contentLength; i++) {
      if (content[i] === '"') {
        ignoreString = !ignoreString;
      } else if (!ignoreString && content[i] in itemCount) {
        ++itemCount[content[i]];
        if (content[i] !== expectedDelimiter) {
          if (itemCount[content[i]] > itemCount[content[i]]) {
            return null;
          }
        }
      }
    }
    return itemCount[expectedDelimiter];
  }

  private validateCount(wholeContentCount, headerCount, linesLength) {
    // making sure we are counting delimiters in different lines
    return wholeContentCount % headerCount === 0 && wholeContentCount / linesLength === headerCount;
  }
}