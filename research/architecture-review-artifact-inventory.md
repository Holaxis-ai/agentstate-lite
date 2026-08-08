---
type: Research
title: Architecture-review artifact inventory
actor: review-taxonomy-builder
timestamp: '2026-08-08T14:44:14.238Z'
---
# Architecture-review artifact inventory

## Decision card

- **Purpose:** freeze the disclosure-safe evidence universe for the approved architecture-review record-alignment migration.
- **Census cutoff:** `2026-08-08T14:41:15Z`.
- **Governing plan:** `plans/architecture-review-record-alignment` at `sha256:b6ccec33c9daee7182a188916e6a898fdd83618372b0e1da83a59e896b6fc534`.
- **Plan approval:** `reviews/architecture-review-record-alignment-plan-review` at `sha256:b83fe1083094191af30b57fe16c80151d66d05752c61ecbd5ee8d47ff7ba02d2`.
- **Authority:** this Research record is migration audit evidence only. No View, Kind, command, or runtime may consult it as a registry or grouping authority.
- **Outcome:** three families need thin Review wrappers: Mike's architectural-smell investigation, the frozen MCP `Design Review`, and the context-only domain-model architecture review. Existing CLI records are the unchanged positive control. No bulk Context Note migration is justified.
- **Disclosure:** the inventory copies identifiers, public outcome categories, and hashes only. It does not reproduce source-level security mechanics. Any later wrapper must repeat disclosure preflight.

## Mechanical census

The census ran against the live local bundle with autopull disabled after the assigned Task was claimed. Collections and counts:

| Collection | Exact method | Count |
| --- | --- | ---: |
| All Review documents anywhere | `./aslite list --type Review --fields id,type,title,timestamp,status,role,verdict,verdict_subject,target,target_version,evidence_cutoff,family,owner --limit 0` | 15 |
| All documents under `reviews/` regardless of type | `./aslite list --prefix reviews/ --fields id,type,title,timestamp,status,role,verdict,target,target_version --limit 0` | 17 |
| All Review Requests | `./aslite list --type 'Review Request' --fields id,type,title,timestamp,status,reviewer,requested_by,decided_at --limit 0` | 6 |
| All Findings | `./aslite list --type Finding --fields id,type,title,timestamp,status,severity,confidence,priority --limit 0` | 5 |
| Context Note population | `./aslite list --type 'Context Note' --fields id,type,title,timestamp,actor --limit 0` | 460 |
| Context title signal | `rg -l -i '^title:.*((architecture|architectural|design|package).*(review|audit)|(review|audit).*(architecture|architectural|design|package))' .agentstate-lite/context-notes --glob '*.md'` | 51 |
| Context id/path signal | `rg --files .agentstate-lite/context-notes` filtered by the same bidirectional term-pair expression | 47 |
| Context candidate union | deterministic set union of the title and id/path signal results | 55 |

The signal scan nominates candidates; it does not classify them. It deliberately admits orientations, specialist reviews, and phase gates so exclusions are visible instead of silently hidden. It does not scan arbitrary body prose because body mentions would turn backlinks and citations into false candidates.

## Five-part Context Note inclusion test

A Context Note warrants a thin canonical Review wrapper only when all five are true:

1. it freezes a bounded architecture/design target or exact revision;
2. it issues the overall reusable verdict for that target, rather than a specialist, QA, implementation, or handoff verdict;
3. the verdict should remain independently discoverable after the originating task/session;
4. no canonical Review synthesis is reachable through the live graph; and
5. a wrapper improves discovery without copying findings, inventing authority, or creating work.

The test is content-and-graph based. Title, prefix, timestamp, and filename stem never decide inclusion.

## Version classes

- **Frozen current bytes:** the exact current document bytes are migration inputs and must not be changed by alignment. New wrappers provide backlinks.
- **Mutable current head:** the exact head observed at the cutoff, but the owning workflow may legitimately advance it. The inventory must not present its digest as “latest” later.
- **Historical digest citation:** an external or earlier target/blob digest cited for chronology, not the current head of a bundle record.

