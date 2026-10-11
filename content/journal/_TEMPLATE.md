---
# Copy this file to content/journal/<url-slug>.md — the file name is the URL:
# /journal/<url-slug>. Files starting with "_" are not articles.
#
# Required
title: A question or topic, 39 characters or fewer
description: The answer in one or two sentences, 140 to 160 characters, with a place name or a number in it.
date: 2026-01-01
#
# At least one of these two (docs/seo/struktur.md §8):
#   places: malaga, marbella, fuengirola, vienna, carinthia
#   properties: the seo_slug of a home, e.g. marbella-casa-heredia
places: [malaga]
properties: []
#
# Optional
# updated: 2026-02-01          shown as "Updated", also the sitemap's lastmod
# author: Full Name            leave out for "Frontier Residences Team"
# status: draft                a draft is never built for the live site
# image: /journal/example.webp a file in public/journal/
# imageAlt: What the picture shows
#                              also add example-card.webp (720x480) for lists
# heroLayout: framed          photo beside the headline instead of across the
#                              page — for a photo under ~1400 px wide
# facts: [homes, bedrooms]    numbers under the headline, from the linked homes
#                              (homes, bedrooms, guests); default: all three
#
# In the text: a photo on its own line takes an optional caption,
#   ![alt text](/journal/x.webp "Short caption")
# and a list whose every item starts with a bold label becomes a table.
#
# A date in the future publishes itself on that morning (the site is rebuilt
# every night). Only what is true and checked goes in — no invented place facts.
---

The first paragraph answers the question the title asks. Use `##` for sections
(`#` is shown as a section too — the title is the page's only top-level heading).

## A section

Text. Links to other pages on the site are written as paths, [like this](/vacation-rentals/malaga).
