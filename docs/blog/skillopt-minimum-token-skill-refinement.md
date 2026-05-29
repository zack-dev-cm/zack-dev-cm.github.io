# SkillOpt and the minimum-token way to improve engineering skills

> Today's paper/repo seed: use Microsoft SkillOpt as a practical pattern for refining reusable engineering workflows without spending more tokens on every run.

Canonical URL: https://zack-dev-cm.github.io/docs/blog/skillopt-minimum-token-skill-refinement.md
Source repo: https://github.com/microsoft/SkillOpt
Paper: https://arxiv.org/abs/2605.23904
Discovery style reference: https://t.me/s/gonzo_ML

## TL;DR

SkillOpt treats a natural-language skill as something you can train outside the model: run tasks, score trajectories, edit the skill text, keep only validation-improving edits, and deploy the best skill artifact. The day-to-day engineering version is smaller: keep one workflow document per repeated job, improve it only against a tiny validation set, and stop feeding the model full context once the workflow is stable.

## What They Built

The repo describes SkillOpt as a text-space optimizer for frozen LLM agents. Instead of updating model weights, it updates a skill document through bounded text edits and validation-gated acceptance. The paper reports tests across multiple benchmarks, target models, and execution harnesses including direct chat, Codex, and Claude Code.

The useful artifact shape is explicit: runs produce config, history, runtime state, skill snapshots, step artifacts, and a `best_skill.md` file. That is the part worth adapting for engineering work.

## Why It Matters

Most agent workflows waste tokens by repeatedly rediscovering the same local conventions, commands, file boundaries, and review criteria. SkillOpt points to a better habit: spend tokens during controlled refinement, then reuse the resulting skill document as durable operating memory.

This is especially relevant for portfolio and production-agent work:

- public-surface review can become a reusable skill with validation cases
- GitHub/ClawHub release checks can keep a small accepted-edits history
- CV experiment review can keep separate skills for data, metrics, failure cases, and promotion gates
- blog/paper review can produce one checklist instead of one long chat per paper

## Minimum-Token Engineering Adaptation

Use this when a workflow repeats at least three times.

1. Write the first skill in 30 lines or less: goal, inputs, blocked actions, steps, verification, and stop rule.
2. Create 5-10 validation cases from real work: one easy, three normal, one failure, and one public-surface edge case.
3. Run the skill on those cases. Keep only the transcript fragments that show a wrong decision or missed check.
4. Ask the model for bounded edits to the skill, not a rewrite of the whole workflow.
5. Accept an edit only if it improves the validation cases without weakening safety.
6. Save the accepted version as `best_skill.md` or the repo's local equivalent.
7. In daily use, pass the short skill plus the current task. Do not pass the full historical chat.

The token budget should move from repeated execution to occasional refinement. If the workflow cannot be evaluated with a tiny validation set, it is not ready to become a skill.

## What Not To Do

- Do not paste entire papers, repos, or logs into the model by default.
- Do not optimize a skill from vibes; require validation cases.
- Do not claim SkillOpt benchmark gains for your own workflow without reproducing them.
- Do not let agent-skill papers crowd out applied CV/DL reading. Keep the queue balanced: after one or two AI-agent papers, review a computer-vision or deep-learning paper with a reproducibility gate.

## Blog Queue Rule

This post belongs in the AI-agent lane. The next paper-review slot should be CV/DL unless a source-backed agent paper is urgent enough to justify delaying that balance.

## Links

- [microsoft/SkillOpt](https://github.com/microsoft/SkillOpt)
- [SkillOpt arXiv paper](https://arxiv.org/abs/2605.23904)
- [CV Repro Lab Skills](https://zack-dev-cm.github.io/projects/cv-repro-lab-skills.md)
- [Research Claim Ledger](https://zack-dev-cm.github.io/projects/research-claim-ledger.md)
