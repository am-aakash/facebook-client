import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { FeedComponent } from './feed/feed.component';
import { FriendsComponent } from './friends/friends.component';
import { ProfileComponent } from './profile/profile.component';
import { LocalStorageService } from '../shared_service/local-storage.service';
import { FacebookService } from '../shared_service/facebook.service';
import { SearchComponent } from './search/search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CreatePostComponent } from './create-post/create-post.component';

@NgModule({
  declarations: [
    HomeComponent,
    FeedComponent,
    FriendsComponent,
    ProfileComponent,
    SearchComponent,
    CreatePostComponent,
  ],
  providers: [LocalStorageService, FacebookService],
  imports: [CommonModule, HomeRoutingModule, ReactiveFormsModule],
})
export class HomeModule {}
