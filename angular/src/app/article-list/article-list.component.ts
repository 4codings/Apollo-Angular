import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';

declare var require: any
const PostList = require('graphql-tag/loader!./article-list.component.graphql')
import { PostListQuery, PostListQueryVariables, postFieldsFragment } from '../gen/apollo-types'

const DEFAULT_SIZE = 8;

class Page {
  constructor(disabled: boolean, text: string, first: number, offset: number) {
    this.disabled = disabled,
    this.text = text
    this.queryParams = {first: first, offset: offset}
  }

  disabled: boolean
  text: string
  queryParams: PostListQueryVariables
}

const max = (x, y) => (x > y) ? x : y

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {
  private posts: postFieldsFragment[];
  private totalPosts: number;
  private search: String = "";

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
      const size   = +params['first']  || DEFAULT_SIZE,
            offset = +params['offset'] || 0

      this.search =  params['search'] || ""

      this.querySubscription = this.apollo
        .watchQuery<PostListQuery>({
          query: PostList,
          variables: {
            search: this.search,
            first: size,
            offset: offset
          }
        })
        .valueChanges
        .subscribe( ({data}) => {
          this.posts = data.searchPosts.nodes
          this.totalPosts = data.searchPosts.totalCount
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
            !data.searchPosts.pageInfo.hasPreviousPage,
            "",
            size,
            max(offset - size, 0)
          )

          this.nextPage = new Page(
            !data.searchPosts.pageInfo.hasNextPage,
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
