import { ComAtprotoRepoListRecords, ComAtprotoRepoGetRecord, ComAtprotoRepoCreateRecord, ComAtprotoRepoDeleteRecord } from '@atproto/api'

/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { XrpcClient, FetchHandler, FetchHandlerOptions } from '@atproto/xrpc'
import { schemas } from './lexicons'
import { CID } from 'multiformats/cid'
import * as FyiBluelinksLinks from './types/fyi/bluelinks/links'

export * as FyiBluelinksLinks from './types/fyi/bluelinks/links'

export class AtpBaseClient extends XrpcClient {
  fyi: FyiNS

  constructor(options: FetchHandler | FetchHandlerOptions) {
    super(options, schemas)
    this.fyi = new FyiNS(this)
  }

  /** @deprecated use `this` instead */
  get xrpc(): XrpcClient {
    return this
  }
}

export class FyiNS {
  _client: XrpcClient
  bluelinks: FyiBluelinksNS

  constructor(client: XrpcClient) {
    this._client = client
    this.bluelinks = new FyiBluelinksNS(client)
  }
}

export class FyiBluelinksNS {
  _client: XrpcClient
  links: LinksRecord

  constructor(client: XrpcClient) {
    this._client = client
    this.links = new LinksRecord(client)
  }
}

export class LinksRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    params: Omit<ComAtprotoRepoListRecords.QueryParams, 'collection'>,
  ): Promise<{
    cursor?: string
    records: { uri: string; value: FyiBluelinksLinks.Record }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'fyi.bluelinks.links',
      ...params,
    })
    return res.data
  }

  async get(
    params: Omit<ComAtprotoRepoGetRecord.QueryParams, 'collection'>,
  ): Promise<{ uri: string; cid: string; value: FyiBluelinksLinks.Record }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'fyi.bluelinks.links',
      ...params,
    })
    return res.data
  }

  async create(
    params: Omit<
      ComAtprotoRepoCreateRecord.InputSchema,
      'collection' | 'record'
    >,
    record: FyiBluelinksLinks.Record,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    record.$type = 'fyi.bluelinks.links'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      { collection: 'fyi.bluelinks.links', rkey: 'self', ...params, record },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    params: Omit<ComAtprotoRepoDeleteRecord.InputSchema, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'fyi.bluelinks.links', ...params },
      { headers },
    )
  }
}
