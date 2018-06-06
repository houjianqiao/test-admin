import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-face-tree',
  templateUrl: './face-tree.component.html',
  styleUrls: ['./face-tree.component.css']
})
export class FaceTreeComponent {

  isCollapsed = false;
  // 复选框全选
  _allChecked = false;
  // 是否允许单选
  indeterminate = true;
  tempChildNum = 0;
  tempParentNum = 0;
  eventName = '';
  oldName = '';
  editCount = 0;
  editEvent = new EventObj();

  firstEvent = '';
  pName = '';

  @Input()
  nodes = [];
  @Output() typeSearchEmit = new EventEmitter<any>();
  @Output() newEventEmit = new EventEmitter<EventObj>();
  @Output() firstEventEmit = new EventEmitter<string>();

  constructor(private _message: NzMessageService) {
    let tempNode;
    for (let i = 0; i < this.nodes.length; i++) {
      // 一级标题为叶节点，初始未被选择
      if (this.nodes[i]['children'] === undefined) {
        this.nodes[i]['indeterminateParent'] = true;
        this.nodes[i]['checked'] = true;
      }
      // 一级标题为父节点，父节点和叶节点初始均未被选择
      else {
        this.nodes[i]['indeterminateParent'] = true;
        this.nodes[i]['checked'] = true;
        tempNode = this.nodes[i]['children'];
        for (let j = 0; j < this.nodes[i]['children'].length; j++) {
          tempNode[j]['checked'] = true;
        }
      }
    }
  }

  updateAllChecked() {
    this.indeterminate = false;
    let tempNode;
    // 全选
    if (this._allChecked) {
      for (let i = 0; i < this.nodes.length; i++) {
        // 父节点为叶节点
        if (this.nodes[i]['children'] === undefined) {
          this.nodes[i]['indeterminateParent'] = false;
          this.nodes[i]['checked'] = true;
        }
        // 父节点有孩子节点
        else {
          this.nodes[i]['indeterminateParent'] = false;
          this.nodes[i]['checked'] = true;
          tempNode = this.nodes[i]['children'];
          for (let j = 0; j < this.nodes[i]['children'].length; j++) {
            tempNode[j]['checked'] = true;
          }
        }
      }
    }
    // 全不选
    else {
      for (let i = 0; i < this.nodes.length; i++) {
        // 父节点为叶节点
        if (this.nodes[i]['children'] === undefined) {
          this.nodes[i]['checked'] = false;
          this.nodes[i]['indeterminateParent'] = false;
        }
        // 父节点有孩子节点
        else {
          this.nodes[i]['checked'] = false;
          this.nodes[i]['indeterminateParent'] = false;
          tempNode = this.nodes[i]['children'];
          for (let j = 0; j < this.nodes[i]['children'].length; j++) {
            tempNode[j]['checked'] = false;
          }
        }
      }
    }
    this.activeNodes();
  }

  updateParentChecked(node) {
    node['indeterminateParent'] = false;
    // 如果父节点有孩子节点，需要先把所有孩子节点的选中状态，与父节点一致，再改变已选择父节点的个数
    if (node.children === undefined) {
      if (node['checked'] === true) {
        this.tempParentNum++;
      }
      else {
        node['checked'] = false;
        this.tempParentNum--;
      }
    }
    else if (node.children !== undefined) {
      for (let j = 0; j < node.children.length; j++) {
        node.children[j]['checked'] = node['checked'];
      }
      if (node['checked'] === true) {
        this.tempParentNum++;
      }
      else {
        this.tempParentNum--;
      }
    }
    console.log(this.tempParentNum);
    // 每一次点击父节点和叶节点都需要判断是否全选，但是点击父节点不用判断父节点是全选、全不选还是未全选
    if (this.tempParentNum === this.nodes.length) {
      this._allChecked = true;
      this.indeterminate = false;
    }
    else if (this.tempParentNum === 0) {
      this._allChecked = false;
      this.indeterminate = false;
    }
    else {
      this._allChecked = false;
      this.indeterminate = true;
    }
    this.activeNodes();
  }

