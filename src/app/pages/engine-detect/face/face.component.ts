import {Component, OnInit} from '@angular/core';
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import {Photo} from '../../../components/photo-show/photo-show.component';
import {Page, Sample, SampleService} from "../../../@core/sample.service";
import {NzMessageService, UploadFile} from 'ng-zorro-antd';
import {DomSanitizer} from "@angular/platform-browser";
import {HttpClient, HttpRequest, HttpResponse} from "@angular/common/http";
import {filter} from 'rxjs/operators/filter';
import {FaceDetail, FaceService} from "../../../@core/face.service";
import {Router} from "@angular/router";

const states = [];

const options = [];

@Component({
  selector: 'page-face',
  templateUrl: './face.component.html',
  styleUrls: ['./face.component.scss']
})
export class FacePage implements OnInit {
  public photos = [];
  // 用于图片的展示，包含图片基本信息和是否被选择
  public showPhotos = [];
  // 所有被选择的图片组成的数组
  public checkedPhotos = [];
  public keyword: any;
  // 按钮的大小
  size = 'large;';
  editshow = true;
  // 输入的标签值
  lableValue: string;
  // 上传文件模态框是否显示
  isUploadVisible = false;
  // 修改单张阈值模态框是否显示
  isEditModalVisible = false;
  // 修改多张阈值模态框是否显示
  isMulEditModalVisible = false;
  // 初始阈值
  siteName = '0.845';
  addState = '';
  uploadState = '2';
  uploadLabel = '';
  uploadName = '0.845';
  ids = [];
  // 标记类型
  _options = options;
  _value: any[] = null;
  // 复选框全选
  _allChecked = false;
  // 是否允许单选
  indeterminate = true;
  // 点击某一图片时，对应的该图片信息
  photoInfo: Photo[] = [];
  nodes = [];
  stateSearch = [];
  page = new Page();
  sample = new Sample();
  typeValue = [];
  pageIndex = 1;
  oldPageIndex = 1;
  pageTotal = '100';
  pageSize = 24;
  typeSearch = [];

  // 对应具体某张图片查询出来的图片集
  detail = new FaceDetail();
  faceDetail = [];
  faceNmae: string;
  faceId: string;
  faceDetailTotal = '8';
  faceDetailIndex = '1';

  fileList: UploadFile[] = [];
  imageUrl = [];
  haveImage = false;
  isNull = true;
  uploading = false;
  faceName = '';
  allSelectChecked = true;
  indeterminateState = false;
  checkOptionsOne = [
    {label: '正常', value: '1', checked: true},
    {label: '正在添加', value: '2', checked: true},
    {label: '未启用', value: '0', checked: true},
  ];


  constructor(private httpService: FaceService,
              private _message: NzMessageService,
              private sanitizer: DomSanitizer,
              private http: HttpClient,
              private router: Router) {
  }

  ngOnInit() {
    this.page.typeSearch = this.typeSearch;
    this.page.keyword = this.keyword;
    this.page.pageIndex = this.pageIndex;
    this.page.pageSize = this.pageSize;
    this.loadFaceType();
    this.loadFacePhoto();
    this.loadFaceOption();
    this.detail.pageIndex = 1;
    this.detail.pageSize = 8;

  }

  loadFaceType() {
    this.httpService.loadFaceType().subscribe(result => {
      this.nodes = result['result'];
    });
  }

  loadFaceOption() {
    this.httpService.loadFaceOption().subscribe(result => {
      this._options = result['result'];
    });
  }

  loadFaceDetail() {
    this.detail.faceName = this.faceName;
    this.detail.faceId = this.faceId;
    this.httpService.loadFaceDetail(this.detail).subscribe(result => {
      this.faceDetail = result['data'];
      this.faceDetailTotal = result['count'];
    });

  }

  loadFacePhoto() {
    this.httpService.loadFacePhoto(this.page).subscribe(result => {
      if (result['code'] !== '200') {
        this.router.navigate(['/login']);
      }
      this.photos = result['data'];
      this.pageTotal = result['count'];

      for (let i = 0; i < this.photos.length; i++) {
        this.photos[i]['checked'] = false;
      }
    });
  }

  saveFace(sample) {
    this.httpService.saveFace(sample).subscribe(result => {
      if (result['code'] === '200') {
        this._message.info('保存成功');
        this.sample = new Sample();
        this.loadFacePhoto();
      }
    });
  }

