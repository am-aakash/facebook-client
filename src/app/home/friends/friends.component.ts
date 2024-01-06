import { Component, ElementRef, OnInit } from '@angular/core';
import { FriendEntity } from 'src/app/models/friend';
import lottie from 'lottie-web';
import { Router } from '@angular/router';
import { FacebookService } from 'src/app/shared_service/facebook.service';
import { LocalStorageService } from 'src/app/shared_service/local-storage.service';
import { Profile } from 'src/app/models/profile';
declare var bootstrap: any;

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css'],
})
export class FriendsComponent {
  tileMyFriendsActive: boolean = false;
  tileRecievedReqActive: boolean = false;
  tileSendReqActive: boolean = false;
  tileBlockedActive: boolean = false;
  showLoading: boolean = false;
  friends: Profile[] = [];
  newFriends: Profile[] = [];
  categories: String[] = [];

  constructor(
    private el: ElementRef,
    private router: Router,
    private facebookService: FacebookService,
    private localStorageService: LocalStorageService,
  ) { }

  ngOnInit(): void {
    this.getMyFriends();
    this.getCategories();
  }

  getMyFriends() {
    this.friends = [];
    this.showLoading = true;
    if (this.animation != null) this.animation.destroy();
    this.loadSmallLoadingAnimation();
    this.tileMyFriendsActive = true;
    this.tileRecievedReqActive = false;
    this.tileSendReqActive = false;
    this.tileBlockedActive = false;

    this.facebookService.getFriends()
      .subscribe(
        (frEn) => {
          frEn.map(fr => {
            this.facebookService.getProfileById(fr.friendId)
              .subscribe(
                (friend) => {
                  friend.isFriend = true;
                  this.newFriends.push(friend);
                }
              )
          })
        },
        (err) => {
          this.makeAlertElem(err.error.message, 4000);
        }
      )
    setTimeout(() => {
      this.showLoading = false;
      if (this.animation != null) this.animation.destroy();
      this.friends = this.newFriends;
      this.newFriends = [];
    }, 1500);
  }

  getRecievedReq() {
    this.friends = [];
    this.showLoading = true;
    if (this.animation != null) this.animation.destroy();
    this.loadSmallLoadingAnimation();

    this.tileMyFriendsActive = false;
    this.tileRecievedReqActive = true;
    this.tileSendReqActive = false;
    this.tileBlockedActive = false;

    this.facebookService.getRequestsRecieved()
      .subscribe(
        (frEn) => {
          frEn.map(fr => {
            this.facebookService.getProfileById(fr.senderId)
              .subscribe(
                (friend) => {
                  friend.isFriend = true;
                  this.newFriends.push(friend);
                }
              )
          })
        },
        (err) => {
          this.makeAlertElem(err.error.message, 4000);
        }
      )
    setTimeout(() => {
      this.showLoading = false;
      if (this.animation != null) this.animation.destroy();
      this.friends = this.newFriends;
      this.newFriends = [];
    }, 1000);
  }

  getSendReq() {
    this.friends = [];
    this.showLoading = true;
    if (this.animation != null) this.animation.destroy();
    this.loadSmallLoadingAnimation();

    this.tileMyFriendsActive = false;
    this.tileRecievedReqActive = false;
    this.tileSendReqActive = true;
    this.tileBlockedActive = false;

    this.facebookService.getRequestsSent()
      .subscribe(
        (frEn) => {
          frEn.map(fr => {
            this.facebookService.getProfileById(fr.recieverId)
              .subscribe(
                (friend) => {
                  friend.isFriend = true;
                  this.newFriends.push(friend);
                }
              )
          })
        },
        (err) => {
          this.makeAlertElem(err.error.message, 4000);
        }
      )
    setTimeout(() => {
      this.showLoading = false;
      if (this.animation != null) this.animation.destroy();
      this.friends = this.newFriends;
      this.newFriends = [];
    }, 1000);

  }

  getBlocked() {
    this.friends = [];
    this.showLoading = true;
    if (this.animation != null) this.animation.destroy();
    this.loadSmallLoadingAnimation();

    this.tileMyFriendsActive = false;
    this.tileRecievedReqActive = false;
    this.tileSendReqActive = false;
    this.tileBlockedActive = true;

    setTimeout(() => {
      this.showLoading = false;
      if (this.animation != null) this.animation.destroy();
      this.friends = this.newFriends;
      this.newFriends = [];
    }, 500);
  }

  handleTrailTap(tapId: string) {
    if (this.tileRecievedReqActive) {
      this.facebookService.acceptRequest(tapId)
        .subscribe(
          (success) => {
            this.makeAlertElem(success.message, 6000);
            this.getMyFriends();
          },
          (err) => {
            this.getMyFriends();
            this.makeAlertElem(err.error.message, 4000);
          }
        )
    }
  }

  getCategories() {
    this.facebookService.getCategories()
      .subscribe(
        (catgs) => {
          
          this.categories = catgs;
        },
        (err) => {
          console.log(err);
          
        }
      )
  }

  private animation: any;

  loadSmallLoadingAnimation() {
    this.animation = lottie.loadAnimation({
      container: this.el.nativeElement.querySelector('#lottie-loader'), // ID of the container element
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '../../assets/loading-blue.json',
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
