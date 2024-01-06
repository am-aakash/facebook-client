import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FacebookService } from 'src/app/shared_service/facebook.service';
import { LocalStorageService } from 'src/app/shared_service/local-storage.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css'],
})
export class NewPasswordComponent {
  newPasswordForm!: FormGroup;
  isPasswordObscured: boolean = true;
  isConfirmPasswordObscured: boolean = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private facebookService: FacebookService,
    private localStorageService: LocalStorageService,
  ) { }

  ngOnInit(): void {
    this.newPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.facebookService.newPassword(this.localStorageService.get("userId")!, this.newPasswordForm.controls["password"].value)
    .subscribe(
      (res) => {
        this.router.navigate(['/login']);
      },
      (err) => {        
      }
    )
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.isPasswordObscured = !this.isPasswordObscured;
    } else if (field === 'confirmPassword') {
      this.isConfirmPasswordObscured = !this.isConfirmPasswordObscured;
    }
  }
}
