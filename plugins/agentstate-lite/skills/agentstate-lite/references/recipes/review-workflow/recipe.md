---
type: Recipe
id: review-workflow
title: Review Workflow
version: "1"
summary: Durable human review requests with a live, generic evidence Page.
content_policy: definitions-only
pages:
  - registry: pages-registry/review-workflow-reviews.md
    entry: pages/review-workflow/reviews.html
---
# Review Workflow

Install a durable human-review operating model without installing any review instances or project
content. The `Review Request` Kind is the decision authority; the Page is a live, read-only
projection. Agents create and update requests through the generic Kind-aware CLI.
