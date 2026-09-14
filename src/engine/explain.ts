// engine/explain.ts — Re-exports the explanation system from riskScoring.ts
// Explanation generation is co-located with scoring to avoid circular imports.
// This module provides a standalone API for consumers who only need explanations.

export { getRiskTier } from './riskScoring'
