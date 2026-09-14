// Phase 0 smoke test — verifies the test harness works.
// Real tests are added in Phase 3 (engine unit tests).
import { describe, it, expect } from 'vitest'

describe('Phase 0 smoke test', () => {
  it('test harness is functional', () => {
    expect(1 + 1).toBe(2)
  })
})
