import {Component, DoCheck, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-photo-show',
  templateUrl: './photo-show.component.html',
  styleUrls: ['./photo-show.component.scss']
})
export class PhotoShowComponent implements OnInit, OnChanges {

  public photos: Photo[] = [];
  isVisible = false;
  modalPhoto: any = [];
  pageIndex: number = 1;
  oldPageIndex: number = 1;
  pageSize: number = 25;
  @Input()
  pageTotal: number = 100;
  @Input() data: any = [];
  @Input() dataResult: any = [];

  @Output()
  pidEmitter = new EventEmitter<string>();
  @Output()
  indexEmitter = new EventEmitter<string>();

  constructor() {
  }


  showModal = (photo: Photo) => {
    this.modalPhoto = photo;
    console.log('模态：' + this.modalPhoto);
    this.pidEmitter.emit(photo['pid']);
    this.isVisible = true;
  }

  handleOk = (e) => {
    console.log('点击了确定');
    this.isVisible = false;
  }

  handleCancel = (e) => {
    this.isVisible = false;
  }


  ngOnInit() {
  }

  ngOnChanges() {
  }

  jumpPage() {
    if (this.pageIndex !== this.oldPageIndex) {
      this.indexEmitter.emit(this.pageIndex + '');
      this.oldPageIndex = this.pageIndex;
    }
  }


}

export class Photo {
  constructor(public name: string, public source: string, public author: string, public md5: string) {
  }
}