  updateChildChecked(children, node) {
    children['checked'] != children['checked'];
    this.tempChildNum = 0;
    // 统计被选叶子节点的个数
    for (let j = 0; j < node.children.length; j++) {
      if (node.children[j]['checked'] === true) {
        this.tempChildNum++;
      }
    }
    // 叶子节点全选
    if (this.tempChildNum === node.children.length) {
      node['indeterminateParent'] = false;
      node['checked'] = true;
      this.tempParentNum++;
    }
    // 叶子节点全未选
    else if (this.tempChildNum === 0) {
      node['indeterminateParent'] = false;
      node['checked'] = false;
      this.tempParentNum--;
    }
    // 原本叶子节点全选，点击其中一个取消，父节点要变成未全选状态，个数减一
    else if (this.tempChildNum === node.children.length - 1 && children['checked'] === false) {
      this.tempParentNum--;
      node['indeterminateParent'] = true;
      node['checked'] = false;
    }
    // 其他情况：点击任何一个叶子节点，无论是勾选还是取消，且父节点状态为未全选
    else {
      node['indeterminateParent'] = true;
      node['checked'] = false;
    }
    console.log(this.tempParentNum);
    if (this.tempParentNum === this.nodes.length) {
      this._allChecked = true;
      this.indeterminate = false;
    }
    else if (this.tempParentNum === 0) {
      this._allChecked = false;
      this.indeterminate = false;
    }
    else {
      this._allChecked = false;
      this.indeterminate = true;
    }
    this.activeNodes();
  }


  activeNodes() {
    let temp = [];
    const typeSearch = [];
    // 将被选择的节点信息进行封装
    for (let i = 0; i < this.nodes.length; i++) {
      let node = this.nodes[i];
      // 如果父节点被选择，无孩子节点：父节点自己被选择，有孩子节点：父节点和所有孩子节点均被选择
      if (node['checked'] === true) {
        if (node['children'] === undefined) {
          temp.push({'parentNode': node.name, 'childNode': null});
        }
        else if (node['children'] !== undefined) {
          for (let j = 0; j < node['children'].length; j++) {
            temp.push({'parentNode': node.name, 'childNode': node['children'][j].name});
            typeSearch.push(node['children'][j].name);
          }
        }
      }
      // 如果叶子节点被选择，把叶子节点和其父节点的信息输出即可
      else if (node['children'] !== undefined) {
        for (let j = 0; j < node['children'].length; j++) {
          if (node['children'][j]['checked'] === true) {
            temp.push({'parentNode': node.name, 'childNode': node['children'][j].name});
            typeSearch.push(node['children'][j].name);
          }
        }
      }
    }
    console.log(typeSearch);
    this.typeSearchEmit.emit(typeSearch);

  }

  saveFirstEvent() {
    if (this.firstEvent !== '') {
      this.firstEventEmit.emit(this.firstEvent);
      this.firstEvent = '';
    } else {
      this._message.info('请输入主题名称');
    }

  }

  clickParent(e) {
    e.stopPropagation();
  }

