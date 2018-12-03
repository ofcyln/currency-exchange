import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { NomicsApiRequestService } from '../shared/service/nomics-api-request.service';
import { AlertService } from '../core/alert/alert.service';
import {
    CurrencyExchangeService,
    PeriodicHistoryElement,
} from '../shared/service/currency-exchange.service';
import {
    ExchangeRatesResponse,
    MappedCurrencyRateObject,
} from '../shared/interface/exchange-rates.model';
import { map, startWith } from 'rxjs/operators';
import { StorageService } from '../shared/service/storage.service';
import { MatTableDataSource } from '@angular/material';

export interface Statistics {
    name: string;
    summary: number;
}

export enum FormNames {
    FromControl = 'fromControl',
    ToControl = 'toControl',
}

@Component({
    selector: 'app-converter',
    templateUrl: './converter.component.html',
    styleUrls: ['./converter.component.scss'],
})
export class ConverterComponent implements OnInit {
    periodicHistoryData: PeriodicHistoryElement[] = this.currencyExchangeService
        .periodicHistoryExchangeRates;
    dataSource = new MatTableDataSource(this.periodicHistoryData.reverse());
    displayedHistoricalColumns: string[] = ['date', 'exchangeRate'];

    statisticalData: Statistics[] = [
        { name: 'Lowest', summary: this.getLowestRate() },
        { name: 'Highest', summary: this.getHighestRate() },
        { name: 'Average', summary: this.getAverageRate() > -1 ? this.getAverageRate() : 0 },
    ];
    statisticalDataSource = new MatTableDataSource(this.statisticalData);
    displayedStatisticalColumns: string[] = ['name', 'summary'];

    selectedDuration = 'sevenDays';

    converterForm: FormGroup;
    filteredFromValues: Observable<string[]>;
    filteredToValues: Observable<string[]>;

    id: number = new Date().getTime();
    amount: number;
    fromRate: number;
    fromCurrency: string;
    toRate: number;
    toCurrency: string;
    result: string;

    constructor(
        public currencyExchangeService: CurrencyExchangeService,
        private apiRequestService: NomicsApiRequestService,
        private alertService: AlertService,
        private storageService: StorageService,
    ) {}

    ngOnInit() {
        this.converterForm = this.currencyExchangeService.converterForm;

        this.converterForm.controls['fromControl'].disable();
        this.converterForm.controls['toControl'].disable();

        this.apiRequestService.getExchangeRates('USD').subscribe(
            (exchangeRate: ExchangeRatesResponse) => {
                this.currencyExchangeService.exchangeRates = this.mapResponseData(exchangeRate);

                this.currencyExchangeService.fromCurrencies = this.mapItemCurrencies();

                this.currencyExchangeService.toCurrencies = this.mapItemCurrencies();

                this.converterForm.controls['fromControl'].enable();
                this.converterForm.controls['toControl'].enable();
            },
            (error) => {
                this.alertService.error(`Error: ${error}`);
            },
        );

        this.filteredFromValues = this.getFromValueChanges(FormNames.FromControl);

        this.filteredToValues = this.getToValueChanges(FormNames.ToControl);
    }

    exchangeRates(): void {
        this.fromRate = this.filterSelectedValue(FormNames.FromControl).rate;
        this.fromCurrency = this.filterSelectedValue(FormNames.FromControl).currency;

        this.toRate = this.filterSelectedValue(FormNames.ToControl).rate;
        this.toCurrency = this.filterSelectedValue(FormNames.ToControl).currency;

        this.amount = Math.floor(this.converterForm.get('amountControl').value);

        this.result = this.calculateExchangeRate();

        this.incrementId();

        this.currencyExchangeService.periodicHistoryExchangeRates.push({
            id: this.id,
            date: `${this.currencyExchangeService.getCurrentDate()} @${this.currencyExchangeService.getCurrentTime()}`,
            exchangeRate: `${this.fromCurrency} to ${this.toCurrency}
\n${(+this.toRate / +this.fromRate).toFixed(5)}`,
            pureExchangeRate: Number((+this.toRate / +this.fromRate).toFixed(5)),
            creationDate: this.currencyExchangeService.getCurrentDate(),
            fromCurrency: this.fromCurrency,
            toCurrency: this.toCurrency,
            amount: this.amount,
        });

        this.storageService.setObject('exchangeRates', [
            ...this.currencyExchangeService.periodicHistoryExchangeRates,
        ]);

        this.dataSource = new MatTableDataSource(this.periodicHistoryData.reverse());
    }

