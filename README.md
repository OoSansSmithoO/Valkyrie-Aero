# Valkyrie Aero

Public-facing website for Valkyrie Aero's military aviation training and emerging tactical-aviation capabilities.

The site presents Valkyrie's existing operational foundation—military air-school instruction, cadet and foundational flight training, Joint Terminal Attack Controller training, Undergraduate Pilot Training, Introduction to Fighter Fundamentals, and advanced mission-focused instruction—alongside the developing A-29 Gunslinger counter-UAS concept.

## Mission areas

- Cadet and foundational military flight training
- Undergraduate Pilot Training (UPT)
- Introduction to Fighter Fundamentals (IFF)
- Advanced mission-specific pilot instruction
- JTAC and close-air-support training
- Simulator, mission-rehearsal, and performance-assessment systems
- Emerging A-29 Super Tucano counter-UAS concepts

## Experience

- Responsive Valkyrie Aero website for desktop and mobile
- Cinematic flight-operations briefing
- Interactive A-29 gimbal demonstration
- Aircraft, training, systems, and mission-readiness sections
- Search and social-sharing metadata with a custom preview card
- Accessible reduced-motion and keyboard entry paths

## Technology

- React 19 and TypeScript
- Vite and TanStack Start/Router
- Tailwind CSS
- Three.js and React Three Fiber
- Node.js test runner, ESLint, and Playwright smoke checks

## Local development

Node.js 22 or newer is recommended.

```powershell
npm.cmd ci
npm.cmd run dev
```

The local development server listens on `http://localhost:8080`.

## Verification

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
npm.cmd run smoke
```

The smoke check expects the local development server to be running and verifies desktop and mobile rendering.

## Public-release boundary

This repository is intended for the public website and its supporting public assets. It is not a repository for classified, export-controlled, proprietary, or operationally sensitive engineering information.

Before publishing a release, complete the reviews in [`docs/CONTENT-REVIEW.md`](docs/CONTENT-REVIEW.md) and [`docs/ASSET-REVIEW.md`](docs/ASSET-REVIEW.md). Confirm all corporate claims, contract language, contact information, trademarks, photography, video, and third-party media are authorized for public use.

## Deployment

No production hosting target is committed yet. Canonical URLs, sitemap entries, and deployment automation should be added only after the final public hostname and hosting platform are selected.

## Rights

No open-source license has been selected. Unless a license is added, the source code, branding, copy, and media remain all rights reserved.

Created in the USA. Sanchez & Schmitt.
