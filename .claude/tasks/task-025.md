# Task 025 — Resource Panel Animations

## Objective

Add entrance animations to the Resource Panel, with resource bars animating from zero to their current value on mount. After this task the resource bars fill in visually like gauges powering up.

## Context

- Read `.claude/docs/frontend.md` — ResourcePanel page location
- Read `apps/client/src/shared/motion/stationMotion.ts` — available variants

## Scope

| Action | File |
|--------|------|
| Modify | `apps/client/src/pages/ResourcePanel/ResourcePanel.tsx` |
| Modify | `apps/client/src/pages/ResourcePanel/ResourcePanel.module.scss` |
| Modify | `apps/client/src/domains/resource/components/ResourceBar/ResourceBar.tsx` (or equivalent bar component) |

## Animation Design

**Page enter:** Wrap the page root in `motion.div` using `pageEnter` variant.

**Resource row stagger:** Each resource row uses `panelItem` inside a `panelContainer` wrapper.

**Bar fill animation:** The bar fill element becomes a `motion.div` with:

```ts
initial={{ width: '0%' }}
animate={{ width: `${percentage}%` }}
transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.08 }}
```

Where `percentage` is the current resource level as a percentage of capacity, and `index` is the position in the list (0-based) to create a cascade effect.

**Critical flash:** If a resource is critical (`percentage < 20`), the bar fill also gets a CSS pulse on `background-color` between `--color-critical` and a darker shade:

```css
@keyframes critical-flash {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
}
```

## Unit Tests

- Modify `apps/client/src/domains/resource/components/ResourceBar/ResourceBar.test.tsx` — test that the bar fill has `initial` and `animate` props (or that the component renders without error with a `percentage` and `index` prop)

## Acceptance Criteria

- [ ] Resource rows stagger in on page mount
- [ ] Each bar fill animates from 0% to its current value
- [ ] Bars animate in cascade order (index delay)
- [ ] Critical resource bars show the opacity flash animation
- [ ] Existing ResourcePanel tests still pass
- [ ] `nx test client` passes
- [ ] `nx build client` passes

## Dependencies

- Task 014 (Resource Panel) must be complete
- Task 020 (motion system) must be complete

## Notes
_Fill in after execution._
