---
type: Convention
title: Roadmap
governs: Roadmap
links:
  contains: Roadmap Item
fields:
  required:
    - title
timestamp: '2026-07-07T19:50:00.000Z'
---
# Roadmap

The spine document: the single top-level roadmap that `contains` the bundle's Roadmap
Items via typed links, making the whole roadmap → item → task chain one filtered query
per hop. Declared after the graph lint (correctly) flagged the spine's contains edges as
undeclared usage — the fix was to declare the vocabulary the data already used, not to
change the data.
