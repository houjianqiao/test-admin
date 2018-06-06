import { Component, OnInit } from '@angular/core';
import {ITreeOptions, KEYS, TREE_ACTIONS, TreeModel} from "angular-tree-component";
import {TreeNode} from "angular-tree-component/dist/defs/api";
@Component({
  selector: 'app-event-tree',
  templateUrl: './event-tree.component.html',
  styleUrls: ['./event-tree.component.css']
})
export class EventTreeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  nodes = [
    {
      id: 1,
      name: '涉领导人',
      isExpanded: true,
      result: true,
      children: [
        {id: 2, name: '水军账号' , result: false},
        {id: 3, name: '转世账号' , result: false},
        {id: 4, name: '有害账号' , result: false},
      ],
    },
    {
      id: 5,
      name: '涉其他人',
      isExpanded: true,
      result: true,
      children: [
        {id: 6, name: '水军账号', result: false},
        {id: 7, name: '转世账号',  result: false},
        {id: 8, name: '有害账号' , result: false},
      ],
    },
  ];


  options: ITreeOptions = {
    useCheckbox: false
  };

  activeNodes(treeModel: any) {
    let temp = [];
    let tempNodes = [];
    // 根据读取的nodes的数据转换成对象数组，每一个对象包含父、子节点键值对，作为后续的比对样本
    for (let i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i]['children'] === undefined) {
        tempNodes.push({'parentNode': this.nodes[i]['name']});
      }
      else {
        for (let j = 0; j < this.nodes[i]['children'].length; j++) {
          tempNodes.push({'parentNode': this.nodes[i]['name'], 'childNodes': this.nodes[i]['children'][j]['name']});
        }
      }
    }
    // 将被选择的节点信息进行封装
    treeModel.doForAll(function (node: TreeNode) {
      if (node.isSelected) {
        for (let i = 0; i < tempNodes.length; i++) {
          if (node.data.name === tempNodes[i]['parentNode'] && tempNodes[i]['childNodes'] === undefined) {
            temp.push({'parentNode': tempNodes[i]['parentNode'], 'childNode': null});
          }
          if (node.data.name === tempNodes[i]['childNodes']) {
            temp.push({'parentNode': tempNodes[i]['parentNode'], 'childNode': tempNodes[i]['childNodes']});
          }
        }
      }
    });
    console.log(temp);
  }

}
