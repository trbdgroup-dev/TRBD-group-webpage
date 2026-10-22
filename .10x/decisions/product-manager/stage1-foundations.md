# Product Manager — stage1-foundations

**Date:** 2026-10-22 · **Spec:** `.10x/specs/2026-10-22-stage1-foundations-design.md`

## Problem
TRBD has no website. Prospective clients (companies hiring workforce, training buyers, energy operators, firms expanding abroad) cannot find or assess the firm.

## Users
- **Prospective client** (primary): understands what TRBD does in under a minute, finds their vertical, contacts the firm.
- **Content writer**: edits all text and images, reviews draft copy, publishes without a developer.
- **Super admin**: manages staff users and settings.

## User stories (stage 1)
1. As a visitor, I see who TRBD is first, then can explore the five verticals.
2. As a visitor, I can open a vertical's page to read its services, how TRBD delivers and common questions.
3. As a visitor, I can email the firm from any page; vertical pages prefill the subject.
4. As a visitor on a phone, every page is readable and nothing scrolls sideways.
5. As a searcher, I can find TRBD and each vertical page in Google with a clear title and description.
6. As the content writer, I can edit any text or image, preview a draft and publish; the site updates within seconds.
7. As the content writer, I can see which vertical copy is Claude's draft awaiting my review.
8. As a super admin, I can add and remove staff users.

## Success criteria
See spec §1. Measured at launch: all e2e and axe checks pass; mobile LCP < 2.5 s on the preview; Search Console shows the sitemap accepted.

## Explicitly not in stage 1
Enquiry form, sign-in for the public, candidate/course features, articles.
