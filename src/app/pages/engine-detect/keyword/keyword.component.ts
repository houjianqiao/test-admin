import {Component, OnInit} from '@angular/core';
import {FeatureManagerService} from "../../../@core/feature-manager.service";
import {NzMessageService} from 'ng-zorro-antd';
import {Router} from "@angular/router";

@Component({
  selector: 'page-keyword',
  templateUrl: './keyword.component.html',
  styleUrls: ['./keyword.component.scss']
})
export class KeywordPage implements OnInit {
  navigationOptions = [];
  title;
  selectedTitle = '第一个主题';
  tableData = [];
  secondTitle = '';
  param: Param = new Param();
  isOpen = false;

  constructor(private httpService: FeatureManagerService,
              private _message: NzMessageService,
              private router: Router) {
  }

  ngOnInit() {
    this.loadkeywordType();
  }

  loadkeywordType() {
    this.httpService.loadKeywordType().subscribe(result => {
      this.navigationOptions = result['result'];
      for (let i = 0; i < this.navigationOptions.length; i++) {
        if (this.navigationOptions[i].index === 0) {
          this.title = this.navigationOptions[i].title;
          this.secondTitle = this.navigationOptions[i].subtitles[0];
        }
      }
      this.getFirstKeyword();
      console.log('sa' + this.title + this.secondTitle);
    });
  }

  clickItem(thirdTitle, secondTitle) {
    console.log('点击标题！');
    this.title = [
      {'firstTitle': this.selectedTitle},
      {'secondTitle': secondTitle},
      {'thirdTitle': thirdTitle},
    ];

  }

  getFirstKeyword() {
    console.log('sasa' + this.title + this.secondTitle);
    this.httpService.getKeyword(this.title, this.secondTitle).subscribe(result => {
      if (result['code'] !== '200') {
        this.router.navigate(['/login']);
      }
      const data = JSON.parse(result['data']);
      this.tableData = data;
    });
  }

  getKeyword(secondTitle: string, title: string) {
    this.httpService.getKeyword(title, secondTitle).subscribe(result => {
      if (result['code'] !== '200') {
        this.router.navigate(['/login']);
      }
      const data = JSON.parse(result['data']);
      this.tableData = data;
    });
  }

  editIcon(e, secondTitle: string, title: string) {
    e.stopPropagation();
    this.secondTitle = secondTitle;
    this.title = title;
    this.getKeyword(secondTitle, title);

    /*this.httpService.getKeyword(title, secondTitle).subscribe(result => {
      console.log(result['data']);
      this.tableData = result['data'];
    });*/
    console.log(secondTitle);
  }

  secondTitltEmit(secondTitle: string) {
    this.secondTitle = secondTitle;
  }

  tableDataEmit(tabledata: any) {
    this.tableData = tabledata;
    /* this.param.secondTitle = this.secondTitle;
     this.param.title = this.title;
     this.param.tableData = tabledata;*/
    this.httpService.saveKeyword(this.title, this.secondTitle, this.tableData).subscribe(result => {
      if (result['code'] !== '200') {
        this.router.navigate(['/login']);
      }
      if (result['code'] === '200') {
        this._message.info('保存成功');
        this.httpService.loadKeywordType().subscribe(results => {
          this.navigationOptions = results['result'];
        });
        this.getKeyword(this.secondTitle, this.title);
      }
    });
  }

  addIcon(e, title: string) {
    e.stopPropagation();
    this.title = title;
    this.secondTitle = '';
    this.tableData = [{white: '', keyword: ['']}];
  }

  deleteIcon(e, secondTitle: string, title: string) {
    e.stopPropagation();
    this.secondTitle = secondTitle;
    this.title = title;
    this.httpService.deleteKeywordType(title, secondTitle).subscribe(result => {
      if (result['code'] === '200') {
        this._message.info('删除成功');
        this.loadkeywordType();
        this.tableData = [{white: '', keyword: ['']}];
      }
    });
  }

}

export class Param {
  public title: string;
  public secondTitle: string;
  public tableData: string[];
}
