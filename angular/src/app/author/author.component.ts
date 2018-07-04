import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
declare var require: any
const AuthorQuery = require('graphql-tag/loader!./author.component.graphql')
import { Author } from '../gen/apollo-types'

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css']
})
export class AuthorComponent implements OnInit {
  loading: boolean;
  author: any;
  private querySubscription: any;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.querySubscription = this.apollo
      .watchQuery<Author>({
        query: AuthorQuery,
        variables: {
          id: id
        }
      })
      .valueChanges
      .subscribe( ({data, loading}) => {
        this.author = data.personById;
        this.loading = loading;
      });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
}