## Review-prefix census and family classification

All 15 `type: Review` records are under `reviews/`; none exists elsewhere. The two additional prefix records are the frozen template `Doc` and the legacy MCP `Design Review`.

| Document | Type / family role | Stable root and effective conclusion | Version class | Exact head |
| --- | --- | --- | --- | --- |
| `reviews/architecture-review-record-alignment-plan-review` | Review; synthesis of the implementation-plan review | Root and effective leaf; plan approved, not an approval of later architecture targets | Frozen current bytes | `sha256:b83fe1083094191af30b57fe16c80151d66d05752c61ecbd5ee8d47ff7ba02d2` |
| `reviews/architecture-review-template` | Doc; method authority, not a target review | Method input; no synthesis wrapper needed | Frozen current bytes | `sha256:02e263f4e78d8fd9e9c6d63a634e82d8ce968b5c54f5e8bb01d224a2279abd09` |
| `reviews/architecture-review-template-approval` | Review; exact method approval | Approves the template/domain-model bytes; excluded from architecture-target family cardinality | Frozen current bytes | `sha256:c42d6b3c859df893b8c99792f6709dfb473972aedd9030a04bf3955866f7cead` |
| `reviews/cli-package-architecture-review` | Review; CLI canonical synthesis | Stable CLI root; target verdict remains incomplete/changes required | Frozen current bytes | `sha256:d788ff48d2e4a164666447fb75707c3ca905a9d4094b7046eff83e876394bb14` |
| `reviews/cli-package-architecture-review-approval` | Review; exact report approval | Approves report bytes; does not approve the CLI target | Frozen current bytes | `sha256:353f0fb6880ce39af116943ecebfc5037a09bd466dbba88151bf3090f718e791` |
| `reviews/cli-package-architecture-review-pr224-reconciliation` | Review; addendum | Additional effective evidence line; does not supersede the root or report approval | Frozen current bytes | `sha256:df2df0d994ce94f4a5a89d72315cf5f87175f45e41eac02fe3443bc25dbced52` |
| `reviews/mcp-view-security-model-unification` | Design Review; legacy synthesis source | No canonical `type: Review`; **wrapper candidate 2**. Keep source detail behind disclosure preflight | Frozen current bytes | `sha256:2514b02e947600f01fd3396f9e2e528ae27572e8c0a3caca7385f7c70cf626de` |
| `reviews/okf-extension-evolution-options-standards` | Review; specialist | Specialist input to the OKF-evolution recommendation family | Frozen current bytes | `sha256:2a82b93f00b6070bddb7970b2ccc150b773f72abe50e852c5c0432f3cc0ed090` |
| `reviews/okf-extension-evolution-standards-applicability` | Review; specialist | Specialist input to the OKF-evolution recommendation family | Frozen current bytes | `sha256:87cedc29d64e485802a0f14b58cfc75fb4bcf61cf3faeb3e0a3c5e16387aeaec` |
| `reviews/okf-extension-evolution-recommendation` | Review; canonical synthesis | Stable OKF-evolution root; initial conclusion conditional | Frozen current bytes | `sha256:48d08834cd9976f69f73b5395807ca14617f7b71a74ff4cf7cfb99c0a9713ca2` |
| `reviews/okf-extension-evolution-recommendation-rereview` | Review; rereview | Unique effective leaf for repaired target bytes: PASS | Frozen current bytes | `sha256:fa97d2bacf90c01050e96a02bc03e819a7eed9d1eb3c313f1cba921d81ddd3f5` |
| `reviews/pr-187-project-directory-resolution` | Review; standalone synthesis | Root and effective leaf: changes requested at exact PR target | Frozen current bytes | `sha256:35d9bd1736bc62cc42bd0128d2384e285bba492b84f0ca4334af80442988b26c` |
| `reviews/pre-compact-multi-session-team-2026-08-03` | Review; revision-2 team synthesis | **Exact-target initiative A**; root/effective FAIL for revision 2 | Frozen current bytes | `sha256:e2081f3f9df3c0ec85908a684e24d700b8e0d6c187401278b44e81ecc7730925` |
| `reviews/pre-compact-multi-session-v3-plan-2026-08-03` | Review; revision-3 plan gate | **Exact-target initiative B**; root/effective PASS for revision-3 design+plan | Frozen current bytes | `sha256:f7c065ab383568a968564b84406df2a056b9bb42489dc88ec5462e4db32cc3c3` |
| `reviews/shared-view-document-rendering` | Review; standalone synthesis | Root and effective leaf for the reviewed Design | Frozen current bytes | `sha256:344faba806d8d4972a6292e05f8e3611ccab1c13fac304c4bd2939eb88af4c9c` |
| `reviews/transient-durable-view-unification` | Review; standalone synthesis | Root and effective leaf for the reviewed Design | Frozen current bytes | `sha256:2a7592d36a023a3d9062e6436b30fe3faf393e06f0d9cbbf2e5c538e074fd2f9` |
| `reviews/unified-portable-view-model` | Review; standalone synthesis | Root and effective leaf for the reviewed Design | Frozen current bytes | `sha256:b764c4589aada4d1783de3fe7c9c38feb917373ab3b184a222d49c7ba56b2113` |

