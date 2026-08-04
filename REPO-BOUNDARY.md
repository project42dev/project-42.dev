# Repository boundary

This file states what this repository is for, what must never be added to it,
and where to look instead. It exists because two codebases ended up in the
wrong repositories, and both got there through a directory convention that
nobody enforced.

Governing decision: **ADR-0017**, Orchard and the Foundry layer separation.

## What this is

**The public marketing and entry surface, plus hosted branding and the deployment boundary for the hosted instance.**

- Visibility: **public**

## What must never go here

| Do not add | Because | Where it belongs |
|---|---|---|
| **Learner data, or anything derived from it** | This is an unauthenticated marketing surface. | `account.project-42.dev` |
| **Content authoring** | Presentation consumes released content; it never produces it. | `orchard` |
| **Canonical content** | Duplicating content into a presentation repo is how two versions of the truth appear. | `project42-platform` |

## Looking for something else?

| Looking for | It lives in |
|---|---|
| The content, the content model, and the schemas | `project42-platform` |
| The content lifecycle tool: discovery, authoring, currency | `orchard` |
| The Learn delivery surface | `learn.project-42.dev` |
| The Field Guide delivery surface | `guide.project-42.dev` |
| Learner account and profile | `account.project-42.dev` |
| Owner administration | `admin.project-42.dev` |
| Planning, sprints, ADRs, board records | `project42dev-ops`, private |
| An Azure AI Foundry deployment framework | `homestead-foundry` |
| One owner's Foundry instance and model registry | `my-homestead-foundry` |

## The rule in one line

**This repository is how someone arrives. It never decides what they find.**
