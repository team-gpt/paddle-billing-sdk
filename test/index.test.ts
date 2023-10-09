import { describe, expect, it } from 'bun:test'

import { PaddleClient } from '../src'
import { prepareQuery, stringifyQuery } from '../src/endpoints/base'

describe('should', () => {
  it('export PaddleClient', () => {
    expect(PaddleClient).toBeDefined()
  })
})

describe('stringifyQuery', () => {
  it('should return a string for a string input', () => {
    expect(stringifyQuery('test')).toEqual('test')
  })

  it('should return a string for a number input', () => {
    expect(stringifyQuery(123)).toEqual('123')
  })

  it('should return a string for a boolean input (true)', () => {
    expect(stringifyQuery(true)).toEqual('true')
  })

  it('should return a string for a boolean input (false)', () => {
    expect(stringifyQuery(false)).toEqual('false')
  })

  it('should return a comma separated string for an array input', () => {
    expect(stringifyQuery(['draft', 'active'])).toEqual('draft,active')
  })
})

describe('prepareQuery', () => {
  it('should return undefined for an undefined input', () => {
    expect(prepareQuery()).toEqual(undefined)
  })

  it('should return an object with the same properties but with string values', () => {
    const params = { status: ['draft', 'active'], another: 123, valid: true }
    const expected = { status: 'draft,active', another: '123', valid: 'true' }
    expect(prepareQuery(params)).toEqual(expected)
  })

  it('should return an empty string for an undefined value', () => {
    const params = { status: undefined, another: 123 }
    const expected = { another: '123' }
    expect(prepareQuery(params)).toEqual(expected)
  })
})
