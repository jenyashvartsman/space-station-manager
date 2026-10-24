import { describe, it, expect } from 'vitest';
import { pageEnter, panelContainer, panelItem, hoverLift } from './stationMotion';

describe('stationMotion', () => {
  describe('pageEnter', () => {
    it('has initial, animate, and exit keys', () => {
      expect(pageEnter).toHaveProperty('initial');
      expect(pageEnter).toHaveProperty('animate');
      expect(pageEnter).toHaveProperty('exit');
    });

    it('starts with opacity 0 and y 12', () => {
      expect(pageEnter.initial).toEqual({ opacity: 0, y: 12 });
    });

    it('animates to opacity 1 and y 0', () => {
      expect(pageEnter.animate).toMatchObject({ opacity: 1, y: 0 });
    });

    it('exits to opacity 0 and y -8', () => {
      expect(pageEnter.exit).toMatchObject({ opacity: 0, y: -8 });
    });
  });

  describe('panelContainer', () => {
    it('has animate key', () => {
      expect(panelContainer).toHaveProperty('animate');
    });

    it('defines staggerChildren', () => {
      expect(panelContainer.animate.transition).toMatchObject({ staggerChildren: 0.06 });
    });
  });

  describe('panelItem', () => {
    it('has initial and animate keys', () => {
      expect(panelItem).toHaveProperty('initial');
      expect(panelItem).toHaveProperty('animate');
    });

    it('starts with opacity 0 and y 16', () => {
      expect(panelItem.initial).toEqual({ opacity: 0, y: 16 });
    });

    it('animates to opacity 1 and y 0', () => {
      expect(panelItem.animate).toMatchObject({ opacity: 1, y: 0 });
    });
  });

  describe('hoverLift', () => {
    it('has whileHover key', () => {
      expect(hoverLift).toHaveProperty('whileHover');
    });

    it('lifts by y -3', () => {
      expect(hoverLift.whileHover).toMatchObject({ y: -3 });
    });
  });
});
