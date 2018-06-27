import { Component, OnInit } from '@angular/core';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
declare var require: any
const AllPosts = require('graphql-tag/loader!./list.component.graphql')
import { AllPostsQuery } from '../gen/apollo-types'

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  posts: Observable<any[]>;

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.posts = this.apollo
      .watchQuery<AllPostsQuery>({ query: AllPosts })
      .valueChanges
      .pipe(
        map(({data}) => data.allPosts.nodes)
      );
  }
}
