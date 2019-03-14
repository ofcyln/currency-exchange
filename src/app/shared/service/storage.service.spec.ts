import { TestBed, inject, async } from '@angular/core/testing';

import { StorageService } from './storage.service';

describe('StorageService', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [StorageService],
        });
    }));

    it('should be created', inject([StorageService], (service: StorageService) => {
        expect(service).toBeTruthy();
    }));
});
