# Construction Document Intelligence

> Multi-document plan analysis that links structured quantities to source pages and preserves results for specialist review.

## Summary
I develop construction-document analysis as part of Riverstart R&D. The workflow processes related plan documents, records structured observations and connects calculations to their source pages. Saved analysis results and source references support repeatable specialist review. My contribution spans document processing, model orchestration, output contracts and evaluation.

## Engineering decisions
I separate document observations, quantity calculations and specialist acceptance. Extracted facts retain their source page and location, while schema and unit checks run before deterministic calculation. Missing or unconfirmed dimensions block a quantity from being accepted.

## Review across a document set
The R&D workflow keeps related drawings, saved observations, source pages and open questions together for specialist review. Generated quantities still require source checks and expert acceptance.

## Project Figures

![Conceptual illustration of architectural plan sheets, a selected building region and quantity extraction](https://zack-dev-cm.github.io/docs/images/construction-documents-workflow-v3.webp)

Conceptual illustration of plan interpretation and source-linked quantities; the drawings are invented.

## Project Link
https://zack-dev-cm.github.io/projects/construction-document-intelligence.md

## Key Features
- Analyze related drawings as a complete document set
- Validate observations and units before calculating quantities
- Link quantities to source pages for checking
- Preserve analysis results and source references for repeatable review

## Tech Stack
- Python
- Document AI
- OCR
- Vision-language models
- Structured Outputs
- Evaluation
