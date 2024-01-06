import { Component, ElementRef, HostListener } from '@angular/core';
import lottie from 'lottie-web';
import { Router } from '@angular/router';
import { LocalStorageService } from '../shared_service/local-storage.service';
import { FacebookService } from '../shared_service/facebook.service';
import { Profile } from '../models/profile';
declare var bootstrap: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', '../../assets/font-awesome.min.css'],
})
export class HomeComponent {
  constructor(private el: ElementRef, private router: Router, private facebookService: FacebookService, private localStorageService: LocalStorageService) { }
  isErrorToast: boolean = true;
  userProfile?: Profile;
  private animation: any;

  ngOnInit(): void {
    this.getProfileById();
    this.router.navigate(['/feed']);
  }

  getProfileById() {    
    this.facebookService.getProfileById(this.localStorageService.get("userId") ?? "")
    .subscribe(
      (res) => {
        this.isErrorToast = false;
        this.userProfile = res;
        this.makeAlertElem("Welcome To Facebook, " + res.firstName, 4000);
      },
      (err) => {
        console.log(err);
        this.isErrorToast = true;
        this.makeAlertElem(err.error.statusText, 4000);
      }
    )
  }

  isProfileMenuOpen = false;

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  logout() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
    this.localStorageService.remove("userId");
    this.localStorageService.remove("token");
    this.router.navigate(['']);
  }

  @HostListener('document:click', ['$event'])
  documentClick(event: Event) {
    if (this.isProfileMenuOpen) {
      const menu = this.el.nativeElement.querySelector('.profile-menu');
      const icon = this.el.nativeElement.querySelector('.profile-icon');
      if (!menu.contains(event.target) && !icon.contains(event.target)) {
        this.isProfileMenuOpen = false;
      }
    }
  }

  isSearchPopupOpen = false;

  openSearchPopup() {
    this.isSearchPopupOpen = true;
  }

  closeSearchPopup() {
    this.isSearchPopupOpen = false;
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
