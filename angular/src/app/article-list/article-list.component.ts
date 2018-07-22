import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';

import { AuthService } from '../service/auth.service';

declare var require: any
const PostListQuery = require('graphql-tag/loader!./article-list.component.graphql')
import { PostList, PostListVariables } from './apollo-types/PostList'
import { RichPostFields } from './apollo-types/RichPostFields'

const DEFAULT_SIZE = 8;

interface Page {
  disabled: boolean
  text: string
  queryParams: PostListVariables
}

const max = (x, y) => (x > y) ? x : y

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {
  posts: RichPostFields[];
  totalPosts: number;
  search: String = "";
  currentId: number;

  pages: Page[];
  previousPage: Page;
  nextPage: Page;

  private querySubscriptions: any[] = [];

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const qParams: PostListVariables = {
        first:  +params['first']  || DEFAULT_SIZE,
        offset: +params['offset'] || 0,
        search:  params['search'] || ""
      }

      this.search = qParams.search

      this.querySubscriptions.push(this.auth.currentPerson()
        .subscribe( (currentPerson) => { this.currentId = currentPerson.id } ))

      this.querySubscriptions.push(this.apollo
        .watchQuery<PostList>({
          query: PostListQuery,
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
        }));
    });
  }

  ngOnDestroy() {
    this.querySubscriptions.forEach(
      querySubscription => querySubscription.unsubscribe()
    )
  }
}
