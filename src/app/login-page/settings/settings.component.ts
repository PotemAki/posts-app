import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { mimeType } from 'src/app/posts-page/mime-type.validator';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {
  settingsForm: FormGroup;
  imagePreview: string = 'assets/pfp.png'
  user: any;
  selectedOption = true;
  isError = false;
  message = '';
  showConfirmationDialog = false;
  isTimeOut: any;
  private authSub: Subscription

  constructor (private authService: AuthService) { }

  ngOnInit() {
    this.settingsForm = new FormGroup({
      email: new FormControl(null),
      displayName: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });
    
    this.settingsForm.get('email')?.disable();
    this.user = this.authService.getIsAuth();
    this.authSub = this.authService.user.subscribe(
      isAuth => {
        this.user = isAuth
        if (isAuth.imagePath) {
          this.imagePreview = isAuth.imagePath
        }
        if (this.user) {
          this.settingsForm.setValue({
            email: this.user.email,
            displayName: this.user.displayName,
            image: this.imagePreview
          })
        }
      }
    )

  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.settingsForm.patchValue({image: file});
    this.settingsForm.get('image').updateValueAndValidity
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  resetProfilePic() {
    this.imagePreview = 'assets/pfp.png';
    this.settingsForm.setValue({
      email: this.user.email,
      displayName: this.user.displayName,
      image: 'assets/pfp.png'
    })
  }

  saveSettings() {
    let displayName = this.settingsForm.value.displayName
    if (displayName === '') {
      return
    }
    this.authService.updateUser(this.user.userId, displayName, this.settingsForm.value.image)
    this.infoTimeout('done!')
  }
  savePassword(form: NgForm) {
    if (form.value.password !== form.value.repeatPassword) { 
      this.isError = true
      return
    } else {
      this.isError = false;
      this.authService.changePass(this.user.userId, form.value.password)
      this.infoTimeout('done!')
    }
  }

  pickOption() {
    this.selectedOption = !this.selectedOption
  }

  infoTimeout(text: string) {
    this.message = text
    clearTimeout(this.isTimeOut)
    this.isTimeOut = setTimeout(() => {
    this.message = '';
  }, 1000);
  }
  deleteAccount(): void {
    this.showConfirmationDialog = true;
  }

  cancelDelete(): void {
    this.showConfirmationDialog = false;
  }

  confirmDelete(): void {
    this.authService.deleteAccount(this.user.userId)
    this.showConfirmationDialog = false;
  }

  ngOnDestroy() {
    this.authSub.unsubscribe()
  }

}