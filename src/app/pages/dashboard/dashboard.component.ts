import {filter} from 'rxjs/operators/filter';
// tslint:disable
import {Component} from '@angular/core';
import {NzMessageService, NzModalService, UploadFile} from 'ng-zorro-antd';
import {HttpClient, HttpRequest, HttpResponse} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';
import {Router} from "@angular/router";
import {el} from "@angular/platform-browser/testing/src/browser_util";


@Component({
  selector: 'page-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardPage {
  title = 'dashboard';
  uploading = false;
  fileList: UploadFile[] = [];
  isNull = true;
  jsonObject: Object;
  imageUrl = [];
  haveImage = false;
  haveData = false;
  checkString = '';
  data = [];
  res: string[] = [];
  imageNum = 0;
  imageInfos: ImageInfo[] = [];
  allChecked = true;
  indeterminate = false;
  checkOption = [
    {label: '图片比对', value: '图片比对', checked: true},
    {label: '图片分类', value: '图片分类',checked:true},
    {label: 'Ocr', value: 'Ocr',checked:true},
    {label: '人脸', value: '人脸',checked:true},
  ];


  constructor(private http: HttpClient,
              private msg: NzMessageService,
              private sanitizer: DomSanitizer,
              private router: Router,
              private confirmServ: NzModalService) {
  }

  updateAllChecked() {
    this.indeterminate = false;
    if (this.allChecked) {
      this.checkOption.forEach(item => item.checked = true);
    } else {
      this.checkOption.forEach(item => item.checked = false);
    }
  }

  updateSingleChecked() {
    if (this.checkOption.every(item => item.checked === false)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.checkOption.every(item => item.checked === true)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }
  info() {
    this.confirmServ.info({
      title: '引擎出现异常，请检查引擎是否正常运行',
    });
  }

  beforeUpload = (file: UploadFile): boolean => {
    const isImage = (file.type === 'image/png' || file.type === 'image/jpeg');
    if (!isImage) {
      this.msg.error('只能上传图片文件!');
    } else {
      if (this.imageNum >= 6) {
        this.msg.error('最多只能上传6张图片！');
      } else {
        this.fileList.push(file);
        this.imageNum++;
        // 必须 bypassSecurityTrustUrl 转换一下 url ，要不能angular会报，说url不安全错误。
        this.imageInfos.push(new ImageInfo(this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file)), ' ', ' '));
      }
    }
    this.haveImage = true;

    return false;
  }

  handleUpload() {
    let checkedArray = [];
    this.checkString = '';
    for (let i = 0; i < this.checkOption.length; i++) {
      if (this.checkOption[i]['checked'] === true) {
        checkedArray.push(1);
      } else {
        checkedArray.push(0);
      }
    }
    for (let i = 0; i < checkedArray.length; i++) {
      this.checkString = this.checkString + checkedArray[i];
    }
    if (checkedArray[0] === 1 || checkedArray[1] === 1) {
      this.checkString = "1" + this.checkString.substr(2, 4)
      console.log(this.checkString);
    } else {
      this.checkString = "0" + this.checkString.substr(2, 4)
      console.log(this.checkString);
    }
    if (!checkedArray.includes(0)) {
      this.checkString = '1' + this.checkString;
      console.log('s'+this.checkString);
    } else {
      this.checkString = '0' + this.checkString;
    }
    console.log(checkedArray);
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append('files[]', file);
    });
    for (let i = 0; i < checkedArray.length; i++) {
      formData.append('checkString', this.checkString);
    }
    this.uploading = true;
    // You can use any AJAX library you like
    const req = new HttpRequest('POST', 'engine/show/showUpload', formData, {
      // reportProgress: true
    });
    this.http.request(req).pipe(filter(e => e instanceof HttpResponse)).subscribe(result => {
      this.isNull = false;
      this.uploading = false;
      var body = result['body'];
      if (body['code'] !== '200') {
        this.router.navigate(['/login']);
      }
      this.jsonObject = JSON.parse(body['data']);
      var infos = body['data'];
      if (infos===''||infos==='null'){
        this.info();
        this.isNull=true;
      }else {
        if (this.jsonObject !== undefined) {
          for (let i = 0; i < this.jsonObject['results'].length; i++) {
            if (this.jsonObject['results'][i] !== undefined) {
              console.log(this.jsonObject)
              if (this.jsonObject['results'][i]['confirm'] === true) {
                console.log('11' + this.jsonObject['results'][i]['confirm'])
                /*this.imageInfos[i]['res'] = '研判信息：第' + (i + 1) + '张图片疑似有害';*/
                this.imageInfos[i].res = '研判信息：第' + (i + 1) + '张图片疑似有害';
              } else {
                /*this.imageInfos[i]['returnData'] = '研判信息：第' + (i + 1) + '张图片疑似无害';*/
                this.imageInfos[i].res = '研判信息：第' + (i + 1) + '张图片疑似无害';
              }
            }
          }
        }
        this.msg.success('upload successfully.');
      }

      this.haveData = true;
    }, (err) => {
      this.isNull = true;
      this.uploading = false;
      this.msg.error('upload failed.');
    });
  }

  clearAll() {
    this.haveImage = false;
    this.haveData = false;
    this.fileList = [];
    this.imageUrl = [];
    this.isNull = true;
    this.jsonObject = '';
    this.data = [];
    this.imageNum = 0;
    this.imageInfos = [];
    this.checkString = '';
  }
}

export class ImageInfo {
  constructor(public imageurl: any,
              public returnUrl: string,
              public res: string) {
  }

}