  formatter = (result: string) => result.toUpperCase();

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term === '' ? []
        : states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))

  onSearch(event: any) {
    this.stateSearch = [];
    this.checkOptionsOne.forEach(item => {
      if (item.checked === true) {
        this.stateSearch.push(item.value);
      }
    });
    if (typeof(this.keyword) !== 'undefined') {
      this.page.typeSearch = this.typeSearch;
      this.page.keyword = this.keyword;
      this.page.pageIndex = 1;
      this.page.stateSearch = this.stateSearch;
      this.page.pageSize = this.pageSize;
      this.loadFacePhoto();
    } else {
      this._message.info('请输入关键词');
    }
  }

  updateAllSelectChecked() {
    this.indeterminateState = true;
    if (this.allSelectChecked) {
      this.checkOptionsOne.forEach(item => item.checked = true);
    } else {
      this.checkOptionsOne.forEach(item => item.checked = false);
    }
  }

  updateSingleSelectChecked() {
    if (this.checkOptionsOne.every(item => item.checked === false)) {
      this.allSelectChecked = false;
      this.indeterminate = false;
    } else if (this.checkOptionsOne.every(item => item.checked === true)) {
      this.allSelectChecked = true;
      this.indeterminateState = false;
    } else {
      this.indeterminateState = true;
    }
  }

  handleChange(info): void {
    const fileList = info.fileList;
    // read from response and show file link
    if (info.file.response) {
      info.file.url = info.file.response.url;
    }
    // filter successfully uploaded files according to response from server
    this.fileList = fileList.filter(item => {
      if (item.response) {
        return item.response.status === 'success';
      }
      return true;
    });
  }

  typeSearchEmit(event) {
    this.typeSearch = event;
    this.page.typeSearch = event;
    this.page.keyword = this.keyword;
    this.page.pageIndex = 1;
    this.page.pageSize = this.pageSize;
    /*this.loadFacePhoto();*/
  }

  newEventEmit(event) {
    this.httpService.editFaceType(event).subscribe(result => {
      if (result['code'] !== '200') {
        this._message.info('修改成功');
        this.loadFaceType();
        this.loadFaceOption();
      }
      if (result['code'] !== '201') {
        this._message.info('删除成功');
        this.loadFaceType();
        this.loadFaceOption();
      }
    });

  }
  firstEventEmit(event) {
    this.httpService.savefirstEvent(event).subscribe(result => {
      if (result['code'] === '200') {
        this._message.info('保存成功');
        this.loadFaceOption();
        this.loadFaceType();
      }

    });
  }

  jumpPage() {
    this.page.typeSearch = this.typeSearch;
    this.page.keyword = this.keyword;
    this.page.pageIndex = this.pageIndex;
    this.page.pageSize = this.pageSize;
    if (this.pageIndex !== this.oldPageIndex) {
      this.loadFacePhoto();
      this.oldPageIndex = this.pageIndex;
    }
  }

  changState() {
    this.stateSearch = [];
    this.checkOptionsOne.forEach(item => {
      if (item.checked === true) {
        this.stateSearch.push(item.value);
      }
    });
    this.page.typeSearch = this.typeSearch;
    this.page.keyword = this.keyword;
    this.page.stateSearch = this.stateSearch;
    this.page.pageIndex = 1;
    this.page.pageSize = this.pageSize;
    this.loadFacePhoto();


  }

  indexEmitter(pageIndex: string) {
    this.faceDetailIndex = pageIndex;
    this.detail.pageIndex = Number(this.faceDetailIndex);
    this.loadFaceDetail();
  }

  showEditModal = (photo) => {
    this.photos.forEach(item => {
      if (item.checked === true) {
        this.checkedPhotos.push(item.name);
      }
    });
    if (this.checkedPhotos.length <= 1) {
      if (photo.typename1 === 'null' || photo.typename1 === '') {
        this._value = [];
      } else if (photo.typename2 === 'null' || photo.typename2 === '') {
        this._value = [{
          value: photo.typeid1 + '',
          label: photo.typename1
        }];
      } else {
        this._value = [{
          value: photo.typeid1 + '',
          label: photo.typename1
        }, {
          value: photo.typeid2 + '',
          label: photo.typename2
        }];
      }
      this.faceName = photo.name;
      this.faceId = photo.faceid;
      this.detail.pageIndex = 1;
      this.faceDetailIndex = '1';
      this.detail.id = photo.id;
      this.loadFaceDetail();

      this.isEditModalVisible = true;
      if (photo) {
        this.addState = photo.state + '';
        this.lableValue = photo.label;
        this.siteName = photo.threshold;
        this.photoInfo['name'] = photo.name;
        this.photoInfo['id'] = photo.id;
        this.photoInfo['fileurl'] = photo.fileurl;
        this.photoInfo['md5'] = photo.md5;
        this.photoInfo['updatetime'] = photo.updatetime;
        this.photoInfo['updateuser'] = photo.updateuser;
      }
    }
    else {
      this.isMulEditModalVisible = true;
      this._value = null;
      this.addState = '0';
      this.siteName = '0.845';
    }

    this.checkedPhotos = [];
  }

  editOk = (e, photoinfo) => {
    this.sample.state = Number(this.addState);
    this.sample.label = this.lableValue;
    this.sample.ids = [];
    this.sample.ids.push(photoinfo['id']);
    this.sample.typeid1 = this.typeValue[0];
    this.sample.typeid2 = this.typeValue[1];
    this.sample.threshold = Number(this.siteName);
    this.saveFace(this.sample);
    this.isEditModalVisible = false;
  }

  editCancel = (e) => {
    this.addState = null;
    this.isEditModalVisible = false;
  }
  editOk1 = (e) => {
    this.sample.ids = [];
    this.photos.forEach(item => {
      if (item.checked === true) {
        this.sample.ids.push(item.id);
      }
    });
    this.sample.state = Number(this.addState);
    this.sample.label = this.lableValue;
    this.sample.typeid1 = this.typeValue[0];
    this.sample.typeid2 = this.typeValue[1];
    this.sample.threshold = Number(this.siteName);
    this.saveFace(this.sample);
    this.isMulEditModalVisible = false;
  }

  editCancel1 = (e) => {
    this.isMulEditModalVisible = false;
  }

  showUploadModal = () => {
    this.isUploadVisible = true;
    this._value = null;
    this.clearAll();
  }


  handleUploadCancel = (e) => {
    this.isUploadVisible = false;
  }

  type_console(value) {
    this.typeValue = value;
  }

  updateAllChecked() {
    this.indeterminate = false;
    if (this._allChecked) {
      this.photos.forEach(item => item.checked = true);
    } else {
      this.photos.forEach(item => item.checked = false);
    }
    this.editshow = true;
    this.photos.forEach(item => {
      if (item.checked === true) {
        this.editshow = false;
      }
    });
  }

  updateSingleChecked() {
    if (this.photos.every(item => item.checked === false)) {
      this._allChecked = false;
      this.indeterminate = false;
    } else if (this.photos.every(item => item.checked === true)) {
      this._allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
    this.editshow = true;
    this.photos.forEach(item => {
      if (item.checked === true) {
        this.editshow = false;
      }
    });

  }

  beforeUpload = (file: UploadFile): boolean => {
    this.fileList.push(file);
    // 必须 bypassSecurityTrustUrl 转换一下 url ，要不能angular会报，说url不安全错误。
    this.imageUrl.push(this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file)));
    this.haveImage = true;
    return false;
  }

  handleUploadOk(event: any) {
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append('image', file);
      formData.append('uploadState', this.uploadState);
      formData.append('uploadLabel', this.uploadLabel);
      formData.append('typeid1', this.typeValue[0]);
      formData.append('typeid2', this.typeValue[1]);
      formData.append('uploadName', this.uploadName);
      formData.append('faceName', this.faceName);
    });
    this.uploading = true;
    // You can use any AJAX library you like
    const req = new HttpRequest('POST', 'engine/face/faceUpload', formData, {
      // reportProgress: true
    });
    this.http.request(req).pipe(filter(e => e instanceof HttpResponse)).subscribe((event: any) => {
      this.isNull = false;
      this.uploading = false;
      console.log('fnahuo' + event['code']);
      this._message.info('上传成功');
      this.loadFacePhoto();
      this.faceName = '';
      this.isUploadVisible = false;
    }, (err) => {
      this.isNull = true;
      this.uploading = false;
      this._message.error('上传失败');
      this.isUploadVisible = false;
    });
    this.uploadName = '0.845';
    this.faceName = '';
    this.uploadLabel = '';
    this.uploadState = '2';
  }

  clearAll() {
    this.haveImage = false;
    this.fileList = [];
    this.imageUrl = [];
  }
}