  addIcon(e, id: string) {
    this.editCount = 0;
    e.stopPropagation();
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = 0; j < this.nodes[i].children.length; j++) {
        if (this.nodes[i].children[j].edit === true) {
          this.editCount++;
        }
      }
    }
    if (this.editCount > 0) {
      this._message.info('一次只能编辑一条');
    } else {
      for (let i = 0; i < this.nodes.length; i++) {
        if (id === this.nodes[i].id) {
          this.nodes[i].collspan = true;
          this.nodes[i].children.unshift(
            {
              name: '',
              id: '',
              checked: true,
              edit: true,
              level: 2
            }
          );
        }
      }
    }
  }

  editFirstIcon(e, id: string) {
    e.stopPropagation();
    this.editCount = 0;
    for (let i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].edit === true) {
        this.editCount++;
      }
      for (let j = 0; j < this.nodes[i].children.length; j++) {
        if (this.nodes[i].children[j].edit === true) {
          this.editCount++;
        }
      }
    }
    if (this.editCount > 0) {
      this._message.info('一次只能编辑一条');
    } else {
      for (let i = 0; i < this.nodes.length; i++) {
        if (id === this.nodes[i].id) {
          this.pName = this.nodes[i].name;
          this.nodes[i].edit = true;
        }
      }
    }
  }

  editIcon(e, chilId: string, id: string) {
    this.editCount = 0;
    e.stopPropagation();
    for (let i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].edit === true) {
        this.editCount++;
      }
      for (let j = 0; j < this.nodes[i].children.length; j++) {
        if (this.nodes[i].children[j].edit === true) {
          this.editCount++;
        }
      }
    }
    if (this.editCount > 0) {
      this._message.info('一次只能编辑一条');
    } else {
      for (let i = 0; i < this.nodes.length; i++) {
        if (id === this.nodes[i].id) {
          for (let j = 0; j < this.nodes[i].children.length; j++) {
            if (this.nodes[i].children[j].id === chilId && chilId !== '') {
              this.eventName = this.nodes[i].children[j].name;
              this.oldName = this.nodes[i].children[j].name;
              this.nodes[i].children[j].name = '';
              this.nodes[i].children[j].edit = true;
            }
          }
        }
      }
    }

  }

  deleteIcon(e, chilId: string, id: string) {
    e.stopPropagation();
    this.editEvent.pid = id;
    this.editEvent.childId = chilId;
    this.editEvent.isdelete = true;
    this.newEventEmit.emit(this.editEvent);
    this.editEvent = new EventObj();
  }

  stopMouse(e) {
    e.stopPropagation();
  }

  saveIcon(e, chilId: string, id: string) {
    e.stopPropagation();
    this.editCount--;
    if (chilId === '-2') {
      // 保存一级标题
      this.editEvent.childId = chilId;
      this.editEvent.pid = id;
      this.editEvent.pName = this.pName;
      this.editEvent.isdelete = false;
    } else {
      for (let i = 0; i < this.nodes.length; i++) {
        if (id === this.nodes[i].id) {
          for (let j = 0; j < this.nodes[i].children.length; j++) {
            if (this.nodes[i].children[j].id === '' && this.nodes[i].children[j].name === '') {
              this.nodes[i].children[j].name = this.eventName;
              this.editEvent.childName = this.eventName;
              this.editEvent.childId = ''; // 为空表示新插入一个二级标题
              this.editEvent.pid = id;
              this.editEvent.isdelete = false;
              this.nodes[i].children[j].edit = false;
            } else if (chilId !== '' && this.nodes[i].children[j].id === chilId) {
              this.nodes[i].children[j].name = this.eventName;
              this.editEvent.childName = this.eventName;
              this.editEvent.childId = chilId; // 表示修改二级标题
              this.editEvent.pid = id;
              this.editEvent.isdelete = false;
              this.nodes[i].children[j].edit = false;
            }
          }
        }
      }
    }


    this.newEventEmit.emit(this.editEvent);
    this.eventName = '';
    this.pName = '';
    this.editEvent = new EventObj();
  }

  cancelIcon(e, chilId: string, id: string) {
    e.stopPropagation();
    this.editCount--;
    if (chilId === '-2') {
      for (let i = 0; i < this.nodes.length; i++) {
        if (id === this.nodes[i].id) {
          this.nodes[i].edit = false;
        }
      }
    } else {
      for (let i = 0; i < this.nodes.length; i++) {
        if (id === this.nodes[i].id) {
          for (let j = 0; j < this.nodes[i].children.length; j++) {
            if (this.nodes[i].children[j].id === '' && this.nodes[i].children[j].name === '') {
              this.nodes[i].children.splice(j, 1);
            } else if (chilId !== '' && this.nodes[i].children[j].id === chilId) {
              this.nodes[i].children[j].name = this.oldName;
              this.nodes[i].children[j].edit = false;
            }
          }
        }
      }
    }

    this.eventName = '';
  }
}


export class EventObj {
  pid: string;
  childId: string;
  childName: string;
  isdelete: boolean;
  pName: string;
}

