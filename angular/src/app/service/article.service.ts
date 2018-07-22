import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client'
import { FetchResult } from 'apollo-link'

declare var require: any
const {
  UpdatePost: UpdatePostMutation,
  CreatePost: CreatePostMutation,
  QueryPost: QueryPostQuery
} = require('graphql-tag/loader!./article.service.graphql')
import { QueryPost } from './apollo-types/QueryPost'
import { UpdatePost, PostPatch, UpdatePost_updatePostById_post } from './apollo-types/UpdatePost'
import { CreatePost, CreatePostInput, CreatePost_createPost_post } from './apollo-types/CreatePost'

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  constructor(
    private apollo: Apollo,
  ) { }

  queryPost(id: number): Observable<ApolloQueryResult<QueryPost>> {
    return this.apollo
      .watchQuery<QueryPost>({
        query: QueryPostQuery,
        variables: {
          id: id
        }
      })
      .valueChanges
  }

  updatePost(postPatch: PostPatch, optimisticPost: UpdatePost_updatePostById_post = null): Observable<FetchResult<UpdatePost>> {
    const optimisticResponse = (optimisticPost) ? {
      updatePostById: {
        __typename: 'UpdatePostPayload',
        post: {
          __typename: 'Post',
          ...optimisticPost
        }
      }
    } : null

    return this.apollo.mutate({
      mutation: UpdatePostMutation,
      variables: {
        input: {
          id: postPatch.id,
          postPatch: postPatch
        }
      },
      optimisticResponse: optimisticResponse
    })
  }

  createPost(post: CreatePostInput, optimisticPost: CreatePost_createPost_post = null): Observable<FetchResult<CreatePost>> {
    const optimisticResponse = (optimisticPost) ? {
      createPost: {
        __typename: 'CreatePostPayload',
        post: {
          __typename: 'Post',
          ...post,
          createdAt: String(new Date())  // Optimistic Guess
        },
      }
    } : null

    return this.apollo.mutate({
      mutation: CreatePostMutation,
      variables: {
        input: {
          post: post
        }
      },
      optimisticResponse: optimisticResponse
    })
  }
}
