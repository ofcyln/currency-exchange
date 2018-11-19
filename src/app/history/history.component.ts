import { Component, OnInit } from '@angular/core';

export interface HistoryElement {
    date: string;
    event: string;
    actions: string;
}

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: [ './history.component.scss' ],
})
export class HistoryComponent implements OnInit {
    periodicHistoryData: HistoryElement[] = [
        { date: '03/04/2018', event: 'Converted an amount of 500 from EUR to USD', actions: '' },
        { date: '03/04/2018', event: 'Converted an amount of 500 from EUR to USD', actions: '' },
        { date: '03/04/2018', event: 'Converted an amount of 500 from EUR to USD', actions: '' },
        { date: '03/04/2018', event: 'Converted an amount of 500 from EUR to USD', actions: '' },
    ];
    displayedHistoricalColumns: string[] = [ 'date', 'event', 'actions' ];
    periodicHistorySource = this.periodicHistoryData;

    constructor() {
    }

    ngOnInit() {
    }

}
