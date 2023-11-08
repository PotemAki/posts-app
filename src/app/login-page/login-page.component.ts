import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { PostsService } from '../posts-page/posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  registerForm: FormGroup;
  login = true
  darkMode = false
  private isDarkModeSub: Subscription 

  constructor( private authService: AuthService, public postsService: PostsService) { }
 
  ngOnInit() {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, { validators: [Validators.required, Validators.email] }),
      'password': new FormControl(null, { validators: [Validators.required] })
    })
    this.registerForm = new FormGroup({
      'email': new FormControl(null, { validators: [Validators.required, Validators.email] }),
      'username': new FormControl(null, { validators: [Validators.required] }),
      'password': new FormControl(null, { validators: [Validators.required] })
    })
    this.isDarkModeSub = this.postsService.darkMode.subscribe((res) =>{
      this.darkMode = res
    })
  }
  onSubmitRegister() {
    if (!this.registerForm.valid) {
      return;
    }
    this.authService.createUser(this.registerForm.value.email, this.registerForm.value.username, this.registerForm.value.password)
    this.registerForm.reset()
  }
  onSubmitLogin() {
    if (!this.loginForm.valid) {
      return;
    }
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
  }

  isLogin() {
    this.login = !this.login
  }
  tabRegister() {
    this.login = false
  }
  emailErrors() {
    return this.registerForm.get('email').hasError('required') ? 'This field is required' :
      this.registerForm.get('email').hasError('pattern') ? 'Not a valid emailaddress' :''
  }
  checkValidation(input: string){
    const validation = this.registerForm.get(input).invalid && (this.registerForm.get(input).dirty || this.registerForm.get(input).touched)
    return validation;
  }
  checkValidationL(input: string){
    const validation = this.loginForm.get(input).invalid && (this.loginForm.get(input).dirty || this.loginForm.get(input).touched)
    return validation;
  }
  ngOnDestroy() {
    this.isDarkModeSub.unsubscribe()
  }
 }
 