import { Component } from '@angular/core';
import { LocalStorageService } from './shared_service/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'facebook';
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
  ) { }
  ngOnInit(): void {
    if(this.localStorageService.get("token")){
      this.router.navigate(['/home']);
    }
    else {
      this.router.navigate(['/login']);
    }
  }
}
