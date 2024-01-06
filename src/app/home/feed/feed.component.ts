import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from 'src/app/models/post';
import { Profile } from 'src/app/models/profile';
import { FacebookService } from 'src/app/shared_service/facebook.service';
import { LocalStorageService } from 'src/app/shared_service/local-storage.service';
declare var bootstrap: any;
import lottie from 'lottie-web';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent {
  showLoading: boolean = false;
  friends: Profile[] = [];
  posts: Post[] = [];
  postsUnGrouped: Post[] = [];
  userProfile?: Profile;

  constructor(
    private el: ElementRef,
    protected router: Router,
    private facebookService: FacebookService,
    private localStorageService: LocalStorageService,
  ) { }

  ngOnInit(): void {
    this.getProfileById();
    this.getPosts();
  }

  getPosts() {
    this.showLoading = true;
    if (this.animation != null) this.animation.destroy();
    this.loadSmallLoadingAnimation();

    this.facebookService.getFriends()
      .subscribe(
        (frEn) => {

          frEn.map(fr => {
            this.facebookService.getProfileById(fr.friendId)
              .subscribe(
                (friend) => {
                  friend.isFriend = true;
                  this.friends.push(friend);

                  this.facebookService.getPosts(friend.userId)
                    .subscribe(
                      (ps) => {
                        ps = ps.map(p => {
                          p.user = friend;
                          return p;
                        })
                        this.postsUnGrouped = this.postsUnGrouped.concat(ps);
                      }
                    )

                }
              )
          })
        },
        (err) => {

        }
      )

    setTimeout(() => {
      this.facebookService.getProfileById(this.localStorageService.get("userId") ?? '')
        .subscribe(
          (user) => {
            this.facebookService.getPosts(user.userId)
              .subscribe(
                (ps) => {
                  ps = ps.map(p => {
                    p.user = user;
                    return p;
                  })
                  this.postsUnGrouped = this.postsUnGrouped.concat(ps);
                },
                (err) => { }
              )
          }
        )
    }, 1000);

    setTimeout(() => {
      this.postsUnGrouped = this.postsUnGrouped.map(
        post => {
          this.facebookService.getLikes(post.postId)
            .subscribe(
              (resp) => {
                post.likes = resp.count;
              }
            )
          this.facebookService.checkLike(post.postId)
            .subscribe(
              (resp) => {
                post.isLiked = resp.check;
              }
            )
          post.dateTime = new Date(post.timestamp);
          return post;
        }
      )

    }, 2000);

    setTimeout(() => {
      this.showLoading = false;
      if (this.animation != null) this.animation.destroy();
      if (this.postsUnGrouped.length == 0)
        this.loadEmptyAnimation();
      this.posts = this.postsUnGrouped.sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());
      this.postsUnGrouped = [];
    }, 2500);
  }

  handleLike(postId: string) {
    let index = this.posts.findIndex(post => post.postId === postId);
    this.posts[index].likes += (this.posts[index].isLiked) ? -1 : 1;

    if (this.posts[index].isLiked) {
      this.facebookService.deleteLike(postId)
        .subscribe((succ) => { }, (err) => { this.posts[index].likes += 1; this.posts[index].isLiked = true; });
    }
    else {
      this.facebookService.likePost(postId)
        .subscribe((succ) => { }, (err) => { this.posts[index].likes -= 1; this.posts[index].isLiked = false; });
    }

    this.posts[index].isLiked = !this.posts[index].isLiked;
  }

  getProfileById() {
    this.facebookService.getProfileById(this.localStorageService.get("userId") ?? "")
      .subscribe(
        (res) => {
          this.userProfile = res;
        }
      )
  }

  formatDateTime(dateTime: Date): string {
    const datePart =
      dateTime.toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric'
      }); const timePart =
        dateTime.toLocaleTimeString(undefined, {
          hour: '2-digit', minute:
            '2-digit', hour12: true,
        }); return `${datePart}, ${timePart}`;
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

  loadEmptyAnimation() {
    this.animation = lottie.loadAnimation({
      container: this.el.nativeElement.querySelector('#lottie-loader2'), // ID of the container element
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '../../assets/no-posts-lottie.json',
    });
  }
}
