import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable()
export class LoginService {

  constructor(private http: HttpClient) { }

  httpLogin(user) {
    return this.http.post('engine/logout/login.do', user);
  }

}
