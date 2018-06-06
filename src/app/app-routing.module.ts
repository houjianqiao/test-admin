import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component'
import { PagesComponent } from './pages/pages.component'
import { DashboardPage } from './pages/dashboard/dashboard.component'
import { EnginePage } from './pages/engine-detect/engine-detect.component'
import { SettingsPage } from './pages/settings/settings.component'
import { TongjiPage } from './pages/tongji-detect/tongji-detect.component'

import { StatusPage } from './pages/engine-detect/status/status.component'
import { InterfacePage } from './pages/engine-detect/interface/interface.component'
import { RulePage } from './pages/engine-detect/rule/rule.component'
import { DetailPage } from './pages/engine-detect/detail/detail.component'
import { FacePage } from './pages/engine-detect/face/face.component'
import { KeywordPage } from './pages/engine-detect/keyword/keyword.component'
import { PhotoPage } from './pages/engine-detect/photo/photo.component'
import {LoginComponent} from "./pages/login/login.component";

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  /*{ path: '', redirectTo: 'pages/engine-detect', pathMatch: 'full' },*/
  { path: 'pages',
    component: PagesComponent,
    children: [
      { path: 'dashboard', component: DashboardPage,},
      {
        path: 'engine-detect',
        component: EnginePage,
        children: [
          { path: 'status', component: StatusPage },
          { path: 'interface', component: InterfacePage },
          { path: 'rule', component: RulePage },
          { path: 'detail', component: DetailPage },
          { path: 'photo', component: PhotoPage },
          { path: 'keyword', component: KeywordPage },
          { path: 'face', component: FacePage },
          { path: '', redirectTo: 'status', pathMatch: 'full',},
        ],
       },
      { path: 'tongji-detect', component: TongjiPage },
      { path: 'settings', component: SettingsPage },
      { path: '', redirectTo: 'pages/engine-detect', pathMatch: 'full',},
    ]
  }
];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
