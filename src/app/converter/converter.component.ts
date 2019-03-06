import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { ExchangeRatesApiRequestService } from '../shared/service/exchange-rates-api-request.service';
import { AlertService } from '../core/alert/alert.service';
import { CurrencyExchangeService, PeriodicHistoryElement } from '../shared/service/currency-exchange.service';
import { ExchangeRatesResponse, MappedCurrencyRateObject } from '../shared/interface/exchange-rates.model';
import { StorageService } from '../shared/service/storage.service';
import {
    Currency,
    FormNames,
    LocalStorageItems,
    StatisticalDataTableFields,
    TableColumnNames,
    TimeIntervalTypes,
} from '../shared/interface/enums.model';

export interface Statistics {
    name: string;
    summary: number;
}

@Component({
    selector: 'app-converter',
    templateUrl: './converter.component.html',
    styleUrls: ['./converter.component.scss'],
})
export class ConverterComponent implements OnInit {
    public periodicHistoryData: PeriodicHistoryElement[] = this.currencyExchangeService.periodicHistoryExchangeRates;

    public dataSource = new MatTableDataSource(this.periodicHistoryData);
    public displayedHistoricalColumns: string[] = [TableColumnNames.Date, TableColumnNames.ExchangeRate];

    public statisticalData: Statistics[];
    public statisticalDataSource = new MatTableDataSource(this.statisticalData);
    public displayedStatisticalColumns: string[] = [TableColumnNames.Name, TableColumnNames.Summary];

    public selectedDuration =
        StorageService.getItem(LocalStorageItems.SelectedTimeInterval) || TimeIntervalTypes.AllTime;

    public converterForm: FormGroup;
    public filteredFromValues: Observable<string[]>;
    public filteredToValues: Observable<string[]>;

    public id: number = new Date().getTime();
    public amount: number;
    public fromRate: number;
    public fromCurrency: string;
    public toRate: number;
    public toCurrency: string;
    public result: string;

    constructor(
        public currencyExchangeService: CurrencyExchangeService,
        private apiRequestService: ExchangeRatesApiRequestService,
        private alertService: AlertService,
    ) {}

    ngOnInit() {
        this.converterForm = this.currencyExchangeService.converterForm;

        this.converterForm.controls[FormNames.FromControl].disable();
        this.converterForm.controls[FormNames.ToControl].disable();

        if (
            this.currencyExchangeService.exchangeRates === undefined ||
            this.currencyExchangeService.exchangeRates.length <= 0
        ) {
            this.apiRequestService.getExchangeRates(Currency.USD).subscribe(
                (exchangeRate: ExchangeRatesResponse) => {
                    this.currencyExchangeService.exchangeRates = this.mapResponseData(exchangeRate);

                    this.currencyExchangeService.fromCurrencies = this.mapItemCurrencies();

                    this.currencyExchangeService.toCurrencies = this.mapItemCurrencies();

                    this.converterForm.controls[FormNames.FromControl].enable();
                    this.converterForm.controls[FormNames.ToControl].enable();
                },
                (error) => {
                    this.alertService.error(`Error: ${error.message}`);
                },
            );
        } else {
            this.converterForm.controls[FormNames.FromControl].enable();
            this.converterForm.controls[FormNames.ToControl].enable();
        }

        this.filteredFromValues = this.getFromValueChanges(FormNames.FromControl);

        this.filteredToValues = this.getToValueChanges(FormNames.ToControl);

        this.statisticalData = [
            {
                name: StatisticalDataTableFields.Lowest,
                summary: this.getLowestRate(this.currencyExchangeService.periodicHistoryExchangeRates),
            },
            {
                name: StatisticalDataTableFields.Highest,
                summary: this.getHighestRate(this.currencyExchangeService.periodicHistoryExchangeRates),
            },
            {
                name: StatisticalDataTableFields.Average,
                summary:
                    this.getAverageRate(this.currencyExchangeService.periodicHistoryExchangeRates) > -1
                        ? this.getAverageRate(this.currencyExchangeService.periodicHistoryExchangeRates)
                        : 0,
            },
        ];

        this.statisticalDataSource = new MatTableDataSource(this.statisticalData);

        this.selectedTimeInterval();
    }

