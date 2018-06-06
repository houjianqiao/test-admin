import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable()
export class FaceService {

  constructor(private http: HttpClient) {
  }

  loadFaceType() {
    return this.http.get('engine/face/getFaceType');
  }

  loadFacePhoto(page: Page) {
    return this.http.post('engine/face/getFacePhoto', page);
  }

  loadFaceOption() {
    return this.http.get('engine/face/getFaceOption');
  }

  saveFace(param) {
    return this.http.post('engine/face/saveFace', param);
  }

  editFaceType(param) {
    return this.http.post('engine/face/editFaceType', param);
  }

  changState(ids, state) {
    const params = new HttpParams()
      .set('ids', JSON.stringify(ids))
      .set('state', state);
    return this.http.get('engine/face/changState', {params});
  }

  loadFaceDetail(page: FaceDetail) {
    return this.http.post('engine/face/getFaceDetail', page);
  }
  savefirstEvent(eventName) {
    const params = new HttpParams()
      .set('eventName', eventName);
    return  this.http.post('engine/face/savefirstEvent', params);
  }

}

export class Page {
  public typeSearch: String[];
  public keyword: String;
  public pageSize: Number;
  public pageIndex: number;
}

export class Sample {
  public name: string;
  public id: number;
  public typeid1: number;
  public typeid2: number;
  public state: number;
  public label: string;
  public ids: number[];
  public threshold: number;

}

export class FaceDetail {
  public faceName: string;
  public faceId: string;
  public pageSize: Number;
  public pageIndex: number;
  public id: string;
}
