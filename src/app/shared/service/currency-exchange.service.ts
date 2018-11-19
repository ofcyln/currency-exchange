import { Injectable } from '@angular/core';

import { ExchangeRatesResponse } from '../interface/exchange-rates.model';

@Injectable()
export class CurrencyExchangeService {
    exchangeRates: ExchangeRatesResponse[];
    fromCurrencies: string[] = [];
    toCurrencies: string[] = [];

    constructor() {}

}
