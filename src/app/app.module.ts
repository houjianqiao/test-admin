import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { PagesComponent } from './pages/pages.component';
import { DashboardPage } from './pages/dashboard/dashboard.component';
import { EnginePage } from './pages/engine-detect/engine-detect.component';
import { TongjiPage } from './pages/tongji-detect/tongji-detect.component';
import { SettingsPage } from './pages/settings/settings.component';

import { StatusPage } from './pages/engine-detect/status/status.component';
import { InterfacePage } from './pages/engine-detect/interface/interface.component';
import { RulePage } from './pages/engine-detect/rule/rule.component';
import { DetailPage } from './pages/engine-detect/detail/detail.component';
import { FacePage } from './pages/engine-detect/face/face.component';
import { KeywordPage } from './pages/engine-detect/keyword/keyword.component';
import { PhotoPage } from './pages/engine-detect/photo/photo.component';

import { KeywordComponent } from './components/keyword/keyword.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { PhotoShowComponent } from './components/photo-show/photo-show.component';
import { TreeComponent } from './components/tree/tree.component';
import {TreeModule} from 'angular-tree-component';
import {EngineDeleteService} from "./@core/engine-delete.service";
import {FeatureManagerService} from "./@core/feature-manager.service";
import { EventTreeComponent } from './components/event-tree/event-tree.component';
import {SampleService} from "./@core/sample.service";
import {FaceService} from "./@core/face.service";
import {WebsocketService} from "./@core/websocket.service";
import { LoginComponent } from './pages/login/login.component';
import {LoginService} from "./@core/login.service";
import {CookieService} from "ngx-cookie-service";
import { FaceTreeComponent } from './components/face-tree/face-tree.component';
import { CircleComponent } from './components/circle/circle.component';
import { StopCircleComponent } from './components/stop-circle/stop-circle.component';
import { FacePhotoComponent } from './components/face-photo/face-photo.component';
@NgModule({
  declarations: [
    AppComponent,
    PagesComponent,
    DashboardPage,
    EnginePage,
    TongjiPage,
    SettingsPage,
    StatusPage,
    InterfacePage,
    RulePage,
    DetailPage,
    FacePage,
    KeywordPage,
    PhotoPage,
    KeywordComponent,
    PhotoShowComponent,
    TreeComponent,
    EventTreeComponent,
    LoginComponent,
    FaceTreeComponent,
    CircleComponent,
    StopCircleComponent,
    FacePhotoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgZorroAntdModule.forRoot(),
    NgbModule.forRoot(),
    NgxEchartsModule,
    TreeModule,
    ReactiveFormsModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    EngineDeleteService,
    FeatureManagerService,
    SampleService,
    FaceService,
    WebsocketService,
    LoginService,
    CookieService
  ]
})
export class AppModule { }
