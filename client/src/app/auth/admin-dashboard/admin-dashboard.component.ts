import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/Services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  constructor(public authservcie: AuthService,){}
  
  logout() {
    this.authservcie.LogOutAdminSide().subscribe();
  }

}
