import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from 'src/app/model/AuthModel';
import { LoginService } from 'src/app/service/login.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: any;
  submitDisabled: boolean = false;
  user: Auth = {
    userName: '',
    password: ''
  }
  constructor(private router: Router,private formBuilder: FormBuilder,private loginService:LoginService) {
    this.loginForm = formBuilder.group(
      {
      userName: [null],
      password: [null]
    });
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch(Error) {
      return null;
    }
  }
  login() {

    this.submitDisabled = true;
    if (this.loginForm.valid) {
      const val = this.loginForm.value;
      this.user.userName = val.userName;
      this.user.password = val.password;

      this.loginService.login(this.user).subscribe((response: any) =>
      {
        if (response.token != null)
        {
          const tokenInfo = this.getDecodedAccessToken(response.token);
          localStorage.setItem("Authorization", "");
          localStorage.setItem("Authorization", "Bearer " + response.token);

          this.router.navigateByUrl("/landingPage");
          }
       }
       );
    }
  }
}
