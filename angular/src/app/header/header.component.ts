import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';

import { AlertService } from '../service/alert.service';
import { AuthService } from '../service/auth.service';
import { currentPersonFieldsFragment } from '../gen/apollo-types'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private querySubscription: any;
  private currentPerson: currentPersonFieldsFragment;

  constructor(
    private apollo: Apollo,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    if (this.isLoggedIn()) {
      this.authService.currentPerson().subscribe(p => this.currentPerson = p)
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn()
  }

  logout(): void {
    this.authService.logout()
    this.alertService.setAlert("Logged Out")
  }

  search(searchInput: string): boolean {
    this.router.navigate(["/articles"], {
      queryParams: {"search": searchInput}
    })
    return false
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
}
