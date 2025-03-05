import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
  isAuthenticated$!: Observable<boolean>;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    // console.log(this.isAuthenticated$)
    this.authService.loginRequired$.subscribe(required => {
      if (required) {
        this.openSignInDialog();
      }
    });
  }

  openSignInDialog(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Login successful');
      }
    });
  }

  logout(): void {
    this.authService.logout();
    console.log('Logged out');
  }
}
