import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';

declare var require: any
const PostList = require('graphql-tag/loader!./article-list.component.graphql')
import { PostListQuery } from '../gen/apollo-types'

const DEFAULT_SIZE = 8;

class Page {
  constructor(disabled: boolean, text: string, first: number, offset: number) {
    this.disabled = disabled,
    this.text = text
    this.queryParams = {first: first, offset: offset}
  }

  disabled: boolean
  text: string
  queryParams: {first: number, offset: number}
}

const max = (x, y) => (x > y) ? x : y

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {
  private posts: any[];
  private totalPosts: number;
  private pages: Page[];
  private previousPage: Page;
  private nextPage: Page;

  private querySubscription: any;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const size   = +params['first'] || DEFAULT_SIZE,
            offset = +params['offset'] || 0

      this.querySubscription = this.apollo
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
          this.pages = Array(noPages).fill(0).map(
            (_, i) => new Page(
              i * size == offset,
              (i + 1).toString(),
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

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
}
