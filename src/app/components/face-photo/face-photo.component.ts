import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-face-photo',
  templateUrl: './face-photo.component.html',
  styleUrls: ['./face-photo.component.scss']
})
export class FacePhotoComponent implements OnInit {

  public photos: Photo[] = [];
  modalPhoto: any = [];
  oldPageIndex = '1';
  pageSize: number = 8;

  constructor() {
  }

  @Input()
  faceDetailIndex = '1';
  @Input()
  faceDetailTotal = '8';
  @Input()
  faceDetail = [];
  @Output()
  indexEmitter = new EventEmitter<string>();

  ngOnInit() {
    for (let i = 0; i < 8; i++) {
      this.modalPhoto.push({
        url: 'http://static2.ivwen.com/users/17390602/b57a11740f5e40afb07353e70ecc5c4c.jpg'
      });
    }
  }

  jumpPage() {
    if (this.faceDetailIndex !== this.oldPageIndex) {
      this.indexEmitter.emit(this.faceDetailIndex + '');
      this.oldPageIndex = this.faceDetailIndex;
    }
  }


}

export class Photo {
  constructor(public name: string, public source: string, public author: string, public md5: string) {
  }
}
