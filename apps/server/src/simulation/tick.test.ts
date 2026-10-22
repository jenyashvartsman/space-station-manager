import { describe, expect, it } from 'vitest';

import { applyConsumption } from './tick.js';

describe('applyConsumption', () => {
  it('reduces current by consumptionRate', () => {
    expect(applyConsumption(80, 5, 100)).toBe(75);
  });

  it('clamps to 0 when consumption exceeds current', () => {
    expect(applyConsumption(3, 5, 100)).toBe(0);
  });

  it('clamps to 0 when current is exactly consumptionRate', () => {
    expect(applyConsumption(5, 5, 100)).toBe(0);
  });

  it('does not exceed capacity', () => {
    expect(applyConsumption(100, -10, 100)).toBe(100);
  });

  it('returns 0 when current is already 0', () => {
    expect(applyConsumption(0, 5, 100)).toBe(0);
  });

  it('handles fractional consumption rates', () => {
    expect(applyConsumption(10, 0.5, 100)).toBeCloseTo(9.5);
  });
});
