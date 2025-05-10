// import { CurrencyConverterPipe } from './currency-converter.pipe';

// describe('CurrencyConverterPipe', () => {
//   it('create an instance', () => {
//     const pipe = new CurrencyConverterPipe();
//     expect(pipe).toBeTruthy();
//   });
// });


import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CurrencyConverterPipe } from './currency-converter.pipe';

describe('CurrencyConverterPipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CurrencyConverterPipe],
    });
  });

  it('create an instance', () => {
    const pipe = TestBed.inject(CurrencyConverterPipe);
    expect(pipe).toBeTruthy();
  });
});
