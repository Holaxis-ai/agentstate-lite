---
type: Recipe
id: personal-task-system
title: Personal Task System
version: "1"
summary: "Declares the Task and Project kinds for a lightweight personal task system."
content_policy: definitions-only
---
# Personal Task System

Installs the portable Task and Project data model. Tasks may stand alone or link to an optional
Project, and may declare dependencies on other Tasks. This definitions-only package carries no Task
or Project instances.

The collaborative board View is intentionally not part of this data-model unit. It can be added to
this package later without changing the stable kind contract.
