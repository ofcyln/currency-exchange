import { Injectable, OnInit } from '@angular/core';

import { ExchangeRatesResponse, MappedCurrencyRateObject } from '../interface/exchange-rates.model';
import { StorageService } from './storage.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface PeriodicHistoryElement {
    id: number;
    date: string;
    exchangeRate: string;
    pureExchangeRate?: number;
    creationDate?: string;
    fromCurrency?: string;
    toCurrency?: string;
    amount?: number;
}

@Injectable()
export class CurrencyExchangeService implements OnInit {
    converterForm: FormGroup = new FormGroup({
        amountControl: new FormControl('', [Validators.required]),
        fromControl: new FormControl('', [Validators.required]),
        toControl: new FormControl('', [Validators.required]),
    });

    exchangeRates: MappedCurrencyRateObject[];
    periodicHistoryExchangeRates: PeriodicHistoryElement[] =
        <PeriodicHistoryElement[]>this.storageService.getObject('exchangeRates') || [];

    fromCurrencies: string[] = [];
    toCurrencies: string[] = [];

    currentDate: string;
    currentTime: string;

    constructor(private storageService: StorageService) {}

    ngOnInit() {}

    getCurrentDate(): string {
        let currentDay = new Date().getDate();
        let currentMonth = new Date().getMonth() + 1;
        let currentYear = new Date().getFullYear();

        this.currentDate = `${currentDay < 10 ? '0' : ''}${currentDay}/${
            currentMonth < 10 ? '0' : ''
        }${currentMonth}/${currentYear}`;

        return this.currentDate;
    }

    getCurrentTime(): string {
        let currentHour = new Date().getHours();
        let currentMinute = new Date().getMinutes();
        let currentSecond = new Date().getSeconds();

        this.currentTime = `${currentHour < 10 ? '0' : ''}${currentHour}:${
            currentMinute < 10 ? '0' : ''
        }${currentMinute}:${currentSecond < 10 ? '0' : ''}${currentSecond}`;

        return this.currentTime;
    }
}
