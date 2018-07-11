import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';

import { AuthenticateService } from '../service/authenticate.service';
declare var require: any
const CurrentPerson = require('graphql-tag/loader!./current.person.graphql')
import { CurrentPersonQuery, currentPersonFieldsFragment } from '../gen/apollo-types'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private currentPerson: currentPersonFieldsFragment | null = null
  private querySubscription: any;

  constructor(
    private apollo: Apollo,
    private router: Router,
    private authenticateService: AuthenticateService
  ) { }

  ngOnInit() {
    const token = this.authenticateService.getToken()
    if (token) {
      this.querySubscription = this.apollo
        .watchQuery<CurrentPersonQuery>({
          query: CurrentPerson
        })
        .valueChanges
        .subscribe( ({data}) => {
          this.currentPerson = data.currentPerson
        }, (error) => {
          console.log("Could not fetch current person")
        });
    }
  }

  logout() {
    this.authenticateService.clearToken()
    this.currentPerson = null
  }

  search(searchInput: string) {
    this.router.navigate(["/articles"], {
      queryParams: {"search": searchInput}
    })
    return false
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
}
