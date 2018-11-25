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

    currentDate: string;

    constructor(private storageService: StorageService) {}

    ngOnInit() {}

    getCurrentDate(): string {
        let currentDay = new Date().getDate();
        let currentMonth = new Date().getMonth() + 1;
        let currentYear = new Date().getFullYear();

        this.currentDate = `${currentDay}/${currentMonth}/${currentYear}`;

        return this.currentDate;
    }
}
