import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';

declare var require: any
const PostList = require('graphql-tag/loader!./article-list.component.graphql')
import { PostListQuery, PostListQueryVariables, postFields2Fragment } from '../gen/apollo-types'

const DEFAULT_SIZE = 8;

interface Page {
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
  private posts: postFields2Fragment[];
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
      const qParams: PostListQueryVariables = {
        first:  +params['first']  || DEFAULT_SIZE,
        offset: +params['offset'] || 0,
        search:  params['search'] || ""
      }

      this.search = qParams.search

      this.querySubscription = this.apollo
        .watchQuery<PostListQuery>({
          query: PostList,
          variables: qParams
        })
        .valueChanges
        .subscribe( ({data}) => {
          this.posts = data.searchPosts.nodes
          this.totalPosts = data.searchPosts.totalCount
          const numPages = Math.ceil(this.totalPosts / qParams.first)
          this.pages = Array(numPages).fill(0).map((_, i) => {
            return {
              disabled: (i * qParams.first == qParams.offset),
              text: (i + 1).toString(),
              queryParams: {
                ...qParams,
                offset: i * qParams.first
              }
            }
          })

          this.previousPage = {
            disabled: !data.searchPosts.pageInfo.hasPreviousPage,
            text: "",
            queryParams: {
              ...qParams,
              offset: max(qParams.offset - qParams.first, 0)
             }
          }

          this.nextPage = {
            disabled: !data.searchPosts.pageInfo.hasNextPage,
            text: "",
            queryParams: {
              ...qParams,
              offset: qParams.offset + qParams.first
            }
          }
        });
    });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
}
