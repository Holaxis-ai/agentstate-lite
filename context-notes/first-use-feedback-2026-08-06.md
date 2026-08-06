---
type: Context Note
title: 'First-use feedback: installation, navigation, authoring, and sharing'
actor: openai/codex
timestamp: '2026-08-06T14:31:48.131Z'
---
# Summary

An anonymized first-use session surfaced five product-friction themes. The source conversation was private; this public record deliberately contains no names, Slack links, screenshots, email addresses, or verbatim quotations.

1. Installation scope vocabulary implied machine-wide access even though the implementation used per-user host directories. This is already captured by [the canonical user-scope task](../tasks/user-scope-install-vocabulary.md).
2. Document-reader URLs were difficult to scan and share because document identity lived in query parameters; parent path segments in breadcrumbs were not navigable. This is captured by [the stable document routes task](../tasks/document-route-breadcrumb-navigation.md).
3. Advisory actor identity had to be exported again in each shell. This is captured by [the persistent local actor task](../tasks/persistent-local-actor-identity.md).
4. A successful install and visible View did not make the agent-driven contribution model obvious. The existing [guide](../tasks/guidance-bundle-onboarding.md) and [npm quickstart](../tasks/npm-quickstart-onboarding.md) now carry explicit acceptance evidence for that mental-model handoff.
5. Broader sharing of selected project-plan content, potentially through tools outside Aslite, is a user need but not yet a build-ready solution. It is preserved as [external-sharing research](../research/external-plan-sharing.md).

These are observations and problem statements, not commitments to the suggested implementations.
