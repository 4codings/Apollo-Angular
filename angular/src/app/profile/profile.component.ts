import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';

declare var require: any
const { CurrentProfile, UpdateProfile } = require('graphql-tag/loader!./profile.component.graphql')
import { CurrentProfileQuery, currentProfileFieldsFragment } from '../gen/apollo-types'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private querySubscription: any;
  private profile: currentProfileFieldsFragment;

  constructor(
    private apollo: Apollo,
  ) { }

  ngOnInit() {
    this.querySubscription = this.apollo
      .watchQuery<CurrentProfileQuery>({
        query: CurrentProfile
      })
      .valueChanges
      .subscribe( ({data}) => {
        this.profile = data.currentPerson
      });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
}
