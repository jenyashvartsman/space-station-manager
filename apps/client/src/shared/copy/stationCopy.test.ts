import { describe, it, expect } from 'vitest';
import { stationCopy } from './stationCopy';

describe('stationCopy', () => {
  it('has all top-level keys', () => {
    expect(stationCopy).toHaveProperty('landing');
    expect(stationCopy).toHaveProperty('dashboard');
    expect(stationCopy).toHaveProperty('crew');
    expect(stationCopy).toHaveProperty('modules');
    expect(stationCopy).toHaveProperty('resources');
    expect(stationCopy).toHaveProperty('missions');
    expect(stationCopy).toHaveProperty('events');
    expect(stationCopy).toHaveProperty('reset');
    expect(stationCopy).toHaveProperty('shell');
  });

  it('landing.features has all six keys', () => {
    const { features } = stationCopy.landing;
    expect(features).toHaveProperty('station');
    expect(features).toHaveProperty('crew');
    expect(features).toHaveProperty('modules');
    expect(features).toHaveProperty('resources');
    expect(features).toHaveProperty('missions');
    expect(features).toHaveProperty('events');
  });

  it('modules.offlineWarning returns a string containing the module name', () => {
    const result = stationCopy.modules.offlineWarning('Power Core');
    expect(typeof result).toBe('string');
    expect(result).toContain('Power Core');
  });

  it('resources.critical returns a string containing the resource name', () => {
    const result = stationCopy.resources.critical('Oxygen');
    expect(typeof result).toBe('string');
    expect(result).toContain('Oxygen');
  });

  it('dashboard.statusLabel returns STATUS: NOMINAL', () => {
    expect(stationCopy.dashboard.statusLabel('NOMINAL')).toBe('STATUS: NOMINAL');
  });

  it('all string values are non-empty', () => {
    function checkStrings(obj: unknown, path = ''): void {
      if (typeof obj === 'string') {
        expect(obj.length, `Empty string at ${path}`).toBeGreaterThan(0);
      } else if (typeof obj === 'function') {
        // skip functions — tested individually above
      } else if (obj !== null && typeof obj === 'object') {
        for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
          checkStrings(val, `${path}.${key}`);
        }
      }
    }
    checkStrings(stationCopy, 'stationCopy');
  });
});