### Pre-compaction disposition

The two pre-compaction Reviews are semantically adjacent but graph-disconnected, target different exact design/plan revisions, and each issues a complete verdict. This inventory classifies them as **two exact-target initiatives**, not a single family inferred from stems or chronology. Alignment creates no wrapper and no new link. A future explicit rereview may connect them, but that is outside this migration.

## Review Request census

Review Requests remain named-human workflow authorities, not agent Review syntheses. Their exact versions are mutable current heads even when terminal, because corrections remain workflow-owned.

| Document | Status / role | Version class | Exact head |
| --- | --- | --- | --- |
| `review-requests/board-placement` | changes requested; standalone human request | Mutable current head | `sha256:dfad12d4deb400ea906952cd585e23a7f556aee9e6ad9e019f8564a78d7531f9` |
| `review-requests/cadence-continuous-staging` | canceled; standalone human request | Mutable current head | `sha256:c514c0efb121f94ce2ea6b3c63d7a9fe428082a303463b9813a6e112eda8ba8d` |
| `review-requests/kinds-and-descriptions-architecture` | approved; effective human outcome for the earlier domain-model technical review | Mutable current head | `sha256:85d1aaf3967a4ded3492dc4a4f842ec572b9cc9c44b0e6a5122f00827e5df794` |
| `review-requests/onboarding-surfaces-mike-signoff` | approved; standalone human request | Mutable current head | `sha256:f8bcb075d07d27becc857d85af2a30659af818d61b96d5a6c2e8529904315059` |
| `review-requests/personal-bundle-catalog-product` | requested; standalone human request | Mutable current head | `sha256:28ce4af5ef7e9b4d4b410cb747ed4e33d30e08b044514ee4d6055e3f7328f150` |
| `review-requests/pre3-records-reconciliation` | requested; standalone human request | Mutable current head | `sha256:0f751b7228ea507e815bcad742be151d2ffe97163da492822ef63324d7cba6fb` |

## Finding census: Mike's architectural-smell family

All five Findings belong to one family. The synthesis Finding carries the family decision today, so the family needs a thin canonical Review rather than retyping or copying any Finding.

