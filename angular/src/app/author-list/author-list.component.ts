import { Component, OnInit } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';

declare var require: any
const AuthorList = require('graphql-tag/loader!./author-list.component.graphql')
import { AuthorListQuery } from '../gen/apollo-types'

const FETCH_SIZE = 4

@Component({
  selector: 'app-author-list',
  templateUrl: './author-list.component.html',
  styleUrls: ['./author-list.component.css']
})
export class AuthorListComponent implements OnInit {
  private authors: object[];
  private pageInfo: {endCursor: string, hasNextPage: boolean}

  private querySubscription: any;
  private feedQuery: QueryRef<AuthorListQuery>;

  constructor(
    private apollo: Apollo,
  ) { }

  ngOnInit() {
    this.feedQuery = this.apollo.watchQuery<AuthorListQuery>({
      query: AuthorList,
      variables: {
        first: FETCH_SIZE,
        after: null
      }
    })

    this.querySubscription = this.feedQuery
      .valueChanges
      .subscribe(({data}) => {
        this.authors = data.allPeople.nodes
        this.pageInfo = data.allPeople.pageInfo
      })
  }

  fetchMore() {
    this.feedQuery.fetchMore({
      variables: {
        first: FETCH_SIZE,
        after: this.pageInfo.endCursor
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) { return prev }
        return {
          ...prev,
          allPeople: {
            ...prev.allPeople,
            nodes: [...prev.allPeople.nodes, ...fetchMoreResult.allPeople.nodes],
            pageInfo: fetchMoreResult.allPeople.pageInfo,
          }
        }
      }
    })
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
}
