import { Injectable, OnInit } from '@angular/core';

import { ExchangeRatesResponse } from '../interface/exchange-rates.model';
import { StorageService } from './storage.service';

export interface PeriodicHistoryElement {
    date: string;
    exchangeRate: number;
}

@Injectable()
export class CurrencyExchangeService implements OnInit {
    exchangeRates: ExchangeRatesResponse[];
    periodicHistoryExchangeRates: PeriodicHistoryElement[] =
        <PeriodicHistoryElement[]>this.storageService.getObject('exchangeRates') || [];

    fromCurrencies: string[] = [];
    toCurrencies: string[] = [];

    constructor(private storageService: StorageService) {}

    ngOnInit() {}
}
