import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { ProfileComponent } from './profile/profile.component';
import { FeedComponent } from './feed/feed.component';
import { FriendsComponent } from './friends/friends.component';
import { CreatePostComponent } from './create-post/create-post.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'feed', component: FeedComponent },
      { path: 'profile/:id', component: ProfileComponent },
      { path: 'friends', component: FriendsComponent },
      { path: 'add-post', component: CreatePostComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule { }
