# I did not need another AI research suite. I needed a receipt.

> A field note on turning a giant academic-agent workflow into a small ClawHub skill that checks whether claims are actually supported.

Canonical URL: https://zack-dev-cm.github.io/docs/field-notes/research-claim-ledger-before-another-ai-research-suite.md

The obvious move was to clone an academic research skill, wrap it for Codex, and
publish another "deep research" assistant. That would have been easy to name and
hard to love.

I studied two public repos first:

- https://github.com/Imbad0202/academic-research-skills
- https://github.com/Imbad0202/academic-research-skills-codex

The Claude version is ambitious: research scoping, paper writing, peer review,
revision, integrity gates, disclosure, formatting, and experiment planning. The
Codex version adapts that into one root skill, `academic-research-suite`, with a
router that vendors the workflow files under `ars/`.

It is impressive work. It is also a lot.

The Codex package I inspected vendors hundreds of files into one skill tree. It
has a security report with a large local test pass, syntax checks, JSON checks,
static analysis, and dependency audit. This is the right level of seriousness
for a research pipeline. But it also made the product problem clearer: most
researchers do not wake up wanting a full pipeline. They wake up worried about
one sentence.

"Does this source actually support what I wrote?"

That is the moment I built for.

## The useful primitive was hidden inside the bigger system

Academic-agent suites often advertise breadth: literature review, paper drafting,
peer review, formatting, and publication support. Breadth is useful when a user
has time to enter the system.

The more shareable artifact is narrower:

- extract the important claims,
- map each claim to a source,
- find the locator,
- judge whether the source supports the sentence at that strength,
- repair the dangerous claims first.

That artifact is called a claim ledger.

It is small enough to paste into a supervisor email. It is concrete enough for a
coauthor to review. It is honest enough to say "inaccessible" or "needs human
review" instead of pretending every citation can be verified from a snippet.

## What I shipped

I created a new ClawHub/Codex skill:

`research-claim-ledger`

It does not promise to write a paper. It does not promise publication. It does
not pretend to be a plagiarism detector or a professional legal, medical, or
financial reviewer.

It does one job: turn a draft, literature matrix, notes, citation list, source
packet, or reviewer comments into a source-backed claim ledger.

The default output is intentionally boring:

- a claim ledger summary,
- a claim-by-claim table,
- unsupported or overclaimed claims,
- source gaps,
- a shareable receipt.

The verdict labels are practical: `supported`, `weakly-supported`,
`overclaimed`, `wrong-source`, `missing-locator`, `stale-source`,
`inaccessible`, `unsupported`, and `needs-human-review`.

That last label matters. A research tool that cannot say "this needs a human"
is not a research tool. It is a confidence machine.

## Why this is a better ClawHub wedge

When I searched ClawHub, broad academic and literature-review skills already
existed. That is not a bad sign. It means users search for this category. But it
also means a new skill needs a sharper promise than "academic research".

The claim ledger has a better first-use path:

1. Paste one draft section or upload one literature matrix.
2. Ask for a fast audit.
3. Get a table of risky claims and fixes.
4. Share the receipt with a supervisor or coauthor.

That is a complete loop. No onboarding ceremony, no full pipeline commitment,
no claim that the agent has "done the research" for the author.

## The product lesson

The best reusable skills are often not smaller because the builder was lazy.
They are smaller because the user's trust has to start somewhere.

For academic work, trust starts at the sentence. Not the paper. Not the pipeline.
The sentence.

If a skill can prove one claim is supported, soften one overclaim, and expose one
missing locator before a draft goes out, it has already saved the user from the
kind of mistake that makes academic AI feel risky.

That is the surplus I wanted over a general academic suite: a receipt users can
show.

## How I validated it

The first release is intentionally instruction-only: `SKILL.md` plus
`agents/openai.yaml`. No bundled scripts, no hidden dependencies, no source
scraping helper.

Local checks passed:

- Codex skill validation passed.
- ClawHub install-gate inspection passed with no findings.
- The public ClawHub page resolves and reports a clean static scan.
- The release was reviewed against the existing academic-research repos and
  current ClawHub search surface.

The next improvement is not more automation. It is examples: one ledger from a
draft paragraph, one from a Zotero-style literature matrix, and one from reviewer
comments. If those examples produce useful receipts, then scripts can follow.

Until then, the skill stays small on purpose.
