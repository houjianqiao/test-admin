import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Keyword} from "./data/Keyword";

@Injectable()
export class FeatureManagerService {

  constructor(private http: HttpClient) {
  }

  loadKeywordType() {
    return this.http.get('engine/keyword/getKeywordType');
  }
  deleteKeywordType(title: string, secondTitle: string) {
    const params = new HttpParams()
      .set('title', title + '')
      .set('secondTitle', secondTitle + '');
    return this.http.get('engine/keyword/deleteKeywordType', {params});
  }

  getKeyword(title: string, secondTitle: string) {
    const params = new HttpParams()
      .set('title', title + '')
      .set('secondTitle', secondTitle + '');
    return this.http.get('engine/keyword/getKeyword', {params});
  }

  saveKeyword(title: string, secondTitle: string, tableData: string[]) {
    const body = {title: title, secondTitle: secondTitle, tableData: JSON.stringify(tableData)};
    const params = new HttpParams()
      .set('title', title)
      .set('secondTitle', secondTitle)
      .set('tableData', JSON.stringify(tableData));
    return this.http.post('engine/keyword/saveKeyword', body);
  }
}

export interface Data {
  data: Keyword[];
}
