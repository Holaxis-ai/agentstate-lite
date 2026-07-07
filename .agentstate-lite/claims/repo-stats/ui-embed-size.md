---
type: Claim
title: >-
  The embedded web UI costs 76,452 gzip bytes (3 assets) against a 409,600-byte
  build gate
status: active
reason: >-
  Summed decoded gzipBase64 lengths across UI_ASSETS in the build-generated
  module
evidence_command: >-
  node --experimental-strip-types -e 'import { UI_ASSETS } from
  "./packages/cli/src/generated/ui-assets.generated.ts"; let t=0; for (const k
  in UI_ASSETS) t+=Buffer.from(UI_ASSETS[k].gzipBase64,"base64").length;
  console.log(t)'
evidence_commit: 1463bbd
timestamp: '2026-07-06T20:23:48.856Z'
---

