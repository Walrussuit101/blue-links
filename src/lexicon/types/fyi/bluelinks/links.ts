/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from '@atproto/lexicon'
import { lexicons } from '../../../lexicons'
import { isObj, hasProp } from '../../../util'
import { CID } from 'multiformats/cid'

export interface Record {
  /** Record containing a list of links to display */
  links: Link[]
  [k: string]: unknown
}

export function isRecord(v: unknown): v is Record {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    (v.$type === 'fyi.bluelinks.links#main' ||
      v.$type === 'fyi.bluelinks.links')
  )
}

export function validateRecord(v: unknown): ValidationResult {
  return lexicons.validate('fyi.bluelinks.links#main', v)
}

/** Represents a single link to display */
export interface Link {
  id: string
  url: string
  name: string
  description?: string
  order: number
  createdAt: string
  [k: string]: unknown
}

export function isLink(v: unknown): v is Link {
  return (
    isObj(v) && hasProp(v, '$type') && v.$type === 'fyi.bluelinks.links#link'
  )
}

export function validateLink(v: unknown): ValidationResult {
  return lexicons.validate('fyi.bluelinks.links#link', v)
}
