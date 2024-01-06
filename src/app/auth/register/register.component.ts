import { Component, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FacebookService } from 'src/app/shared_service/facebook.service';
import { LocalStorageService } from 'src/app/shared_service/local-storage.service';
declare var bootstrap: any;
import lottie from 'lottie-web';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registrationForm!: FormGroup;
  isPasswordMatch: boolean = false;
  isUsernameValid: boolean = false;
  isPasswordValid: boolean = false;

  constructor(
    private fb: FormBuilder,
    private el: ElementRef,
    private router: Router,
    private facebookService: FacebookService,
    private localStorageService: LocalStorageService,
  ) { }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required, this.validateUsername, Validators.minLength(6)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      emailId: ['', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._]+@[a-z0-9]+.(com|in|org)$")]],
      dateOfBirth: ['', [Validators.required, this.minimumAgeValidatior]],
      gender: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16) ]],
      rePassword: ['', [Validators.required]],
    });
  }

  private animation: any;

  ngAfterViewInit(): void {
    this.loadFacebookAnimation();
  }

  loadFacebookAnimation() {
    this.animation = lottie.loadAnimation({
      container: this.el.nativeElement.querySelector('#lottie-container'), // ID of the container element
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '../../assets/facebook-stable.json',
    });
  }

  makeAlertElem(
    text: string,
    timeout: number = 2500
  ): void {
    const toastElement = document.querySelector<HTMLElement>(
      '#toast-sticky-message .toast'
    );
    if (!toastElement) {
      return;
    }
    toastElement.querySelector<HTMLElement>('#toast-content')!.innerHTML = text;
    const toast = new bootstrap.Toast(toastElement);
    toast.show();

    setTimeout(() => {
      toast.hide();
    }, timeout);
  }

  validateUsername(control: { value: string }) {
    const pattern = /^[a-z0-9._]+$/;
    return pattern.test(control.value) ? null : { invalidUsername: true };
  }

  checkUsername() {
    this.facebookService.checkUsername(this.registrationForm.controls["username"].value)
    .subscribe(
      (res) => {
        this.isUsernameValid = (res.check);
      },
      (err) => {
        // this.makeAlertElem(err.error.message, 4000);
      }
    )
  }

  onSubmit() {
    this.facebookService.register(this.registrationForm.value)
      .subscribe(
        (response) => {
          this.localStorageService.set("userId", response.userId);
          this.localStorageService.set("token", response.token);
          this.facebookService.addProfile(this.registrationForm.value)
          .subscribe(
            (res) => {
              this.router.navigate(['/home']);
            },
            (err) => {
              this.makeAlertElem(err.error.message, 4000);
            }
          )
        },
        (error) => {
          this.makeAlertElem(error.error.message, 4000);
        }
      )
  }

  minimumAgeValidatior(control: FormControl): ValidationErrors | null {
    if(control.value){
      const currentDate = new Date();
      const dob = new Date(control.value);

      const ageDiff = currentDate.getTime() - dob.getTime();

      if(ageDiff < 13 * 365 * 24 * 60 * 60 * 1000) {
        return {minimumAge : true};
      }
    }
    return null;
  }
}
