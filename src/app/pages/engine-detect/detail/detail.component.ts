import {AfterViewChecked, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {EngineDeleteService} from "../../../@core/engine-delete.service";
import {NzMessageService} from "ng-zorro-antd";
import {WebsocketService} from "../../../@core/websocket.service";
import {Subscription} from "rxjs/Subscription";
import {Router} from '@angular/router';

@Component({
  selector: 'page-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailPage implements OnInit {
  title = 'detail';
  allChecked = true;
  indeterminate = false;
  data: any = [];
  dataResult: any = [];
  source: string[] = [];
  status: string = '0';
  pageIndex: string = '1';
  pageSize: string = '25';
  pageTotal: number;
  subscription: Subscription;
  subscription1: Subscription;
  logData = '';
  clickCount = 0;
  url = 'ws://192.168.140.136:8080/engine/log';
  /*url = 'ws://192.168.140.164:7080/engine/log';*/
  /*url = 'ws://localhost:8080/engine/log';*/
  @ViewChild('scroll')
  // 获取元素
  public myScrollContainer: ElementRef;
  /*ws = new WebSocket('ws://192.168.140.57:7080/engine/log');*/
  checkOptionsOne = [
    {label: '图片对比', value: 'usesim', checked: true},
    {label: '图片分类', value: 'useclass', checked: true},
    {label: 'Ocr', value: 'useocr', checked: true},
    {label: '人脸', value: 'useface', checked: true},
  ];

  constructor(private httpService: EngineDeleteService,
              private _message: NzMessageService,
              private webservice: WebsocketService,
              protected router: Router) {

  }

  ngOnInit() {
    this.loadAllPic();
    /*this.ws.onmessage = function (event) {
      console.log(event.data);
    };*/

  }


  scrollToBottom() {
    this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  }

  getLog() {
    if (this.clickCount === 0) {
      this.clickCount++;
      this.subscription = this.webservice.createWebsocket(this.url).subscribe(result => {
      });
      this.subscription1 = this.webservice.onMessage().subscribe(result => {
        this.logData = this.logData + result;
        this.scrollToBottom();
      });
      setTimeout(_ => {
        console.log('发送信息');
        this.webservice.sendMessage('tail -f //home//iie//tomcat7//logs//catalina.out');
        console.log('发送完成');
      }, 1000);
    }

  }

  sendMessage(message: string) {
    this.webservice.onClose();
    this.logData = '正在切换请稍等。。。。'

    setTimeout(_ => {
      this.subscription = this.webservice.createWebsocket(this.url).subscribe(result => {
      });
      this.subscription1 = this.webservice.onMessage().subscribe(result => {
        if (this.logData === '正在切换请稍等。。。。') {
          this.logData = '';
        }
        this.logData = this.logData + result;
        this.scrollToBottom();
      });
    }, 1000);
    setTimeout(_ => {
      console.log('发送信息');
      this.webservice.sendMessage('tail -f //home//iie//tomcat7-2//logs//catalina.out');
      console.log('发送完成');
    }, 2000);
  }

  clearMessage() {
    this.logData = '';
  }

  loadAllPic() {
    for (let i = 0; i < this.checkOptionsOne.length; i++) {
      if (this.checkOptionsOne[i]['checked'] === true) {
        this.source.push(this.checkOptionsOne[i]['value']);
      }
    }
    this.httpService.loadPic(this.source, this.status, this.pageIndex, this.pageSize).subscribe(result => {
      if (result['code'] !== '200') {
        this.router.navigate(['/login']);
      }
      this.data = result['data'];
      this.source = [];
      this.pageTotal = result['count'];
    });
  }

  pidEmitter(pid: string) {
    this.httpService.getShowResult(pid).subscribe(result => {
      this.dataResult = result['data'];
    });
  }

  indexEmitter(pageIndex: string) {
    this.pageIndex = pageIndex;
    this.loadAllPic();
  }

  reloadData() {
    this.loadAllPic();
  }

  updateAllChecked() {
    this.indeterminate = false;
    if (this.allChecked) {
      this.checkOptionsOne.forEach(item => item.checked = true);
    } else {
      this.checkOptionsOne.forEach(item => item.checked = false);
    }
  }

  updateSingleChecked() {
    if (this.checkOptionsOne.every(item => item.checked === false)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.checkOptionsOne.every(item => item.checked === true)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }
}
