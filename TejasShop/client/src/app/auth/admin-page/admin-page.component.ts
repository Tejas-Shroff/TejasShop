import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/Services/auth.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {

  constructor(private authservcie: AuthService) {
    
  }

  ngOnInit(): void {

  }

  logout(){
    this.authservcie.LogOutAdminSide().subscribe();
  }
}