| Document | Role/disposition | Version class | Exact head |
| --- | --- | --- | --- |
| `findings/architectural-smell-investigation-synthesis` | Family adjudication source; **wrapper candidate 1** | Frozen current bytes | `sha256:7e0b3274aee6cca333c7ff640c75969586e0f32e2069114b1eb74b6d4e767cce` |
| `findings/registered-view-launch-authority-investigation` | Atomic confirmed/promoted finding | Frozen current bytes | `sha256:eaa332484a88dfdbdbae293c772800e72beaa7b2e6b7fa4865f462fbdd1d17fd` |
| `findings/core-import-direction-gate-investigation` | Atomic confirmed/promoted finding | Frozen current bytes | `sha256:82d862a7e3f38f62386ee096bccf6caf608c3a4cf93c7d5ebd53517628bb8c62` |
| `findings/core-server-test-dependency-investigation` | Atomic observe/defer finding | Frozen current bytes | `sha256:dbd63f65c666ced47e3fdcfbdd01206605c99f4149368b678496746bb321376f` |
| `findings/cli-type-only-cycles-investigation` | Atomic observe/defer/closed-as-work finding | Frozen current bytes | `sha256:c84b9eb2157cf79771830802265b06b5f35782559c5b1991074318728d41c019` |

Supporting exact records:

- handoff `context-notes/architectural-smell-audit-handoff` — frozen current `sha256:4fdf0f2361f2cc5892f165720e98564309bdde355bb8730114ab92892efb4bc5`;
- deprecated backlog Claim `claims/architectural-smell-report-remediation` — frozen current `sha256:7fa7cba630bd8f6b6b7271e28be87068e3e00204b923426b01e86f529db4368a`;
- promoted Task `tasks/core-import-direction-gate` — mutable current head `sha256:32e05881c15eb4662404d6c1859d56f7c0f7dff3eeaf307836a9a3caaf9553d0`;
- promoted Task `tasks/registered-view-launch-authority-consolidation` — mutable current head `sha256:b918e47e510ae8bbdbd8cec8f3faabc42a3395e2ad4aef80c18619e72189e131`.

Historical provenance, not current bundle heads:

- PR #224 head `76ed593695d9f712b09e2734c50fa3117097b336`;
- `ARCHITECTURE-SMELLS.md` Git blob `cb86ca5e9ac69f2108bb90d0b919ccd4b67a9905` and file SHA-256 `caa0293596d881283d757ca760ada3d482dd675eb711cac51975ca6d0cd67b5d`;
- survey target main `31921ce157260c5b7245375503059bdd2c4a3bfe`;
- focused-investigation evidence commit `5806ece2c393f1c277f4a17a9006c1ba75eca86b`.

## Context Note candidate dispositions

Every one of the 55 title/path signal matches has a row below. “Exclude” means no wrapper for that Context Note; the record remains evidence. Exact heads are frozen for migration comparison.

