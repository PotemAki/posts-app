import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class InputComponent implements OnInit, OnDestroy {
  form: FormGroup;
  imagePreview: string;
  user: any;
  private authSub: Subscription

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
  }

  onSavePost() {
    if (!this.form.value.content) {
      console.log('return')
      return;
    }
    this.postsService.addPost(this.user.displayName, this.form.value.content, this.form.value.image, this.user.imagePath);
    this.form.reset();
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
  ngOnDestroy(): void {
    this.authSub.unsubscribe()
  }
}

