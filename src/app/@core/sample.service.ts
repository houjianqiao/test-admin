import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable()
export class SampleService {

  constructor(private http: HttpClient) {
  }

  loadSampleType() {
    return this.http.get('engine/sample/getSampleType');
  }

  loadSamplePhoto(page: Page) {
    return this.http.post('engine/sample/getSamplePhoto', page);
  }

  loadSampleOption() {
    return this.http.get('engine/sample/getSampleOption');
  }

  changState(ids, state) {
    const params = new HttpParams()
      .set('ids', JSON.stringify(ids))
      .set('state', state);
    return this.http.get('engine/sample/changState', {params});
  }

  saveSample(param) {
    return this.http.post('engine/sample/saveSample', param);
  }

  editSampleType(param) {
    return this.http.post('engine/sample/editSampleType', param);
  }

  savefirstEvent(eventName) {
    const params = new HttpParams()
      .set('eventName', eventName);
    return  this.http.post('engine/sample/savefirstEvent', params);
  }
}

export class Page {
  public typeSearch: String[];
  public keyword: String;
  public pageSize: Number;
  public pageIndex: number;
  public stateSearch: string[];
}

export class Sample {
  public name: string;
  public id: number;
  public typeid1: number;
  public typeid2: number;
  public state: number;
  public state1: string;
  public label: string;
  public ids: number[];
  public threshold: number;

}