| Candidate and exact head | Decision | Five-part result and rationale |
| --- | --- | --- |
| `context-notes/architectural-smell-audit-handoff` — `sha256:4fdf0f2361f2cc5892f165720e98564309bdde355bb8730114ab92892efb4bc5` | Include as Mike evidence; no note wrapper | Fails 2: handoff/orientation, while the synthesis Finding carries the overall adjudication. Mike gets one family wrapper. |
| `context-notes/architecture-domain-model-review-2026-07-13` — `sha256:ef7677811db36ed1b3faf26a6f1f6b5d6c61668feece468262fad99be04083bf` | **Include; wrapper candidate 3** | Passes 1–5: bounded revisions, overall final technical verdict, durable relevance, no Review root, and a chronology-only wrapper can link the later approved human request without copying findings. |
| `context-notes/architecture-review-alignment-orientation` — `sha256:c9da205cb71e6fb854b4026ff761b87d57fbd636b9666dc5529b595eff97146c` | Exclude | Fails 2/4: orientation evidence governed by the approved alignment-plan Review. |
| `context-notes/architecture-review-alignment-portfolio-audit` — `sha256:02cf168449e6d6d7d6c66e630d409f584ee2f9cf688263909fa73324cdbe0d11` | Exclude | Fails 2/4: specialist audit evidence; canonical plan Review exists. |
| `context-notes/architecture-review-alignment-provenance-audit` — `sha256:bdfa5fa5bbe73d0774b11b31824f7b846aaefaa343f31cf45e8610e327426db4` | Exclude | Fails 2/4: skeptic/provenance evidence; canonical plan Review exists. |
| `context-notes/architecture-review-alignment-taxonomy-audit` — `sha256:50b6f75464be0ffdb07646345281b906f9c1398f6c6198f468f48be6919ee468` | Exclude | Fails 2/4: taxonomy evidence; canonical plan Review exists. |
| `context-notes/board-git-package-review-2026-07-15` — `sha256:ed7f8deb097435a5c3565e0b1a182df18025737a1209e55c8ae440035056cead` | Exclude | Fails 3/5: pre-build plan gate; accepted changes were folded into the plan and later shipped records own current state. Wrapper would revive a superseded gate. |
| `context-notes/design-review-mcp-payload-recovery` — `sha256:2c5d6a0d81a66a0ebc65899b13b6d35584b75a6aa68467f234ea18404edbbe77` | Exclude | Fails 2/3/5: phase design-review evidence for an implementation repair, not a durable architecture-family verdict. |
| `context-notes/doc-reader-design-review` — `sha256:78c243fd58a10057d7398f18079439023a2faa67f57f60e4302c1ceb6c9a09c6` | Exclude | Fails 3/5: pre-build gate explicitly folded into revision 2 of Design/Plan. |
| `context-notes/home-surface-design-review` — `sha256:01ffd1376ffae3c1ffc780df08be9e4b88cb916b12f693c2fcb55413f9fdd03f` | Exclude | Fails 3/5: pre-build gate explicitly folded into revised Design/Plan. |
| `context-notes/npm-quickstart-integration-architecture-codex` — `sha256:3d57a8d265e4ed07b9d92249ebaadb4c1a95dc90e63b51facbbb61cdb07e565e` | Exclude | Fails 2/3: integration-plan specialist approval before exact-SHA Review/QA, not final family authority. |
| `context-notes/pr-178-review` — `sha256:feba6911a0d9c9d34f8f9e20a8570898170f5d79f50c5ea9a51e0b5d9f2aa75f` | Exclude | Fails 3/5: exact PR code/design gate; merge/repair workflow owns closure. |
| `context-notes/pr-179-review` — `sha256:47a7f970e638b163acf43229d5ef5fccee2f5ea6ce59d6abbd10686fb805ebfe` | Exclude | Fails 3/5: exact PR code/design gate; merge/repair workflow owns closure. |
| `context-notes/relreader-design-review` — `sha256:553cc2a221d11c5e1454edffe28817ed7ce053d5a225225a876ec38adbf0b81e` | Exclude | Fails 3/5: pre-build gate explicitly folded into its Plan. |
| `context-notes/storage-backend-contract-testkit-design-review` — `sha256:f55ded3e9367c3565c709ae8c746843d56258e86535cb5703aec8512df17173d` | Exclude | Fails 3/5: design-revision gate; revised Design and later task evidence own current state. |
| `context-notes/version-build-identity-pr183-plan-review` — `sha256:8774cc2c4486d121ce35b1028b277173631069529c8d9cc62c6561d83e9e0073` | Exclude | Fails 2/3: implementation-plan gate inside the PR #183 review/QA chain. |
| `context-notes/okf-extension-evolution-architecture-cross-review-start` — `sha256:9e20f051c3f7b272af163f7a3edd841971d144b63b6d03f8e8cabc555eaff023` | Exclude | Fails 2/4: start/orientation evidence; existing OKF Review family owns the verdict. |
| `context-notes/okf-extension-evolution-architecture-cross-review-end` — `sha256:688a6b292ccdf5b9c05d222a594329ee81a6da253245008cc4aa8b8e55728ecb` | Exclude | Fails 2/4: handoff/result evidence; existing OKF Review family owns the verdict. |
| `context-notes/review-precompact-codex-concurrency` — `sha256:bc45d9e293a958288e0bb82bf532ded29e4d8ba7b96cf58a0c52b8fe18eab3ba` | Exclude | Fails 2/4: specialist evidence linked from the revision-2 Review. |
| `context-notes/review-precompact-codex-skeptic` — `sha256:f939457e5392659db0cacbe77ff08cdbca250961f92a094ef34c946dc3e20b6a` | Exclude | Fails 2/4: specialist evidence linked from the revision-2 Review. |
| `context-notes/review-precompact-multisession-codex-20260803` — `sha256:e566c8ce2c75be6c32d2780d393cb9fcf1e7c07c6efb051e4b44a3584ca3e01b` | Exclude | Fails 2/4: orchestration/review-phase evidence; canonical Reviews exist. |
| `context-notes/review-precompact-multisession` — `sha256:a69832b51e88e9922e42a6b7db29703db0ed42ea8ddbab3e514b23a4b69cbe25` | Exclude | Fails 2/4: specialist evidence; canonical Reviews exist. |
| `context-notes/cli-architecture-review-design-reliability-findings` — `sha256:02598ed79b6bf7f26cb8693b8dbba6947bebef9dd6f9a763964c4e2c3e69aea5` | Exclude | Fails 2/4: specialist findings governed by CLI root. |
| `context-notes/cli-architecture-review-design-skeptic-template` — `sha256:49f5b32f848b00675c2cdf2ab7a8862622b4b1846bf2fd4ddb09ab3d4e831481` | Exclude | Fails 2/4: template working evidence; approved method Review exists. |
| `context-notes/cli-architecture-review-empirical-evidence` — `sha256:d3e9849833ce61188ea3e588a7c68f6df6836c16ca5e8aebc5782c66108c07ca` | Exclude | Fails 2/4: evidence input governed by CLI root. |
| `context-notes/cli-architecture-review-exact-draft-review-r1` — `sha256:b4f5701328eee733da6a9ed5a4baea8378a497b242ecee86c81294865bba6a85` | Exclude | Fails 2/4: intermediate reviewer gate; CLI root/approval exist. |
| `context-notes/cli-architecture-review-exact-draft-review-r2` — `sha256:2bd82b8a0bb616ebd52dde4c727e203d47b2d648169b28be56985fd998c01c9f` | Exclude | Fails 2/4: intermediate reviewer gate; CLI root/approval exist. |
| `context-notes/cli-architecture-review-exact-draft-review-r3` — `sha256:a0f25259c67f2dbc3375fb5adbd421ffdbea5d945922bdc516ceaeacf09dd224` | Exclude | Fails 2/4: exact-report reviewer evidence named by approval; not another synthesis. |
| `context-notes/cli-architecture-review-final-qa-r1` — `sha256:a091a006d17acea592263958b2b9e58d0155502089191f05c3ae0839e811918b` | Exclude | Fails 2/4: QA evidence named by CLI approval. |
| `context-notes/cli-architecture-review-final-qa-r2` — `sha256:30265312b3dca989a9c512db74d2c4634449b254249606a88d7c88a6ea29738a` | Exclude | Fails 2/4: QA evidence named by CLI approval. |
| `context-notes/cli-architecture-review-orchestration-reflection` — `sha256:9f3b497a22965a705ac95794cda0bd6a05c62cb487bac3823caa37b990ee3bcb` | Exclude | Fails 2/4: orchestration reflection with canonical CLI family links. |
| `context-notes/cli-architecture-review-orientation-2026-08-07` — `sha256:639ce44be3aa9fad5ba159d70de992e339d5d1c5b993c8e3027c35dbc24c4a78` | Exclude | Fails 2/4: orientation evidence. |
| `context-notes/cli-architecture-review-reorientation-2026-08-07` — `sha256:28fd25c230ca5e2a067c5dfab3af89d7558dcd24007089d48189c78045f387ff` | Exclude | Fails 2/4: reorientation evidence. |
| `context-notes/cli-architecture-review-security-cross-review` — `sha256:47cd166a7a40789698885e4d5d9abb999e1ba7710bd5ed964a230edb77974ae2` | Exclude | Fails 2/4: specialist cross-review governed by CLI root. |
| `context-notes/cli-architecture-review-security-exact-draft-review-r1` — `sha256:c75a1975034091210943d276bc373639b94bf6b8087a5237a6963fe2f7a942d4` | Exclude | Fails 2/4: intermediate security gate. |
| `context-notes/cli-architecture-review-security-exact-draft-review-r2` — `sha256:03aeaf6deb18086630efe975ecf3347b801f4c91232f484133ba1e67981b8ba1` | Exclude | Fails 2/4: intermediate security gate. |
| `context-notes/cli-architecture-review-security-exact-draft-review-r3` — `sha256:bcfaad62b5fa37139212dd931ffeb1490a800efc3351110ea7396e4242fbba87` | Exclude | Fails 2/4: exact-report security evidence named by approval. |
| `context-notes/cli-architecture-review-security-findings` — `sha256:a92bdf5b6e91fc1d392dc553f461a7fcf0ade38d88e6cf3eb511ffb5d450c71a` | Exclude | Fails 2/4: specialist findings governed by CLI root. |
| `context-notes/cli-architecture-review-security-template-review-r1` — `sha256:113a5532645f278ace81f4442d5f858f1225d97659e3c7719f7855b412811331` | Exclude | Fails 2/4: method review round governed by template approval. |
| `context-notes/cli-architecture-review-security-template-review-r2` — `sha256:03c07e87f7bbae869f22b3746359dd38392c6567035f4238f4e681c2cd533101` | Exclude | Fails 2/4: method review round governed by template approval. |
| `context-notes/cli-architecture-review-security-template-review-r3` — `sha256:abf0705790d7b094e6f2f84ea32d09d4f114cd536878c3f43cecc48c1e682728` | Exclude | Fails 2/4: exact method-review evidence named by template approval. |
| `context-notes/cli-architecture-review-security-template` — `sha256:70e4a131531a3e9faf42754368cd7428109fc26e3d13d1a50435739d91b59234` | Exclude | Fails 2/4: template proposal evidence. |
| `context-notes/cli-architecture-review-skeptic-cross-review` — `sha256:b87dac9c69d0dd613c083f1b9de00f059987147335f236ef1eee5f5fdb191bbe` | Exclude | Fails 2/4: specialist cross-review governed by CLI root. |
| `context-notes/cli-architecture-review-skeptic-template-review-r1` — `sha256:8e947e67bfa742a82af21a8bddcffc4d0c0b17311ba6ecb061bd2f2d1c0524e0` | Exclude | Fails 2/4: method review round governed by template approval. |
| `context-notes/cli-architecture-review-skeptic-template-review-r2` — `sha256:1458c37e1d948dbb797eead1534481bb1022c1a09fd017c96fe6ab5c2874de5e` | Exclude | Fails 2/4: method review round governed by template approval. |
| `context-notes/cli-architecture-review-skeptic-template-review-r3` — `sha256:f8603a2503cb77160fb0ce46df15fed7d7eea7d35324a98c61d45c8364046f12` | Exclude | Fails 2/4: exact method-review evidence named by template approval. |
| `context-notes/cli-architecture-review-target-freeze` — `sha256:fdd6953d0862663b70dbad7029c84b02c0d77023c7b058ce95bf77479926b33c` | Exclude | Fails 2/4: target-freeze evidence governed by CLI root. |
| `context-notes/cli-architecture-review-template-synthesis-r1` — `sha256:03af37bbed9cc340ca03275b1ffe3d5775d9db49e96e69050c3341eabe82d9c3` | Exclude | Fails 2/4: intermediate method synthesis; exact template approval exists. |
| `context-notes/cli-architecture-review-template-synthesis-r2` — `sha256:1f97ab5bbe48cf343fd8b9d94d0928d46260d692b3dab4eeed088c7b29fa1d09` | Exclude | Fails 2/4: intermediate method synthesis; exact template approval exists. |
| `context-notes/cli-architecture-review-testing-cross-review` — `sha256:9694f58e303a6d350cc98477da81ba625e4b21e132b506e5e8fb32cf5c524c59` | Exclude | Fails 2/4: specialist cross-review governed by CLI root. |
| `context-notes/cli-architecture-review-testing-findings` — `sha256:74941f5a778f2d9549fc90748b9eb8555e416a4c0840873bd72b06fa2fc770e9` | Exclude | Fails 2/4: specialist findings governed by CLI root. |
| `context-notes/cli-architecture-review-testing-template-review-r1` — `sha256:88e73be2f31a102c309c5ffeea599e355210943f42d8b01fbe5da9ac0f2aaaa8` | Exclude | Fails 2/4: method review round governed by template approval. |
| `context-notes/cli-architecture-review-testing-template-review-r2` — `sha256:49ee7ae9797474545240b71d6b659d8e4fe4144dc06431c446fbdd50d884defb` | Exclude | Fails 2/4: method review round governed by template approval. |
| `context-notes/cli-architecture-review-testing-template-review-r3` — `sha256:47d6e0bd7bb50729b1ac25aa144918dac6adb7485de277f73d434aa6c08beb98` | Exclude | Fails 2/4: exact method-review evidence named by template approval. |
| `context-notes/cli-architecture-review-testing-template` — `sha256:e30924b29ab8a77b666f8b66445e8156bcf6541bf3b7e73b95d5dc5b72eb54c8` | Exclude | Fails 2/4: template proposal evidence. |

