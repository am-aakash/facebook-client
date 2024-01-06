import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse } from '../models/auth_response';
import { User } from '../models/user';
import { LocalStorageService } from './local-storage.service';
import { Profile } from '../models/profile';
import { FriendEntity, RequestEntity } from '../models/friend';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class FacebookService {
  constructor(private http: HttpClient, private localStorageService: LocalStorageService) { }

  public userMsUri: string = "http://localhost:2002/user/";
  public postMsUri: string = "http://localhost:2003/post/";
  public profileMsUri: string = "http://localhost:2004/profile/";
  public friendMsUri: string = "http://localhost:2006/friend/";
  public friendRequestMsUri: string = "http://localhost:2005/friend-request/";

  register(registerData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      this.userMsUri + "register",
      registerData
    );
  }

  getHeaders(): HttpHeaders {
    // console.log(this.localStorageService.get("userId"));

    return new HttpHeaders({
      "userId": this.localStorageService.get("userId")!,
      "token": this.localStorageService.get("token")!,
    });
  }

  addProfile(registerData: any): Observable<AuthResponse> {
    const options = {
      headers: this.getHeaders()
    };

    return this.http.post<AuthResponse>(
      this.profileMsUri + "add",
      {
        "userId": this.localStorageService.get("userId")!,
        "username": registerData.username,
      },
      options
    );
  }

  login(loginData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      this.userMsUri + "login",
      loginData
    );
  }

  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(this.userMsUri + username);
  }

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(this.userMsUri + "id/" + userId);
  }

  forgotPassword(username: string, email: string): Observable<any> {
    return this.http.get<any>(this.userMsUri + "forgot-password/" + username + "/" + email);
  }

  newPassword(userId: string, password: string): Observable<any> {
    return this.http.get<any>(this.userMsUri + "id/" + userId);
  }

  checkUsername(username: string): Observable<any> {
    return this.http.get(this.userMsUri + "check-username/" + username);
  }

  getProfileById(userId: string): Observable<Profile> {    
    return this.http.get<Profile>(this.profileMsUri + "get-by-id/" + userId, { headers: this.getHeaders() });
  }

  getProfilesByKeyword(keyword: string): Observable<Profile[]> {
    return this.http.get<Profile[]>(this.profileMsUri + "search-profile/" + keyword);
  }

  // Friends APIS

  getFriends(): Observable<FriendEntity[]> {
    return this.http.get<FriendEntity[]>(this.friendMsUri + "get-friends", { headers: this.getHeaders() })
  }

  getCategories(): Observable<String[]> {
    return this.http.get<String[]>(this.friendMsUri + "get-categories/" + this.localStorageService.get("userId")!)
  }

  getFriendsCount(userId: string): Observable<any> {
    return this.http.get(this.friendMsUri + "get-friends-count/" + userId)
  }

  getFriendsByCategory(): Observable<FriendEntity[]> {
    return this.http.get<FriendEntity[]>(this.friendMsUri + "get-friends", { headers: this.getHeaders() })
  }

  checkIfFriend(otherId: string): Observable<any> {
    return this.http.get(this.friendMsUri + "check-friendship/" + this.localStorageService.get("userId") + "/" + otherId)
  }

  // Friend Request APIs

  getRequestsRecieved(): Observable<RequestEntity[]> {
    return this.http.get<RequestEntity[]>(this.friendRequestMsUri + "get-requests/pending", { headers: this.getHeaders() })
  }

  getRequestsSent(): Observable<RequestEntity[]> {
    return this.http.get<RequestEntity[]>(this.friendRequestMsUri + "get-requests-sent/pending", { headers: this.getHeaders() })
  }

  acceptRequest(tapId: string): Observable<any> {
    return this.http.put(this.friendRequestMsUri + "change-status/" + tapId + "/ACCEPTED", null, { headers: this.getHeaders() });
  }

  sendRequest(tapId: string): Observable<any> {
    return this.http.post(this.friendRequestMsUri + "add-request/" + tapId, null, { headers: this.getHeaders() });
  }

  checkIfRequested(otherId: string): Observable<any> {
    return this.http.get(this.friendRequestMsUri + "check-request/" + this.localStorageService.get("userId") + "/" + otherId)
  }

  // Posts APIs

  createPost(form: any): Observable<any> {
    return this.http.post(this.postMsUri + 'create-post', form, { headers: this.getHeaders() } );
  }

  getPosts(userId: string): Observable<Post[]> {
    return this.http.get<Post[]>(this.postMsUri + "get-posts/" + userId);
  }

  getLikes(postId: string): Observable<any> {
    return this.http.get(this.postMsUri + "count-like/" + postId);
  }

  likePost(postId: string): Observable<any> {
    return this.http.get(this.postMsUri + "like/" + postId,  { headers: this.getHeaders() } );
  }

  deleteLike(postId: string): Observable<any> {
    return this.http.get(this.postMsUri + "delete-like/" + postId,  { headers: this.getHeaders() } );
  }

  checkLike(postId: string): Observable<any> {
    return this.http.get(this.postMsUri + "check-like/" + postId,  { headers: this.getHeaders() } );
  }
}
