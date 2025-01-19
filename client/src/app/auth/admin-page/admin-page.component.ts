import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/Services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/redux/store';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {

  constructor(public authservcie: AuthService,  private store: Store<AppState>,) {

  }

  ngOnInit(): void {

  }

  logout(){
    this.authservcie.LogOutAdminSide().subscribe();
  }
}