Candidate arithmetic: 55 rows = 1 wrapper source + 1 Mike supporting note + 53 exclusions. This table is the stopping boundary; no other Context Note is pulled into migration by title or body inference.

## Wrapper contract

Only these three thin canonical Reviews are authorized by this inventory:

1. **Mike:** `reviews/architectural-smell-investigation`, linking the synthesis Finding, all four atomic Findings, handoff, deprecated Claim, PR #224 provenance, and exactly the two existing promoted Tasks.
2. **MCP security-model unification:** a disclosure-safe Review linking the frozen `Design Review`; no source mechanics copied.
3. **Domain-model review:** a chronology wrapper linking the frozen technical Context Note and the later approved `review-requests/kinds-and-descriptions-architecture`; the earlier changes-requested technical verdict remains visible and the human request is the effective later outcome for its explicit subject.

Thin means decision/provenance/navigation only. Source findings stay in source records. Wrappers must not reinterpret a historical digest as a current head.

## Zero-new-work invariant

Alignment creates **zero new Findings and zero remediation Tasks**. It must not infer work from counts, size, complexity, coverage, or wrapper creation. Mike's only promoted remediation identities remain:

- `tasks/registered-view-launch-authority-consolidation`;
- `tasks/core-import-direction-gate`.

The observe/defer Findings remain observations. No duplicate task is permitted if a current Task head moves after this cutoff.

## Migration and QA assertions

- Recompute all frozen-current hashes before reviewer approval; every value above must match.
- Re-read mutable current heads at wrapper publication and label any drift instead of silently updating this inventory.
- Prove exactly one canonical synthesis for every included architecture-review initiative, with the two pre-compaction exact-target Reviews sampled separately.
- Prove the CLI root/approval/addendum graph is byte-stable.
- Prove deleting or omitting this Research record changes no Review View query, family grouping, or detail rendering.
- Treat any unlisted future Review or unfamiliar metadata as live OKF content, not as an inventory violation.

[governed by approved plan](../plans/architecture-review-record-alignment.md)

[approved by plan review](../reviews/architecture-review-record-alignment-plan-review.md)

[implements inventory task](../tasks/architecture-review-alignment-inventory.md)

[uses taxonomy audit](../context-notes/architecture-review-alignment-taxonomy-audit.md)
