import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";

@Injectable()
export class WebsocketService {

  ws: WebSocket;

  constructor() {
  }

  createWebsocket(url: string) {
    this.ws = new WebSocket(url);
    return new Observable( // 返回可观测的流
      observer => {
        this.ws.onmessage = (event) => observer.next(event.data); // 推送内容
        this.ws.onerror = (event) => observer.error(event); // 当发生错误时，推送错误消息
        this.ws.onclose = (event) => observer.complete(); // 当关闭时，可观察对象的完毕
        return () => this.ws.close(); // 这个匿名函数取消订阅的方法的时候调用，关闭WebSocket, 否则的话，容易造成内存的泄露;
      }
    );
  }

  onMessage() {
    return new Observable(observer => {
      this.ws.onmessage = (event) => observer.next(event.data);
    });
  }

  onClose() {
    this.ws.close();
  }

  sendMessage(message: string) {
    console.log('开始发送信息');
    this.ws.send(message);
    console.log('发送信息ss');
  }
}
