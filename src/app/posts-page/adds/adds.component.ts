import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { PostsService } from '../posts.service';
import { DialogService } from '../dialog.service';

@Component({
  selector: 'app-adds',
  templateUrl: './adds.component.html',
  styleUrls: ['./adds.component.css']
})
export class AddsComponent implements OnInit, OnDestroy{
  title = 'CV Generator'
  subTitle = 'New Angular Project!'
  desc = 'Curriculum Vitae generator, that let us build application and download it in PDF.'
  image = 'assets/generate-app.png'
  demo = 'https://potemaki.github.io/generate-cv/generate-app#/generate'
  code = 'https://github.com/PotemAki/generate-cv'
  isTimeOut: any;
  isLoading = false;
  darkMode = false
  private isDarkModeSub: Subscription

  constructor(private postsService: PostsService, public dialogService: DialogService) { }

  ngOnInit() {
    this.refresh()
    this.isDarkModeSub = this.postsService.darkMode.subscribe((res) =>{
      this.darkMode = res
    })
  }

  refresh(){
    clearTimeout(this.isTimeOut)
    this.isLoading = true;
    this.isTimeOut = setTimeout(() =>{
      const randomNumber = Math.random();
      if (randomNumber >= 0 && randomNumber < 1/4) {
        this.variant1()
      } else if (randomNumber >= 1/4 && randomNumber < 2/4) {
        this.variant2()
      } else if (randomNumber >= 2/4 && randomNumber < 3/4) {
        this.variant3()
      } else if (randomNumber >= 3/4 && randomNumber < 1) {
        this.variant4()
      }
      this.isLoading = false;
    }, 500)
  }
  

  variant1() {
    this.title = 'CV Generator'
    this.subTitle = 'New Angular Project!'
    this.desc = 'Curriculum Vitae generator, that let us build application and download it in PDF.'
    this.image = 'assets/generate-app.png'
    this.demo = 'https://potemaki.github.io/generate-cv/generate-app#/generate'
    this.code = 'https://github.com/PotemAki/generate-cv'
  }
  variant2() {
    this.title = 'Login App'
    this.subTitle = 'New Angular Project!'
    this.desc = 'Login application with notes, that let us test out user experience.'
    this.image = 'assets/login-app.png'
    this.demo = 'https://potemaki.github.io/login-app/login-app#/auth'
    this.code = 'https://github.com/PotemAki/login-app'
  }
  variant3() {
    this.title = 'Rock Paper Scissors'
    this.subTitle = 'New JavaScript Project!'
    this.desc = 'Let us play Rock Paper Scissors game.'
    this.image = 'assets/js-rock-papper-scissors.png'
    this.demo = 'https://potemaki.github.io/Rock-Paper-Scissors/'
    this.code = 'https://github.com/PotemAki/Rock-Paper-Scissors'
  }
  variant4() {
    this.title = 'Calculator'
    this.subTitle = 'New JavaScript Project!'
    this.desc = 'Basic calculator.'
    this.image = 'assets/js-calculator.png'
    this.demo = 'https://potemaki.github.io/Calculator/'
    this.code = 'https://github.com/PotemAki/Calculator'
  }

  openInfo() {
    this.dialogService.openDialog({});
  }

  ngOnDestroy() {
    this.isDarkModeSub.unsubscribe()
  }
}