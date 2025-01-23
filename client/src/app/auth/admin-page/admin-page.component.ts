import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/Services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/redux/store';
import { NotificationService } from 'src/app/notification/notification.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {

  constructor(public authservcie: AuthService,  private store: Store<AppState>, private notification: NotificationService) {

  }

  ngOnInit(): void {

  

  }

  logout(){
    this.authservcie.LogOutAdminSide().subscribe();
  }
}
