import { Component, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import lottie from 'lottie-web';
import { Profile } from 'src/app/models/profile';
import { FacebookService } from 'src/app/shared_service/facebook.service';
import { LocalStorageService } from 'src/app/shared_service/local-storage.service';
declare var bootstrap: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  searchForm!: FormGroup;
  people: Profile[] = [];
  peopleStore: Profile[] = [];
  animate: boolean = true;

  constructor(
    private fb: FormBuilder,
    private el: ElementRef,
    private facebookService: FacebookService,
    private localStorageService: LocalStorageService,
  ) { }

  ngOnInit() {
    this.searchForm = this.fb.group({
      searchtext: ['']
    });
  }

  private animation: any;

  onInput() {
    this.people = [];
    this.peopleStore = [];
    this.animate = true;
    if (this.animation != null) this.animation.destroy();
    this.loadSmallLoadingAnimation();

    this.facebookService.getProfilesByKeyword(this.searchForm.controls['searchtext'].value)
      .subscribe(
        (profiles) => {
          this.peopleStore = profiles.filter(pr => !pr.userId.match(this.localStorageService.get('userId') ?? '')).map(pr => {
            this.facebookService.checkIfFriend(pr.userId)
              .subscribe(
                (res) => {
                  pr.isFriend = res.success;
                }
              )
            this.facebookService.checkIfRequested(pr.userId)
              .subscribe(
                (res) => {
                  pr.requestRecieved = (res.success && !res.message.match("Already Sent Request to the user"));
                  pr.requestSent = (res.message.match("Already Sent Request to the user"));
                }
              )
            return pr;
          });

        }
      )

    setTimeout(() => {
      this.people = this.peopleStore;
      if (this.animation != null) this.animation.destroy();
      if (this.people.length == 0) {
        this.loadEmptyAnimation();
      }
      else {
        this.animate = false;
      }
    }, 1000);
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

  handleTrailTap(profile: Profile) {
    if (!profile.requestSent && !profile.isFriend && !profile.requestRecieved) {
      this.facebookService.sendRequest(profile.userId)
        .subscribe(
          (success) => {
            this.people[this.people.findIndex(pp=>pp.userId==profile.userId)].requestSent = true;
            this.makeAlertElem(success.message, 4000);
          },
          (err) => {
            this.makeAlertElem(err.error.errorMessage, 4000);
          }
        )
        // this.onInput();
    }
    else if (!profile.requestSent && !profile.isFriend) {
      this.facebookService.acceptRequest(profile.userId)
        .subscribe(
          (success) => {
            this.people[this.people.findIndex(pp=>pp.userId==profile.userId)].isFriend = true;
            this.makeAlertElem(success.message, 4000);
          },
          (err) => {
          }
        )
        // this.onInput();
    }
    
  }

  loadEmptyAnimation() {
    this.animation = lottie.loadAnimation({
      container: this.el.nativeElement.querySelector('#lottie-loader'), // ID of the container element
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '../../assets/no-posts-lottie.json',
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

    // Automatically hide the toast after the specified timeout
    setTimeout(() => {
      toast.hide();
    }, timeout);
  }
}
