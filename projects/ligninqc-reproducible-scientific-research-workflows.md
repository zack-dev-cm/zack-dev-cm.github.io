# LigninQC - Reproducible Scientific Research Workflows

> Research tooling for literature discovery and evidence audits in computational lignin chemistry, with traceable records and extraction schemas.

## Summary
I'm developing LigninQC, a research-data workflow for studying how molecular-model assumptions affect conclusions in lignin chemistry. The current implementation retrieves and normalizes literature metadata, preserves provenance, groups publication versions and prepares screening records and extraction schemas with field-level provenance. Missing evidence and integrity concerns remain visible for human review. The scientific review and quantum-chemistry benchmark are at protocol stage.

## Research engineering contribution
The implemented pipeline retrieves literature metadata, normalizes incomplete records and groups publication versions while retaining retrieval lineage. Missing abstracts and integrity concerns remain visible for review instead of being treated as clean negative evidence.

## Scope of the current work
The delivered work is data acquisition, validation and audit tooling, including traceable extraction schemas. The scientific review and quantum-chemistry benchmark remain at protocol stage.

## Project Figures

![LigninQC workflow from metadata discovery through normalization, version grouping and integrity review to traceable extraction, with missing evidence routed to human review](https://zack-dev-cm.github.io/docs/images/ligninqc-research-workflow.svg)

Workflow illustration. Research in progress; extraction schemas are prepared.

## Project Link
https://zack-dev-cm.github.io/projects/ligninqc-reproducible-scientific-research-workflows.md

## Key Features
- Retrieve literature metadata through a resumable OpenAlex discovery workflow
- Normalize records and group publication versions while preserving source provenance
- Flag missing evidence and retraction signals for human review
- Prepare extraction schemas with field-level provenance and explicit missing-data states

## Tech Stack
- JavaScript
- Node.js
- OpenAlex API
- JSONL
- CSV
- Data validation
