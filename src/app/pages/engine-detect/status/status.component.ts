import {Component, OnInit} from '@angular/core';
import {EngineDeleteService} from "../../../@core/engine-delete.service";
import {NzMessageService} from "ng-zorro-antd";
import {Router} from '@angular/router';
import {WebsocketService} from "../../../@core/websocket.service";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'page-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusPage implements OnInit {
  openstatus: string;
  engineConf: any = [];
  status: string;
  service_ip: string;
  service_port: string;
  async_address: string;
  async_count: string;
  sync_address: string;
  sync_count: string;
  changStatus = '';
  res: any;
  option: any;
  _formatTwo = percent => this.openstatus;
  data = [];
  isStatu = true;


  constructor(private engineService: EngineDeleteService,
              private _message: NzMessageService,
              protected router: Router,
              private webService: WebsocketService) {
  }

  ngOnInit() {
    this.httpLoad();


  }

  httpLoad() {
    this.engineService.loadEngineConf().subscribe(result => {
      if (result['code'] !== '200') {
        this.router.navigate(['/login']);
      }
      this.engineConf = result['data'];
      this.res = JSON.parse(result['result']);
      for (let i = 0; i < this.engineConf.length; i++) {
        if (this.engineConf[i]['config'] === 'status') {
          this.status = this.engineConf[i]['value'];
          if (this.status === '0') {
            this.openstatus = '启动';
          } else if (this.status === '1') {
            this.openstatus = '停止';
          } else if (this.status === '2') {
            this.openstatus = '正在停止';
          } else if (this.status === '3') {
            this.openstatus = '正在启动';
          }
        }
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
        this.async_count = result['checkCount'];
        this.sync_count = result['reqCount'];
      }
      this.data = [{config: '服务IP:', value: this.service_ip},
        {config: '服务端口:', value: this.service_port},
        {config: '同步地址:', value: this.sync_address},
        {config: '异步地址:', value: this.async_address},
        {config: '近1小时请求量:', value: this.sync_count},
        {config: '近1小时检测量:', value: this.async_count},
      ];

      this.option = {
        title: {
          text: '折线图堆叠'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['监测总量', '同步请求量', '异步请求量']
        },
        grid: {
          left: '3%',
          right: '10%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          x: '90%',
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.res['checktime'],
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '监测总量',
            type: 'line',
            data: this.res['checkcount']
          },
          {
            name: '同步请求量',
            type: 'line',
            data: this.res['synccount']
          },
          {
            name: '异步请求量',
            type: 'line',
            data: this.res['asynccount']
          },
        ]
      };
    });
  }


  startEngine(event: any) {
    if (this.status === '3') {
      this._message.info('引擎已经启动');
    } else {
      this.status = '3';
      this.engineService.changeStatus(this.status).subscribe(result => {
        if (result['code'] === '200') {
          this.openstatus = '正在启动';
        }
      });
    }
    this.getStartStatus();
  }

  endEngine(event: any) {
    if (this.status === '2') {
      this._message.info('引擎已经停止');
    } else {
      this.status = '2';
      this.engineService.changeStatus(this.status).subscribe(result => {
        if (result['code'] === '200') {
          this.openstatus = '正在停止';
        }
      });
    }
    this.getCloseStatus();
  }

  getStartStatus() {
    this.changStatus = '';
    setTimeout(_ => {
      this.engineService.getEngineStatus().subscribe(result => {
        this.changStatus = result['status'];
        if (this.changStatus === '0') {
          this.status = this.changStatus;
          this.openstatus = '启动';
        } else {
          this.getStartStatus();
        }
      });
    }, 3000);

  }

  getCloseStatus() {
    this.changStatus = '';
    setTimeout(_ => {
      this.engineService.getEngineStatus().subscribe(result => {
        this.changStatus = result['status'];
        if (this.changStatus === '1') {
          this.status = this.changStatus;
          this.openstatus  = '停止';
        } else {
          console.log('kaishi');
          this.getCloseStatus();
        }
      });
    }, 3000);

  }

  refreshEngine(event: any) {
    this.httpLoad();
  }

}
