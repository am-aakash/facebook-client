import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthModule } from './auth/auth.module';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { NewPasswordComponent } from './auth/new-password/new-password.component';
import { HomeModule } from './home/home.module';
import { FacebookService } from './shared_service/facebook.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LocalStorageService } from './shared_service/local-storage.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    NewPasswordComponent,
  ],
  imports: [BrowserModule, ReactiveFormsModule, AppRoutingModule, AuthModule, HomeModule, FormsModule,
    HttpClientModule,],
  providers: [FacebookService, LocalStorageService],
  bootstrap: [AppComponent],
})
export class AppModule { }
