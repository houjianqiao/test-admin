import {Component, OnInit} from '@angular/core';
import {EngineDeleteService, Rule} from "../../../@core/engine-delete.service";
import {NzMessageService} from "ng-zorro-antd";
import {Router} from "@angular/router";

@Component({
  selector: 'page-rule',
  templateUrl: './rule.component.html',
  styleUrls: ['./rule.component.scss']
})
export class RulePage implements OnInit {
  _allChecked = false;
  _indeterminate = false;
  _displayData = [];
  title = 'rule';
  data = [];
  isVisible = false;
  isEditVisible = false;
  addStragety = '允许';
  addPort: string;
  addType = '地址段访问';
  addTarget: string;
  addPriority = '1';
  addDesc: string;
  editStragety: string;
  editPort: string;
  editType: string;
  editTarget: string;
  editPriority: string;
  editDesc: string;
  editId: string;
  rule: Rule = new Rule();
  editRule: Rule = new Rule();
  state: number = 0;
  ids: string[] = [];

  constructor(private httpService: EngineDeleteService,
              private _message: NzMessageService,
              private router:Router) {
  }

  ngOnInit() {
    this.lodaAllRule();
  }


  lodaAllRule() {
    this.httpService.loadRule().subscribe(result => {
      if (result['code'] !== '200') {
        this.router.navigate(['/login']);
      }
      this.data = result['data'];
    });
  }

  _displayDataChange($event) {
    this._displayData = $event;
    this._refreshStatus();
  }

  _refreshStatus() {
    const allChecked = this._displayData.every(value => value.checked === true);
    const allUnChecked = this._displayData.every(value => !value.checked);
    this._allChecked = allChecked;
    this._indeterminate = (!allChecked) && (!allUnChecked);
  }

  _checkAll(value) {
    if (value) {
      this._displayData.forEach(data => {
        data.checked = true;
      });
    } else {
      this._displayData.forEach(data => {
        data.checked = false;
      });
    }
    this._refreshStatus();
  }

  showEditModel = (data: Rule) => {
    this.editId = data.id;
    this.editStragety = data.strategy;
    this.editDesc = data.description;
    this.editPort = data.portrange;
    this.editPriority = data.priority;
    this.editTarget = data.target;
    this.editType = data.type;
    this.isEditVisible = true;
  }

  showModal = () => {
    this.isVisible = true;
  }

  handleOk = (e) => {
    this.rule.strategy = this.addStragety;
    this.rule.portrange = this.addPort;
    this.rule.type = this.addType;
    this.rule.target = this.addTarget;
    this.rule.priority = this.addPriority;
    this.rule.description = this.addDesc;
    this.httpService.saveRule(this.rule).subscribe(result => {
      if (result['code'] === '200') {
        this._message.info('保存成功');
        this.isVisible = false;
        this.lodaAllRule();
      } else {
        this._message.info('保存失败');
      }
    });
  }


  handleCancel = (e) => {
    console.log(e);
    this.isVisible = false;
  }
  /*修改安全规则*/
  editOk = (e) => {
    this.editRule.id = this.editId;
    this.editRule.strategy = this.editStragety;
    this.editRule.portrange = this.editPort;
    this.editRule.type = this.editType;
    this.editRule.target = this.editTarget;
    this.editRule.priority = this.editPriority;
    this.editRule.description = this.editDesc;
    this.httpService.editRule(this.editRule).subscribe(result => {
      if (result['code'] === '200') {
        this._message.info('修改成功');
        this.isEditVisible = false;
        this.lodaAllRule();
      } else {
        this._message.info('修改失败');
      }
    });
  }
  editCancel = (e) => {
    console.log(e);
    this.isEditVisible = false;
  }

  deleteTable(id: string) {
    this.httpService.deleteRule(id).subscribe(result => {
      if (result['code'] === '200') {
        this._message.info('删除成功');
        this.lodaAllRule();
      } else {
        this._message.info('删除失败');
        this.lodaAllRule();
      }
    });
  }

  stopTable(id: string) {
    this.state = 0;
    this.ids.push(id);
    this.httpService.changeRule(this.ids, this.state).subscribe(result => {
      if (result['code'] === '200') {
        this._message.info('停止成功');
        this.lodaAllRule();
        this.ids = [];
      } else {
        this._message.info('停止失败');
        this.lodaAllRule();
        this.ids = [];
      }
    });
  }

  useTable(id: string) {
    this.state = 1;
    this.ids.push(id);
    this.httpService.changeRule(this.ids, this.state).subscribe(result => {
      if (result['code'] === '200') {
        this._message.info('生效成功');
        this.lodaAllRule();
        this.ids = [];
      } else {
        this._message.info('生效失败');
        this.lodaAllRule();
        this.ids = [];
      }
    });
  }

  stopAll() {
    this._displayData.forEach(data => {
      if (data.checked) {
        this.ids.push(data.id);
      }
    });
    this.state = 0;
    this.httpService.changeRule(this.ids, this.state).subscribe(result => {
      if (result['code'] === '200') {
        this._message.info('批量停止成功');
        this.lodaAllRule();
        this.ids = [];
      } else {
        this._message.info('批量停止失败');
        this.lodaAllRule();
        this.ids = [];
      }
    });
  }

  useAll() {
    this._displayData.forEach(data => {
      if (data.checked) {
        this.ids.push(data.id);
      }
    });
    this.state = 1;
    this.httpService.changeRule(this.ids, this.state).subscribe(result => {
      if (result['code'] === '200') {
        this._message.info('批量生效成功');
        this.lodaAllRule();
        this.ids = [];
      } else {
        this._message.info('批量生效失败');
        this.lodaAllRule();
        this.ids = [];
      }
    });
  }


}
