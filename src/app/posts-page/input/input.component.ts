import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { mimeType } from '../mime-type.validator';
import { AuthService } from 'src/app/login-page/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit, OnDestroy, AfterViewInit {
  form: FormGroup;
  imagePreview: string;
  user: any;
  isGroup = 'main'
  isGroupChoice = 'main'
  inGroupWhat: string
  private authSub: Subscription
  private isGroupSub: Subscription
  main = true
  group1 = true
  group2 = true
  group3 = true
  darkMode = true
  private isDarkModeSub: Subscription

  constructor(private postsService: PostsService, public authService: AuthService) { }

  ngOnInit() {
    this.form = new FormGroup({
      content: new FormControl(null),
      image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });
    this.user = this.authService.getIsAuth();
    this.authSub = this.authService.user.subscribe(
      isAuth => {
        this.user = isAuth
        if (!this.user) {
          this.form.disable()
        } else {
          this.form.enable
        }
      }
    )
    this.isGroupSub = this.postsService.groupActive.subscribe((res) =>{
      this.isGroupChoice = res
      this.shouldDisable(res)
    })
    this.isDarkModeSub = this.postsService.darkMode.subscribe((res) =>{
      this.darkMode = res
    })
  }
  ngAfterViewInit(): void {
    this.shouldDisable(this.inGroupWhat)
  }
  onSavePost() {
    this.isGroup = this.isGroupChoice
    if (!this.form.value.content) {
      console.log('return')
      return;
    }
    this.postsService.addPost(this.user.displayName, this.form.value.content, this.form.value.image, this.user.imagePath, this.isGroup);
    this.form.reset();
    this.postsService.groupActive.next(this.isGroup)
  }
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  resetForm() {
    this.form.reset()
    this.imagePreview = '';
  }

  toMain() {
    this.isGroupChoice = 'main'
  }
  toGroup1() {
    this.isGroupChoice = 'group1'
  }
  toGroup2() {
    this.isGroupChoice = 'group2'
  }
  toGroup3() {
    this.isGroupChoice = 'group3'
  }

  shouldDisable(res: string) {
    if (res === 'main') {
      this.main = true;
      this.group1 = true;
      this.group2 = true;
      this.group3 = true;
      this.isGroup = 'main'
    } else if (res === 'group1') {
      this.main = false;
      this.group1 = true;
      this.group2 = false;
      this.group3 = false;
      this.isGroup = 'group1'
    } else if (res === 'group2') {
      this.main = false;
      this.group1 = false;
      this.group2 = true;
      this.group3 = false;
      this.isGroup = 'group2'
    } else if (res === 'group3') {
      this.main = false;
      this.group1 = false;
      this.group2 = false;
      this.group3 = true;
      this.isGroup = 'group3'
    }
    
  }
  goBack() {
    this.postsService.groupActive.next('main')
  }


  ngOnDestroy(): void {
    this.authSub.unsubscribe()
    this.isGroupSub.unsubscribe()
    this.isDarkModeSub.unsubscribe()
  }
}

