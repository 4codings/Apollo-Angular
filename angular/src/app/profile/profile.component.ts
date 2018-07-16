import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

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
    private formBuilder: FormBuilder
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
      .subscribe(this.updateForm.bind(this));
  }

  private resetForm() {
    this.profileForm.reset({
      firstName: this.profile.firstName,
      lastName:  this.profile.lastName,
      about:     this.profile.about,
    })
  }

  private updateForm({data}) {
    if (data.currentPerson) {
      const {__typename, ...profile} = data.currentPerson
      this.profile = profile
      this.resetForm()
    }
  }

  private get firstName() { return this.profileForm.get('firstName') }

  private submit() {
    const newProfile: PersonPatch = {
      ...this.profile,
      ...this.profileForm.value
    }

    this.apollo.mutate({
      mutation: UpdateProfile,
      variables: {
        input: {
          id: newProfile.id,
          personPatch: newProfile
        }
      },
      optimisticResponse: newProfile
    }).subscribe(this.updateForm.bind(this))

    return false;
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
}
