import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {KeywordService} from '../../@core/data/keyword.service';
import {Keyword} from '../../@core/data/Keyword'
import {NzMessageService, NzModalService} from 'ng-zorro-antd';

@Component({
  selector: 'dynamic-keyword',
  styleUrls: ['./keyword.component.scss'],
  templateUrl: './keyword.component.html',
  providers: [KeywordService]
})

export class KeywordComponent implements OnInit, OnChanges {


  constructor(private keywordService: KeywordService,
              private confirmServ: NzModalService,
              private message: NzMessageService) {
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  @Input() tableData = [];
  @Input() secondTitle = '';
  @Output()
  secondTitltEmit = new EventEmitter<String>();
  @Output()
  tableDataEmit = new EventEmitter<any>();

  ngOnChanges() {
    console.log('改变的' + this.tableData);
  }

  ruleCancel() {
    this.message.info('click cancel');
  }

  ruleSave() {
    console.log(this.tableData);
    this.secondTitltEmit.emit(this.secondTitle);
    this.tableDataEmit.emit(this.tableData);
  }

  ruleDel(id, index): void {
    console.log('需要删除的id是:' + id);
    this.tableData.splice(index, 1);
  }

  ruleAdd(index): void {
    if (this.tableData[index].keyword.length >= 4) {
      this.confirmServ.error({
        title: '添加失败',
        content: '最多添加4个'
      });
    } else {
      this.tableData[index].keyword.push('');
    }
  }

  tempRuleAdd(): void {
    this.tableData.push({
      keyword: [''],
      white: ''
    });
  }

  keyDel(index, keywordIndex): void {
    if (this.tableData[index].keyword.length <= 1) {
      this.confirmServ.error({
        title: '删除失败',
        content: '至少保留1个'
      });
    } else {
      this.tableData[index].keyword.splice(keywordIndex, 1);
    }
  }

  ngOnInit() {
  }
}