    exchangeRates(): void {
        this.fromRate = this.filterSelectedValue(FormNames.FromControl).rate;
        this.fromCurrency = this.filterSelectedValue(FormNames.FromControl).currency;

        this.toRate = this.filterSelectedValue(FormNames.ToControl).rate;
        this.toCurrency = this.filterSelectedValue(FormNames.ToControl).currency;

        this.amount = Math.floor(this.converterForm.get(FormNames.AmountControl).value);

        this.result = this.calculateExchangeRate();

        this.incrementNumberForID();

        this.currencyExchangeService.periodicHistoryExchangeRates.unshift({
            id: this.id,
            date: `${this.currencyExchangeService.getCurrentDate('/')}
\n@${this.currencyExchangeService.getCurrentTime(':')}`,
            time: this.currencyExchangeService.getCurrentTime(':'),
            exchangeRate: `${this.fromCurrency} to ${this.toCurrency}
\n${(this.toRate / this.fromRate).toFixed(5)}`,
            pureExchangeRate: Number((this.toRate / this.fromRate).toFixed(5)),
            creationDate: this.currencyExchangeService.getCurrentDate('/'),
            fromCurrency: this.fromCurrency,
            toCurrency: this.toCurrency,
            amount: this.amount,
        });

        StorageService.setObject(LocalStorageItems.ExchangeRates, [
            ...this.currencyExchangeService.periodicHistoryExchangeRates,
        ]);

        this.dataSource = new MatTableDataSource(this.periodicHistoryData);
        this.statisticalData = [
            {
                name: StatisticalDataTableFields.Lowest,
                summary: this.getLowestRate(this.currencyExchangeService.periodicHistoryExchangeRates),
            },
            {
                name: StatisticalDataTableFields.Highest,
                summary: this.getHighestRate(this.currencyExchangeService.periodicHistoryExchangeRates),
            },
            {
                name: StatisticalDataTableFields.Average,
                summary:
                    this.getAverageRate(this.currencyExchangeService.periodicHistoryExchangeRates) > -1
                        ? this.getAverageRate(this.currencyExchangeService.periodicHistoryExchangeRates)
                        : 0,
            },
        ];

        this.statisticalDataSource = new MatTableDataSource(this.statisticalData);

        this.selectedTimeInterval();
    }

    changeExchangeInputValues(): void {
        this.converterForm = new FormGroup({
            amountControl: new FormControl(this.converterForm.get(FormNames.AmountControl).value, [
                Validators.required,
            ]),
            fromControl: new FormControl(this.converterForm.get(FormNames.ToControl).value, [Validators.required]),
            toControl: new FormControl(this.converterForm.get(FormNames.FromControl).value, [Validators.required]),
        });

        this.incrementNumberForID();

        this.currencyExchangeService.fromCurrencies = this.mapItemCurrencies();

        this.currencyExchangeService.toCurrencies = this.mapItemCurrencies();

        this.filteredFromValues = this.getFromValueChanges(FormNames.FromControl);

        this.filteredToValues = this.getToValueChanges(FormNames.ToControl);
    }

    filterSelectedValue(value: string): MappedCurrencyRateObject {
        return this.currencyExchangeService.exchangeRates.filter((item: MappedCurrencyRateObject) => {
            return item.currency === this.converterForm.get(value).value;
        })[0];
    }

    mapItemCurrencies(): string[] {
        return this.currencyExchangeService.exchangeRates
            .map((currencyItem: MappedCurrencyRateObject) => {
                return currencyItem.currency;
            })
            .sort();
    }

