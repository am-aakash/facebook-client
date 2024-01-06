import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FacebookService } from 'src/app/shared_service/facebook.service';
import { LocalStorageService } from 'src/app/shared_service/local-storage.service';
declare var bootstrap: any;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  forgotPasswordForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private facebookService: FacebookService,
    private localStorageService: LocalStorageService,
  ) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern("^[a-z0-9_.]+")]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    this.facebookService.forgotPassword(this.forgotPasswordForm.controls["username"].value, this.forgotPasswordForm.controls["email"].value)
    .subscribe(
      (response) => {
        if(response.check){
          this.facebookService.getUserByUsername(this.forgotPasswordForm.controls["username"].value)
          .subscribe(
            (response) => {
              this.localStorageService.set("userId", response.userId);
              this.router.navigate(['/new-pw']);
            },
            (err) => {
              this.makeAlertElem(err.error.errorMessage, 4000);
            }
          )
        }
        else{
          this.makeAlertElem("Email doesn't match for the user", 4000);
        }
      },
      (error) => {
        this.makeAlertElem(error.error.errorMessage, 4000);
      }
    )
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

    // Automatically hide the toast after the specified timeout
    setTimeout(() => {
      toast.hide();
    }, timeout);
  }
}
