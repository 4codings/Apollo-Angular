import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AlertService } from '../service/alert.service';
import omitTypename from '../lib/omitTypename'

declare var require: any
const {
  CurrentProfile: CurrentProfileQuery,
  UpdateProfile: UpdateProfileMutation
} = require('graphql-tag/loader!./profile.component.graphql')
import { CurrentProfile } from './apollo-types/CurrentProfile'
import { UpdateProfile, PersonPatch } from './apollo-types/UpdateProfile'
import { currentProfileFields } from './apollo-types/currentProfileFields'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  private querySubscription: any;
  profile: currentProfileFields;  // stores immutable values
  profileForm: FormGroup  // stores mutable values

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
      .watchQuery<CurrentProfile>({
        query: CurrentProfileQuery
      })
      .valueChanges
      .subscribe(({data}) => {
        this.profile = data.currentPerson
        this.resetForm()
      });
  }

  resetForm() {
    this.profileForm.reset({
      firstName: this.profile.firstName,
      lastName:  this.profile.lastName,
      about:     this.profile.about,
    })
  }

  get firstName() { return this.profileForm.get('firstName') }

  submit() {
    const newProfile: PersonPatch = {
      ...omitTypename(this.profile),
      ...this.profileForm.value,
    }

    this.apollo.mutate({
      mutation: UpdateProfileMutation,
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
    })
    .subscribe(({data}) => {
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
