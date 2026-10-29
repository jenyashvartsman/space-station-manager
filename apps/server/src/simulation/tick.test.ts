import { describe, expect, it } from 'vitest';

import { advanceHealing, advanceRepair, applyConsumption } from './tick.js';

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

describe('advanceRepair', () => {
  it('increments progress by 100/3 per tick', () => {
    expect(advanceRepair(0)).toBeCloseTo(100 / 3);
  });

  it('accumulates over 3 ticks to reach 100', () => {
    let progress = 0;
    for (let i = 0; i < 3; i++) {
      progress = advanceRepair(progress);
    }
    expect(progress).toBeCloseTo(100);
  });

  it('reaches or exceeds 100 after 3 ticks', () => {
    const nearComplete = (100 / 3) * 2;
    expect(advanceRepair(nearComplete)).toBeGreaterThanOrEqual(100);
  });

  it('starts from a non-zero progress value', () => {
    expect(advanceRepair(50)).toBeCloseTo(50 + 100 / 3);
  });
});

describe('advanceHealing', () => {
  it('increments health by 25 per tick', () => {
    expect(advanceHealing(50)).toBe(75);
  });

  it('clamps to 100 when health would exceed maximum', () => {
    expect(advanceHealing(90)).toBe(100);
  });

  it('returns 100 when health is already at maximum', () => {
    expect(advanceHealing(100)).toBe(100);
  });

  it('accumulates over 4 ticks from 0 to 100', () => {
    let health = 0;
    for (let i = 0; i < 4; i++) {
      health = advanceHealing(health);
    }
    expect(health).toBe(100);
  });
});