    changeExchangeInputValues(): void {
        this.converterForm = new FormGroup({
            amountControl: new FormControl(this.converterForm.get('amountControl').value, [
                Validators.required,
            ]),
            fromControl: new FormControl(this.converterForm.get('toControl').value, [
                Validators.required,
            ]),
            toControl: new FormControl(this.converterForm.get('fromControl').value, [
                Validators.required,
            ]),
        });

        this.incrementId();

        this.currencyExchangeService.fromCurrencies = this.mapItemCurrencies();

        this.currencyExchangeService.toCurrencies = this.mapItemCurrencies();

        this.filteredFromValues = this.getFromValueChanges(FormNames.FromControl);

        this.filteredToValues = this.getToValueChanges(FormNames.ToControl);
    }

    filterSelectedValue(value: string): MappedCurrencyRateObject {
        return this.currencyExchangeService.exchangeRates.filter(
            (item: MappedCurrencyRateObject) => {
                return item.currency === this.converterForm.get(value).value;
            },
        )[0];
    }

    mapItemCurrencies(): string[] {
        return this.currencyExchangeService.exchangeRates.map(
            (currencyItem: MappedCurrencyRateObject) => {
                return currencyItem.currency;
            },
        );
    }

    mapResponseData(responseData: ExchangeRatesResponse) {
        return Object.keys(responseData.rates).map(
            (item): MappedCurrencyRateObject => {
                return {
                    currency: item,
                    rate: responseData.rates[item],
                };
            },
        );
    }

    getFromValueChanges(stringValue: string): Observable<string[]> {
        return this.converterForm.get(stringValue).valueChanges.pipe(
            startWith(''),
            map((value) => this.filterFromInputValue(value)),
        );
    }

    getToValueChanges(stringValue: string): Observable<string[]> {
        return this.converterForm.get(stringValue).valueChanges.pipe(
            startWith(''),
            map((value) => this.filterToInputValue(value)),
        );
    }

    getHighestRate(): number {
        return this.currencyExchangeService.periodicHistoryExchangeRates
            .map((item: PeriodicHistoryElement) => {
                return Number(item.pureExchangeRate);
            })
            .sort((first, second) => first - second)[
            this.currencyExchangeService.periodicHistoryExchangeRates.length - 1
        ];
    }

    getLowestRate(): number {
        return this.currencyExchangeService.periodicHistoryExchangeRates
            .map((item: PeriodicHistoryElement) => {
                return Number(item.pureExchangeRate);
            })
            .sort((first, second) => second - first)[
            this.currencyExchangeService.periodicHistoryExchangeRates.length - 1
        ];
    }

    getAverageRate(): number {
        let values = this.currencyExchangeService.periodicHistoryExchangeRates.map(
            (item: PeriodicHistoryElement) => {
                return Number(item.pureExchangeRate);
            },
        );
        let summary = values.reduce((acc, current) => current + acc, 5);

        return Number((summary / values.length).toFixed(5));
    }

    calculateExchangeRate(): string {
        return (
            (this.converterForm.get('amountControl').value * +this.toRate) /
            +this.fromRate
        ).toFixed(3);
    }

    incrementId(): number {
        return (this.id += 1);
    }

    selectedTimeInterval(): void {
        if (this.selectedDuration === 'sevenDays') {
            this.currencyExchangeService.periodicHistoryExchangeRates.filter((item) => {
                return this.currencyExchangeService.getCurrentDate() > item.creationDate;
            });
        } else if (this.selectedDuration === 'fourteenDays') {
            console.log('fourteenDays');
        } else {
            console.log('thirtyDays');
        }
    }

    private filterFromInputValue(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.currencyExchangeService.fromCurrencies.filter((option) =>
            option.toLowerCase().includes(filterValue),
        );
    }

    private filterToInputValue(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.currencyExchangeService.toCurrencies.filter((option) =>
            option.toLowerCase().includes(filterValue),
        );
    }
}
