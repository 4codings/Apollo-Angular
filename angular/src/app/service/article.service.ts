import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client'
import { FetchResult } from 'apollo-link'

declare var require: any
const { UpdatePost, CreatePost, QueryPost } = require('graphql-tag/loader!./article.service.graphql')
import { QueryPostQuery, UpdatePostMutation, CreatePostMutation, PostInput, PostPatch, PostFragment } from '../gen/apollo-types'

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  constructor(
    private apollo: Apollo,
  ) { }

  queryPost(id: number): Observable<ApolloQueryResult<QueryPostQuery>> {
    return this.apollo
      .watchQuery<QueryPostQuery>({
        query: QueryPost,
        variables: {
          id: id
        }
      })
      .valueChanges
  }

  updatePost(postPatch: PostPatch, optimisticPost: PostFragment): Observable<FetchResult<UpdatePostMutation>> {
    const optimisticResponse = {
      updatePostById: {
        __typename: 'UpdatePostPayload',
        post: {
          __typename: 'Post',
          ...optimisticPost
        }
      }
    }

    return this.apollo.mutate({
      mutation: UpdatePost,
      variables: {
        input: {
          id: postPatch.id,
          postPatch: postPatch
        }
      },
      optimisticResponse: optimisticResponse
    })
  }

  createPost(post: PostFragment): Observable<FetchResult<CreatePostMutation>> {
    const optimisticResponse = {
      createPost: {
        __typename: 'CreatePostPayload',
        post: {
          __typename: 'Post',
          ...post,
          createdAt: String(new Date())
        },
      }
    }

    return this.apollo.mutate({
      mutation: CreatePost,
      variables: {
        input: {
          post: post
        }
      },
      optimisticResponse: optimisticResponse
    })
  }
}
