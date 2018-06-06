import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "../../@core/login.service";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  validateForm: FormGroup;
  username: string = '';
  password: string = '';
  rememberMe: boolean = true;
  user = new User();

  constructor(private fb: FormBuilder,
              private httpService: LoginService,
              private cookieService: CookieService,
              protected router: Router) {
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true],
    });
  }

  _submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
    }
    this.user.username = this.username;
    this.user.password = this.password;
    this.httpService.httpLogin(this.user).subscribe(result => {
      if (result['code'] === '200') {
        this.cookieService.set('token', result['token'], 2);
        this.router.navigate(['/pages/engine-detect']);
      } else {
        alert('用户名、密码不对');
      }
    });


  }

}

export class User {
  public username: string;
  public password: string;
  public rememberme: string;
}
