import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';
declare var require: any
const PostList = require('graphql-tag/loader!./list.component.graphql')
import { PostListQuery } from '../gen/apollo-types'

const DEFAULT_SIZE = 8;

class Page {
  constructor(disabled: boolean, text: string, first: number, offset: number) {
    this.disabled = disabled,
    this.text = text
    const urlObj = {first: first, offset: offset};
    this.url = "?" + Object.keys(urlObj).map(key => key + '=' + urlObj[key]).join('&')
  }

  disabled: boolean
  text: string
  url: string
}

const max = (x, y) => (x > y) ? x : y

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  private posts: any[];
  private pages: object[];
  private totalPosts: number;
  private previousPage: object;
  private nextPage: object;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const size   = +params['first'] || DEFAULT_SIZE,
            offset = +params['offset'] || 0

      this.apollo
        .watchQuery<PostListQuery>({
          query: PostList,
          variables: {
            first: size,
            offset: offset
          }
        })
        .valueChanges
        .subscribe( ({data}) => {
          this.posts = data.allPosts.nodes
          this.totalPosts = data.allPosts.totalCount
          const noPages = Math.ceil(this.totalPosts / size)
          this.pages = Array(noPages).fill().map(
            (_, i) => new Page(
              i * size == offset,
              i + 1,
              size,
              i * size
            )
          )

          this.previousPage = new Page(
            !data.allPosts.pageInfo.hasPreviousPage,
            "",
            size,
            max(offset - size, 0)
          )

          this.nextPage = new Page(
            !data.allPosts.pageInfo.hasNextPage,
            "",
            size,
            offset + size
          )
        });
    });
  }
}
