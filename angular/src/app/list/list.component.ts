import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
declare var require: any
const PostList = require('graphql-tag/loader!./list.component.graphql')
import { PostListQuery } from '../gen/apollo-types'

const DEFAULT_LIMIT = 5

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  posts: any[];
  previousPagination: any;
  nextPagination: any;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute
  ) { }

  pagination(disabled: boolean, urlParams: object) {
    return {
      disabled: disabled,
      url: "?" + Object.keys(urlParams).map(key => key + '=' + urlParams[key]).join('&')
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const first  = +params['first'] || null,
            last   = +params['last'] || null,
            after  = params['after'] || null,
            before = params['before'] || null

      const overrideFirst = (!first && !last && !after && !before) ? DEFAULT_LIMIT : first;

      this.apollo
        .watchQuery<PostListQuery>({
          query: PostList,
          variables: {
            first: overrideFirst,
            last: last,
            after: after,
            before: before
          }
        })
        .valueChanges
        .subscribe( ({data}) => {
          this.posts = data.allPosts.nodes

          const pageInfo = data.allPosts.pageInfo;
          const number = first || last || DEFAULT_LIMIT;

          this.previousPagination = this.pagination(
            !pageInfo.hasPreviousPage,
            {
              last: number,
              before: pageInfo.startCursor
            }
          );
          this.nextPagination = this.pagination(
            !pageInfo.hasNextPage,
            {
              first: number,
              after: pageInfo.endCursor
            }
          );
        });
    });
  }
}
