import { Component, OnInit } from '@angular/core';

import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
declare var require: any
const AllPostsQuery = require('graphql-tag/loader!./list.component.graphql')
import { AllPosts } from '../gen/apollo-types'

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
      .watchQuery<AllPosts>({ query: AllPostsQuery })
      .valueChanges
      .pipe(
        map(({data}) => data.allPosts.nodes)
      );
  }
}
