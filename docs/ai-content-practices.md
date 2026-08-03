# AI content practices

This document is the public substantiation for the AI-related claims on the
[Legal & Transparency](https://project-42.dev/legal-transparency) page. It
describes how Project 42 uses AI in content production: what is gated by human
approval, how multi-model review works, when generation happens, how primary
sources are tracked, and what is not yet automated. It is provider-neutral by
design and does not name specific model deployments or which provider serves
which role; provider references elsewhere on the site do not imply endorsement.

## The human gate

Content generation runs behind a human gate. Automation may research, detect a
change, or draft a proposal; it never publishes one. Publication requires a
person to review the evidence, accept or reject the proposal, and record the
decision. This is an architectural rule enforced by the release process, not a
policy that could be bypassed under pressure or by a future change to a single
component.

## Independent multi-model review

Every unit of generated work runs as a multi-model ensemble before a human ever
sees it. A drafter produces the candidate. An independent verifier, drawn from a
different provider family than the drafter, checks the draft's claims and
sources. An adversary role then attempts to refute the draft: it looks for the
strongest case against the claim, not the weakest.

Independence is enforced in code for one specific pair: a proposal is rejected
if the writer and the factual verifier come from the same provider family, and
separately if the researcher and the writer share a deployment. A proposal must
also draw on at least three distinct model deployments. The adversary role's
independence is recorded in the role profile and reviewed by a person; it is not
machine-checked today.

This process reduces risk. It does not make output infallible. Multi-model and
human review reduce risk; they do not guarantee that every statement is
accurate, complete, current, or appropriate for a given situation.

## Generation happens at publish time, not at runtime

Content generation is a publish-time step, not a runtime one. No learner-facing
page calls a model while a learner is using the site, and no model API key
reaches a browser. What a learner reads is static content that already passed
through drafting, verification, adversarial review, and human approval before
it was released.

## Primary source tracking

Primary sources that ground content claims are tracked in a source registry
with review cadences. Content freshness is checked against that registry so
aging claims can be identified for review.

## What is not automated yet

Some of the workflow above is target architecture rather than a fully closed
loop today. Project 42 states the gap directly rather than letting the
distinction blur:

- The freshness checker reports on aging content, but nothing currently
  consumes that output to trigger a regeneration proposal automatically. The
  loop is not closed.
- A source-change detector that would watch primary sources for drift and
  raise a proposal on its own does not exist yet.
- Automated proposal emission, the step that would turn a detected change into
  a draft for the multi-model review pipeline described above, is not built.
- No virtual instructor media renderer exists.

Today, refreshing content in response to a changed source is a manual trigger,
not an automatic one. The human gate, multi-model review, and publish-time
boundary described above apply to every release regardless of what triggers
it.