    mapResponseData(responseData: ExchangeRatesResponse): MappedCurrencyRateObject[] {
        return Object.keys(responseData.rates).map(
            (item: string): MappedCurrencyRateObject => {
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

    // TODO: five digits after comma

    getHighestRate(calculationArray: PeriodicHistoryElement[]): number {
        return calculationArray
            .map((item: PeriodicHistoryElement) => {
                return Number(item.pureExchangeRate);
            })
            .sort((firstItem, secondItem) => firstItem - secondItem)[calculationArray.length - 1];
    }

    getLowestRate(calculationArray: PeriodicHistoryElement[]): number {
        return calculationArray
            .map((item: PeriodicHistoryElement) => {
                return Number(item.pureExchangeRate);
            })
            .sort((firstItem, secondItem) => secondItem - firstItem)[calculationArray.length - 1];
    }

    getAverageRate(calculationArray: PeriodicHistoryElement[]): number {
        let values = calculationArray.map((item: PeriodicHistoryElement) => {
            return Number(item.pureExchangeRate);
        });
        let summary = values.reduce((acc, current) => current + acc, 0);

        return Number((summary / values.length).toFixed(5));
    }

    calculateExchangeRate(): string {
        return ((this.converterForm.get(FormNames.AmountControl).value * this.toRate) / this.fromRate).toFixed(3);
    }

    incrementNumberForID(): number {
        return (this.id += 1);
    }

    filterTableUponDaySelection(date: string, dayInterval: number): PeriodicHistoryElement[] {
        return this.currencyExchangeService.periodicHistoryExchangeRates.filter((item) => {
            if (Math.abs(+item.creationDate.split('/')[1] - +date.split('/')[1]) === 1) {
                return Math.abs(+item.creationDate.split('/')[0] - +date.split('/')[0]) >= 30 - dayInterval;
            } else if (Math.abs(+item.creationDate.split('/')[1] - +date.split('/')[1]) === 0) {
                return Math.abs(+item.creationDate.split('/')[0] - +date.split('/')[0]) <= dayInterval;
            }
        });
    }

    filterTableUponMonth(date: string, dayInterval: number, monthInterval: number): PeriodicHistoryElement[] {
        return this.currencyExchangeService.periodicHistoryExchangeRates.filter((item) => {
            return (
                Math.abs(+item.creationDate.split('/')[0] - +date.split('/')[0]) <= dayInterval &&
                Math.abs(+item.creationDate.split('/')[1] - +date.split('/')[1]) <= monthInterval
            );
        });
    }

    calculateStatisticsFromNewArray(newDataTableArray: PeriodicHistoryElement[]): void {
        this.statisticalData = [
            {
                name: StatisticalDataTableFields.Lowest,
                summary: this.getLowestRate(newDataTableArray),
            },
            {
                name: StatisticalDataTableFields.Highest,
                summary: this.getHighestRate(newDataTableArray),
            },
            {
                name: StatisticalDataTableFields.Average,
                summary: this.getAverageRate(newDataTableArray) > -1 ? this.getAverageRate(newDataTableArray) : 0,
            },
        ];
    }

    selectedTimeInterval(): void {
        const date = this.currencyExchangeService.getCurrentDate('/');

        switch (this.selectedDuration) {
            case TimeIntervalTypes.SevenDays:
                const sevenDaysConversions = this.filterTableUponDaySelection(date, 6);

                this.dataSource = new MatTableDataSource(sevenDaysConversions);

                this.calculateStatisticsFromNewArray(sevenDaysConversions);

                this.statisticalDataSource = new MatTableDataSource(this.statisticalData);

                break;

            case TimeIntervalTypes.FourteenDays:
                const fourteenDaysConversions = this.filterTableUponDaySelection(date, 14);

                this.dataSource = new MatTableDataSource(fourteenDaysConversions);

                this.calculateStatisticsFromNewArray(fourteenDaysConversions);

                this.statisticalDataSource = new MatTableDataSource(this.statisticalData);

                break;

            case TimeIntervalTypes.ThirtyDaysConversions:
                const thirtyDaysConversions = this.filterTableUponMonth(date, 30, 1);

                this.dataSource = new MatTableDataSource(thirtyDaysConversions);

                this.calculateStatisticsFromNewArray(thirtyDaysConversions);

                this.statisticalDataSource = new MatTableDataSource(this.statisticalData);

                break;

            default:
                this.dataSource = new MatTableDataSource(this.periodicHistoryData);

                this.calculateStatisticsFromNewArray(this.currencyExchangeService.periodicHistoryExchangeRates);

                this.statisticalDataSource = new MatTableDataSource(this.statisticalData);

                break;
        }

        StorageService.setItem(LocalStorageItems.SelectedTimeInterval, this.selectedDuration);
    }

    private filterFromInputValue(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.currencyExchangeService.fromCurrencies.filter((option) =>
            option.toLowerCase().includes(filterValue),
        );
    }

    private filterToInputValue(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.currencyExchangeService.toCurrencies.filter((option) => option.toLowerCase().includes(filterValue));
    }
}
