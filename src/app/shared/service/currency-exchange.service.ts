import { Injectable, OnInit } from '@angular/core';

import { MappedCurrencyRateObject } from '../interface/exchange-rates.model';
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
    public converterForm: FormGroup = new FormGroup({
        amountControl: new FormControl('', [Validators.required]),
        fromControl: new FormControl('', [Validators.required]),
        toControl: new FormControl('', [Validators.required]),
    });

    public exchangeRates: MappedCurrencyRateObject[];
    public periodicHistoryExchangeRates: PeriodicHistoryElement[] =
        <PeriodicHistoryElement[]>this.storageService.getObject('exchangeRates') || [];

    public fromCurrencies: string[] = [];
    public toCurrencies: string[] = [];

    public currentDate: string;
    public currentTime: string;

    constructor(private storageService: StorageService) {}

    ngOnInit() {}

    toTwoDigits(givenNumber: number) {
        return givenNumber > 9 ? `${givenNumber}` : `0${givenNumber}`;
    }

    getCurrentDate(separator: string): string {
        const now = new Date();

        const currentDay = now.getDate();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        this.currentDate = [currentDay, currentMonth, currentYear]
            .map(this.toTwoDigits)
            .join(separator);

        return this.currentDate;
    }

    getCurrentTime(separator: string): string {
        const now = new Date();

        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentSecond = now.getSeconds();

        this.currentTime = [currentHour, currentMinute, currentSecond]
            .map(this.toTwoDigits)
            .join(separator);

        return this.currentTime;
    }
}
