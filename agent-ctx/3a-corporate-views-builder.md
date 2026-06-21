# Task 3a — corporate-views-builder

## Summary
Built the 5 corporate view components for the Meridian Advisory site:
- `src/components/views/home-view.tsx`
- `src/components/views/about-view.tsx`
- `src/components/views/services-view.tsx`
- `src/components/views/contact-view.tsx`
- `src/components/views/careers-view.tsx`

## Key decisions
- All views `"use client"` and use `useNav` for navigation.
- Used `Reveal`, `Eyebrow`, `SectionHeading`, `Icon` from `@/components/site/*`.
- Used shadcn `Button`, `Card`, `Badge`, `Input`, `Label`, `Textarea`, `Select`, `Accordion`, `Dialog`, `useToast`.
- Forms use controlled state with manual validation (no react-hook-form overhead).
- POST endpoints: `/api/contact` (topic ∈ general|services|partnership|press), `/api/careers` (roleSlug + roleTitle pre-filled from opened role).
- All navigation uses `useNav((s) => s.navigate)`; no Link, no router, all single-route.
- Color discipline: emerald primary + amber accent only — no indigo/blue/purple.
- Mobile-first: grids collapse 4→2→1, touch targets ≥44px, headings scale `text-4xl→6xl`.

## Verification
- `bun run lint`: 0 errors, 0 warnings in my files (only a pre-existing warning in benchmark-quiz-view.tsx).
- `curl http://localhost:3000/`: HTTP 200.
- dev.log: clean compile, no errors.

## Notes for downstream agents
- The contact and careers POST endpoints (`/api/contact`, `/api/careers`) are referenced from these views; the bodies match the contract in worklog.md. Forms handle network errors via toast.
- The careers apply dialog uses `role.slug` and `role.title` from the CAREERS content array — make sure `/api/careers` accepts `roleSlug` and `roleTitle` as documented.
- `bg-grid`, `bg-radial-fade`, `mask-fade-b` utility classes from `globals.css` are used heavily for hero backgrounds.
