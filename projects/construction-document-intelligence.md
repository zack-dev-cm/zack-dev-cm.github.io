# Construction Document Intelligence

> Multi-document plan analysis that links extracted quantities to source pages and keeps specialist decisions attached to the result.

## Summary
I develop construction-document analysis as part of Riverstart R&D. The workflow interprets complete plan sets, extracts structured quantities and connects each result to the corresponding source page. Persistent review state lets specialists inspect and correct results across a document set. My contribution spans document processing, model orchestration, output contracts and evaluation for expert review.

## Engineering decisions
I separate document observations, quantity calculations and specialist acceptance. Extracted facts retain their source page and location, while schema and unit checks run before deterministic calculation. Missing or unconfirmed dimensions block a quantity from being accepted.

## Review across a document set
The R&D workflow keeps related drawings and review decisions together so a specialist can inspect a result in context and correct it across revisions. This is an evaluation-stage workflow; generated quantities still require source checks and expert acceptance.

## Project Figures

![Conceptual illustration of architectural plan sheets, a selected building region and quantity extraction](https://zack-dev-cm.github.io/docs/images/construction-documents-workflow-v3.webp)

Conceptual illustration of plan interpretation and source-linked quantities; the drawings are invented.

## Project Link
https://zack-dev-cm.github.io/projects/construction-document-intelligence.md

## Key Features
- Analyze related drawings as a complete document set
- Validate observations and units before calculating quantities
- Link quantities to source pages for checking
- Preserve specialist review decisions across revisions

## Tech Stack
- Python
- Document AI
- OCR
- Vision-language models
- Structured Outputs
- Evaluation
