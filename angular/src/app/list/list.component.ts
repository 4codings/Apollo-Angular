import { Component, OnInit } from '@angular/core';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

export type Author = {
  id: number;
  fullName: string;
}

export type Post = {
  id: number;
  headline: string;
  summary: string;
  topic: string;
  personByAuthorId: Author;
}

export type Nodes = {
  nodes: Post[]
}

export type Query = {
  allPosts: Nodes
}

const AllPosts = gql`
  query {
    allPosts(first: 5) {
      nodes {
        id
        topic
        headline
        summary
        personByAuthorId {
          id
          fullName
        }
      }
    }
  }
`

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
      .watchQuery<Query>({ query: AllPosts })
      .valueChanges
      .pipe(
        map(({data}) => data.allPosts.nodes)
      );
  }
}
