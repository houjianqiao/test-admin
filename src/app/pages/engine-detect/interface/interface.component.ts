import {Component, OnInit} from '@angular/core';
import {NzMessageService} from "ng-zorro-antd";
import {EngineDeleteService, InterfaceData} from "../../../@core/engine-delete.service";
import {Router} from "@angular/router";

@Component({
  selector: 'page-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.scss']
})
export class InterfacePage implements OnInit {
  callback_address = '';
  selected: string = '2';
  service_ip = '';
  service_port = '';
  sync_address = '';
  async_address = '';
  engineConf: any = [];
  data = new InterfaceData();

  constructor(private httpService: EngineDeleteService,
              private _message: NzMessageService,
              protected router: Router) {
  }

  ngOnInit() {
    this.httpLoad();
  }

  loadOne = (value) => {
    this.data.service_port = this.service_port;
    this.data.service_ip = this.service_ip;
    this.data.async_address = this.async_address;
    this.data.sync_address = this.sync_address;
    this.data.selected = this.selected;
    this.data.callback_address = this.callback_address;
    this.httpService.saveEngineConf(this.data).subscribe(result => {
      if (result['code'] === '200') {
        this._message.info('保存成功');
        this.httpLoad();
      } else {
        this._message.info('保存失败');
      }
    });
  }

  httpLoad() {
    this.httpService.loadInterfaceData().subscribe(result => {
      if (result['code'] !== '200') {
        this.router.navigate(['/login']);
      }
      this.engineConf = result['data'];
      for (let i = 0; i < this.engineConf.length; i++) {
        if (this.engineConf[i]['config'] === 'service_ip') {
          this.service_ip = this.engineConf[i]['value'];
        }
        if (this.engineConf[i]['config'] === 'service_port') {
          this.service_port = this.engineConf[i]['value'];
        }
        if (this.engineConf[i]['config'] === 'sync_address') {
          this.sync_address = this.engineConf[i]['value'];
        }
        if (this.engineConf[i]['config'] === 'async_address') {
          this.async_address = this.engineConf[i]['value'];
        }
        if (this.engineConf[i]['config'] === 'callback_address') {
          this.callback_address = this.engineConf[i]['value'];
        }
        if (this.engineConf[i]['config'] === 'con_number') {
          this.selected = this.engineConf[i]['value'];
        }
      }
    });
  }

  log(event: any) {
  }

  _console(event: any) {
  }
}
