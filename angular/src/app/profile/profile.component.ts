import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AlertService } from '../service/alert.service';

declare var require: any
const { CurrentProfile, UpdateProfile } = require('graphql-tag/loader!./profile.component.graphql')
import { CurrentProfileQuery, currentProfileFieldsFragment, PersonPatch } from '../gen/apollo-types'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  private querySubscription: any;
  private profile: currentProfileFieldsFragment;  // stores immutable values
  private profileForm: FormGroup  // stores mutable values

  constructor(
    private apollo: Apollo,
    private formBuilder: FormBuilder,
    private alert: AlertService,
  ) {
    this.profileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName:  '',
      about:     '',
    })
  }

  ngOnInit() {
    this.querySubscription = this.apollo
      .watchQuery<CurrentProfileQuery>({
        query: CurrentProfile
      })
      .valueChanges
      .subscribe(({data}) => {
        this.profile = data.currentPerson
        this.resetForm()
      });
  }

  private resetForm() {
    this.profileForm.reset({
      firstName: this.profile.firstName,
      lastName:  this.profile.lastName,
      about:     this.profile.about,
    })
  }

  private get firstName() { return this.profileForm.get('firstName') }

  private submit() {
    const newProfile: PersonPatch = {
      ...this.profile,
      ...this.profileForm.value,
    }

    this.apollo.mutate({
      mutation: UpdateProfile,
      variables: {
        input: {
          id: newProfile.id,
          personPatch: newProfile,
        }
      },
      optimisticResponse: {
        updatePersonById: {
          __typename: 'UpdatePersonPayload',
          person: {
            __typename: 'Person',
            ...newProfile
          }
        }
      }
    }).subscribe(({data}) => {
      this.profile = data.updatePersonById.person
      this.resetForm()
      this.alert.setAlert("Updated Profile")
    })

    return false;
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
}
