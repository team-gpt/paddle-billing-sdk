import { describe, it, expect } from 'bun:test'
import { PaddleClient } from '../src'

describe('should', () => {
  it('export PaddleClient', () => {
    expect(PaddleClient).toBeDefined()
  })
})
