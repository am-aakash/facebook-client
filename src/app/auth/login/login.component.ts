import { LocalStorageService } from './../../shared_service/local-storage.service';
import { FacebookService } from './../../shared_service/facebook.service';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import lottie from 'lottie-web';
declare var bootstrap: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  errorMessage!: string;
  showLoginLoading!: boolean;
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private el: ElementRef,
    private router: Router,
    private facebookService: FacebookService,
    private localStorageService: LocalStorageService,
  ) { }

  ngOnInit() {
    this.showLoginLoading = false;
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern("^[a-z0-9_.]+")]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
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

  loadSmallLoadingAnimation() {
    this.animation = lottie.loadAnimation({
      container: this.el.nativeElement.querySelector('#lottie-loader'), // ID of the container element
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '../../assets/loading-blue.json',
    });
  }

  onSubmit() {
    this.showLoginLoading = true;
    this.facebookService.login(this.loginForm.value)
      .subscribe(
        (response) => {
          this.loadSmallLoadingAnimation();
          this.localStorageService.set("userId", response.userId);
          this.localStorageService.set("token", response.token);
          setTimeout(() => {
            this.showLoginLoading = false;
            this.router.navigate(['/home']);
          }, 2000);
        },
        (error) => {
          this.showLoginLoading = false;
          this.makeAlertElem(error.error.message, 4000);
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

  createAccount() { }
}
