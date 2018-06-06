import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from 'rxjs/Observable';

@Injectable()
export class EngineDeleteService {

  constructor(private http: HttpClient) {
  }

  loadEngineConf() {
    return this.http.get('engine/engineConf/getEngineConf');
  }

  loadInterfaceData() {
    return this.http.get('engine/engineConf/getInterfaceData');
  }

  changeStatus(status: String) {
    const params = new HttpParams()
      .set('status', status + '');
    return this.http.get('engine/engineConf/changeStatus', {params});
  }

  saveEngineConf(data) {
    return this.http.post('engine/engineConf/saveEngineConf', data);
  }

  loadRule() {
    return this.http.get('engine/rule/getAllRule');
  }

  saveRule(rule: Rule) {
    return this.http.post('engine/rule/saveRule', rule);
  }

  editRule(rule: Rule) {
    return this.http.post('engine/rule/editRule', rule);
  }

  deleteRule(id: string) {
    const params = new HttpParams()
      .set('id', id + '');
    return this.http.get('engine/rule/deleteRule', {params});
  }

  changeRule(ids: string[], state: number) {
    const params = new HttpParams()
      .set('ids', JSON.stringify(ids))
      .set('state', state + '');
    return this.http.get('engine/rule/changeRule', {params});
  }

  loadPic(source: string[], status: string, page: string, size: string) {
    const params = new HttpParams()
      .set('source', source + '')
      .set('status', status)
      .set('page', page)
      .set('size', size);
    return this.http.get('engine/detail/getAllPic', {params});
  }

  getShowResult(pid: string) {
    const params = new HttpParams()
      .set('pid', pid + '');
    return this.http.get('engine/detail/getShowResult', {params});
  }

  getEngineStatus() {
    return this.http.get('engine/engineConf/getStatus');
  }

}

export class Rule {
  public id: string;
  public strategy: string;
  public portrange: string;
  public type: string;
  public target: string;
  public description: string;
  public priority: string;
  public createtime: string;
}

export class InterfaceData {
  callback_address: string;
  selected: string;
  service_ip: string;
  service_port: string;
  sync_address: string;
  async_address: string;
}
