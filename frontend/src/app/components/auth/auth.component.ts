import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AUTH_MODE } from 'src/constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  authMode: string = AUTH_MODE.SIGN_IN;
  authMessage: string = 'Already have an account. Sign in instead';
  // @ts-ignore
  myForm: FormGroup;

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  toggleAuthMode() {
    if (this.authMode === AUTH_MODE.SIGN_IN) {
      this.authMode = AUTH_MODE.SIGN_UP;
      this.authMessage = "Don't Have an account? Create One";
    } else if (this.authMode === AUTH_MODE.SIGN_UP) {
      this.authMode = AUTH_MODE.SIGN_IN;
      this.authMessage = 'Already have an account. Sign in instead';
    }
  }

  signClick() {
    const email = this.myForm.controls['email'].value;
    const password = this.myForm.controls['password'].value;
    const body = {
      email,
      password,
    };

    this.authMode === AUTH_MODE.SIGN_IN
      ? this.api.authRequest('users/login', body).subscribe(
          (res) => {
            localStorage.setItem('token', res.token);
            this.router.navigate(['/home']);
          },
          (err) => {
            console.log(err);
          }
        )
      : this.api.authRequest('users/register', body).subscribe(
          (res) => {
            localStorage.setItem('token', res.token);
            this.router.navigate(['/home']);
          },
          (err) => {
            console.log(err);
          }
        );
  }
}
