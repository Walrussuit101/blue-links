/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { LexiconDoc, Lexicons } from '@atproto/lexicon'

export const schemaDict = {
  FyiBluelinksLinks: {
    lexicon: 1,
    id: 'fyi.bluelinks.links',
    defs: {
      main: {
        type: 'record',
        key: 'literal:self',
        record: {
          type: 'object',
          required: ['links'],
          properties: {
            links: {
              type: 'array',
              description: 'Record containing a list of links to display',
              items: {
                type: 'ref',
                ref: 'lex:fyi.bluelinks.links#link',
              },
            },
          },
        },
      },
      link: {
        type: 'object',
        description: 'Represents a single link to display',
        required: ['id', 'url', 'name', 'order', 'createdAt'],
        properties: {
          id: {
            type: 'string',
          },
          url: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          order: {
            type: 'integer',
          },
          createdAt: {
            type: 'string',
            format: 'datetime',
          },
        },
      },
    },
  },
} as const satisfies Record<string, LexiconDoc>

export const schemas = Object.values(schemaDict)
export const lexicons: Lexicons = new Lexicons(schemas)
export const ids = { FyiBluelinksLinks: 'fyi.bluelinks.links' }
