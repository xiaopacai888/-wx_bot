/**
 *   Wechaty Chatbot SDK - https://github.com/wechaty/wechaty
 *
 *   @copyright 2016 Huan LI (李卓桓) <https://github.com/huan>, and
 *                   Wechaty Contributors <https://github.com/wechaty>.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
import { ContactImpl } from './contact.js'

import { log }  from 'wechaty-puppet'
import type * as PUPPET from 'wechaty-puppet'

import type { Contact } from './contact.js'
import type { Constructor } from '../deprecated/clone-class.js'
import { validationMixin } from '../user-mixins/validation.js'
import type { Sayable } from '../interface/sayable.js'

import {
  EmptyBase,
  wechatifyMixin,
}                       from '../user-mixins/wechatify.js'

/**
 * There have three types of a Post:
 *
 *  1. Original (原创)
 *  2. Comment (评论)
 *  3. ReTweet / RePost (转发)
 *
 *  | Type             | Root ID  | Parent ID  |
 *  | ---------------- | -------- | ---------- |
 *  | Original         | n/a      | n/a        |
 *  | Comment          | `rootId` | `parentId` |
 *  | Repost / ReTweet | n/a      | `parentId` |
 *
 */
interface PostPayload {
  id        : string
  parentId? : string  // `undefined` means it's not a retweet/repost
  rootId?   : string  // `undefined` means itself is ROOT

  contactId: string
  timestamp: number

  descendantCounter? : number
  tapCounter?        : number

  // The liker information need to be fetched from another API

  messageIdList: Sayable | string[]  // The message id for this post.
}

enum PostTapType {
  Unspecified = 0,
  Like,
}

type PostTapListPayload = {
  [key in PostTapType]?: {
    contactId: string[]
    timestamp: number[]
  }
}

/**
 * Google Cloud APIs - Common design patterns  - List Pagination
 * @see https://cloud.google.com/apis/design/design_patterns#list_pagination
 */
interface PaginationRequest {
  pageSize?      : number
  pageToken?     : string
}

interface PaginationResponse<T> {
  nextPageToken? : string
  response: T
}

interface IdListPayload {
  idList: string[]
}

class PuppetApi {

  async postTap (postId: string, type: PostTapType): Promise<boolean>
  async postTap (postId: string, type: PostTapType, tap: boolean): Promise<void>

  async postTap (
    postId : string,
    type   : PostTapType,
    tap?   : boolean,
  ): Promise<void | boolean> {
    return true
  }

  async postPayload (
    postId: string,
  ): Promise<PostPayload> {
    return {} as any
  }

  async postTapList (
    postId: string,
    type?: PostTapType,  // undefined means any Tap type
    pagination?: PaginationRequest,
  ): Promise<PaginationResponse<PostTapListPayload>> {
    return {
      nextPageToken: '',
      response: {
        [PostTapType.Like]: {
          contactId: ['id_contact_xxx'],
          timestamp: [12341431],
        },
      },
    }
  }

  async postRootList (
    rootId: string,
    pagination?: PaginationRequest,
  ): Promise<PaginationResponse<string[]>> {
    return {
      nextPageToken: '',
      response: [
        'id_post_xxx',
        'id_post_yyy',
      ],
    }
  }

  async postParentList (
    parentId: string,
    pagination?: PaginationRequest,
  ): Promise<PaginationResponse<string[]>> {
    return {
      nextPageToken: '',
      response: [
        'id_post_xxx',
        'id_post_yyy',
      ],
    }
  }

}

const MixinBase = wechatifyMixin(
  EmptyBase,
)

class PostMixin extends MixinBase {

  /**
   *
   * Create
   *
   */
  public static async create (): Promise<Post> {
    log.verbose('Post', 'create()')

    const payload: PUPPET.payload.Post = {
      authorId: 'todo',
      coverageUrl: 'todo',
      title: 'todo',
      videoUrl: 'todo',
    }

    return new Post(payload)
  }

  /*
   * @hideconstructor
   */
  constructor (
    public readonly payload: PUPPET.payload.Post,
  ) {
    super()
    log.verbose('Post', 'constructor()')
  }

  public async author (): Promise<Contact> {
    const author = await ContactImpl.find(this.payload.contactId)
    if (!author) {
      throw new Error('no author for id: ' + this.payload.contactId)
    }
    return author
  }

  public coverageUrl (): string {
    return this.payload.coverageUrl
  }

  public videoUrl (): string {
    return this.payload.videoUrl
  }

  public title (): string {
    return this.payload.title
  }

}

class PostImpl extends validationMixin(PostMixin)<Post>() {}
interface Post extends PostImpl {}

type PostConstructor = Constructor<
  Post,
  typeof PostImpl
>

export type {
  PostConstructor,
  Post,
}
export {
  PostImpl,
}
