import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Keyword } from './Keyword';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class KeywordService {

    constructor(private http: HttpClient) { }

    getKeywords(): Promise<Keyword[]> {
        return this.http.get(`/assets/mock-data/keyword.json`)
            .toPromise()
            .then(response => response as Keyword[])
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}