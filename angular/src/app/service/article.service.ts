import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client'
import { FetchResult } from 'apollo-link'

declare var require: any
const { UpdatePost, CreatePost, QueryPost } = require('graphql-tag/loader!./article.service.graphql')
import { QueryPostQuery, UpdatePostMutation, CreatePostMutation, PostFragment } from '../gen/apollo-types'

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  constructor(
    private apollo: Apollo,
  ) { }

  post(id: number): Observable<ApolloQueryResult<QueryPostQuery>> {
    return this.apollo
      .watchQuery<QueryPostQuery>({
        query: QueryPost,
        variables: {
          id: id
        }
      })
      .valueChanges
  }

  updatePost(post: PostFragment): Observable<FetchResult<QueryPostQuery>> {
    return this.apollo.mutate({
      mutation: UpdatePost,
      variables: {
        input: {
          id: post.id,
          postPatch: post
        }
      },
      optimisticResponse: post
    })
  }

  createpost(post: PostFragment): Observable<FetchResult<QueryPostQuery>> {
    return this.apollo.mutate({
      mutation: CreatePost,
      variables: {
        input: {
          post: post
        }
      },
      optimisticResponse: post
    })
  }
}
