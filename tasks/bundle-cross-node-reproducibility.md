---
type: Task
title: >-
  Committed plugin bundle is not byte-reproducible across node majors (local
  check:plugin-bundle false-stales)
status: todo
priority: '3'
description: >-
  Side finding from the dev-build-bundle-collision unit (2026-07-15, empirical
  on pristine main): the embedded UI assets' gzip bytes differ between node 25
  (local) and node 20 (CI) — zlib DEFLATE output changed across versions;
  gzipDeterministic zeroes mtime/OS but can't normalize the compressor.
  Consequence: npm run check:plugin-bundle on a non-node-20 machine falsely
  reports the committed bundle stale (this also explains why local builds ALWAYS
  dirtied the bundle file, not just sometimes). CI's convergence no-op is
  unaffected (single node version). Fix directions: pin the toolchain via a
  container/volta for the manual check; or compare post-DECOMPRESSION content
  instead of gzip bytes; or store assets uncompressed and gzip at serve time.
  Low urgency once the collision fix lands (default builds no longer touch the
  path).
actor: brian-claude
timestamp: '2026-07-15T16:05:53.048Z'
---

