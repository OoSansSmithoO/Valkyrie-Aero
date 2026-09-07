# Public Asset Review

This checklist records the media that must be cleared before the repository is made public. File presence in the working tree does not establish ownership or redistribution rights.

## Current footprint

- 32 files under `public/`
- Approximately 82 MB total
- No individual file exceeds 15 MB
- Git LFS is not currently required

## Required confirmations

| Asset group | Purpose | Status |
| --- | --- | --- |
| `public/brand/valkyrie-mark.png` | Primary brand mark | Approved for demonstration and public use |
| `public/brand/tucano-*.jpg` | Aircraft photography and line art | Approved for demonstration and public use |
| `public/brand/shahed.jpg` | Threat-system imagery | Approved for demonstration and public use |
| `public/cinematic/*.jpg` | Cinematic still plates | Approved for demonstration and public use |
| `public/cinematic/*.mp4` | Cinematic video plates | Approved for demonstration and public use |
| `public/og.jpg` and `public/x-banner.jpg` | Social sharing artwork | Approved for demonstration and public use |
| `public/__grok/**` | App Builder platform assets | Excluded from the public Git package |

## Release decision

The repository owner confirmed on September 7, 2026 that the listed photographs, videos,
logo, and related media are approved for demonstration and public purposes for this release.

For future additions, choose one outcome for each new asset group:

1. Confirm ownership or an applicable redistribution license.
2. Add the source, author, and license to an attribution file.
3. Replace the asset with cleared media.
4. Exclude the asset and any dependent feature from the public release.
