# LigninQC - Reproducible Scientific Research Workflows

> Check a BDE - antioxidant association and reconcile sulfated-lignin thermal claims with the published tables. Rerun both cases offline.

## Summary
LigninQC connects two scientific questions to inspectable calculations: how state and normalization choices affect an antioxidant association, and whether selected thermal claims agree with a sulfated-lignin table. Version 1.0.0 includes two CC BY article cases, source locations, CSV inputs, Python code, tests and reports in one offline archive.

## Run the included cases
Python 3.10 or later; no pip installation or account required. After downloading, the included cases run offline using only the standard library. On Windows, use py -3 instead of python3.
- [Read the scientific report](https://zack-dev-cm.github.io/docs/ligninqc/2026-09-05/report.html)
- [Download the offline package](https://zack-dev-cm.github.io/docs/ligninqc/2026-09-05/ligninqc-reanalysis-2026-09-05.zip)
- [Verify the download](https://zack-dev-cm.github.io/docs/ligninqc/2026-09-05/SHA256SUMS)
- [Inspect the source tables](https://zack-dev-cm.github.io/docs/ligninqc/2026-09-05/data/sources/source-extracts.html)

1. Download and extract the release archive.
2. Open a terminal in the directory containing the extracted folder.
3. Run the two commands below, then open results/report.html in your browser.

```sh
cd ligninqc-reanalysis-2026-09-05
python3 -m ligninqc reproduce --out results
python3 -m ligninqc verify
```

The run writes results/report.html and results/results.json. To replace a previous nonempty results directory, add --force to the reproduce command. The archive includes version 1.0.0, source locators and the reference output.

## Antioxidant association: what changes with the assumptions?
The Lauberte et al. (2019) case reanalyses published O - H bond dissociation energies and radical-deactivation values. It varies the reported molecular-state mapping, the included compounds and normalization by phenolic OH count. Missing observations remain missing. The report shows how these declared choices change the association; a difference from a rounded published correlation is not by itself evidence of a calculation error.

## Sulfated lignin: do the words and tables agree?
The Kazachenko et al. (2022) case checks selected thermal statements against the reported cumulative mass-loss table and describes the molecular-weight ratios. It preserves the distinction between a table/prose mismatch and an experimentally established error. Changes in GPC eluent, calibration, sulfation and purification limit what an apparent molecular-weight decrease can establish about bond cleavage.

## Scope of the results
This release reanalyses a selected subset of published data. It does not perform new quantum-chemical calculations, independently validate the underlying experiments, estimate field-wide error rates, or measure researcher productivity. Numerical agreement and software checks are reported separately from scientific interpretation.

## Access and reuse
Code is licensed under MIT. Original documentation and analysis are CC BY 4.0. The bundled articles and selected data are CC BY 4.0 with their authors and source locations retained. LICENSE and DATA-LICENSE.md explain these boundaries. No private corpus or account access is needed to run the included cases.

## Project Figures

![Included publication data flows through local Python calculations into a report that separates computed results from interpretation and limits](https://zack-dev-cm.github.io/docs/images/ligninqc-reanalysis-workflow.svg)

Workflow of the included reanalysis. The illustration shows the data path; numerical results are in the linked report.

## Project Link
https://zack-dev-cm.github.io/projects/ligninqc-reproducible-scientific-research-workflows.md

## Key Features
- Recalculate two documented article cases with source locators, units and explicit assumptions
- Run locally with Python 3.10 or later and its standard library, without accounts or API keys
- Inspect the computed results, source comparisons and limitations in a static HTML report
- Reuse the included code and permitted data under the licenses supplied with the package

## Tech Stack
- Python 3.10+
- Standard library
- CSV
- JSON
- HTML

## Benchmarks & Analytics
- How closely does the reconstructed neutral-state BDE association fit DPPH values?: R = 0.637 across 18 compounds (Calculated from rounded Table 1 values in Lauberte et al. (2019). This is one declared reconstruction; state mapping, exclusions and OH normalization are sensitivity analyses. It is not external predictive validation.)
- Do the reported 800 degC thermal values agree with the prose?: Table: 61.9% initial, 76.6% sulfated mass loss (Kazachenko et al. (2022), Table 2. The prose reverses these two values. This is a source-internal inconsistency; the available table does not establish which statement reflects the raw experiment.)

## Links
- [Read the scientific report](https://zack-dev-cm.github.io/docs/ligninqc/2026-09-05/report.html)
- [Download the offline package](https://zack-dev-cm.github.io/docs/ligninqc/2026-09-05/ligninqc-reanalysis-2026-09-05.zip)
- [Verify the download](https://zack-dev-cm.github.io/docs/ligninqc/2026-09-05/SHA256SUMS)
- [Inspect the source tables](https://zack-dev-cm.github.io/docs/ligninqc/2026-09-05/data/sources/source-extracts.html)
- [Data: antioxidant model compounds (CSV)](https://zack-dev-cm.github.io/docs/ligninqc/2026-09-05/data/lauberte2019/table1.csv)
- [Data: cumulative mass loss (CSV)](https://zack-dev-cm.github.io/docs/ligninqc/2026-09-05/data/kazachenko2022/table2.csv)
- [Data: molecular weights (CSV)](https://zack-dev-cm.github.io/docs/ligninqc/2026-09-05/data/kazachenko2022/table1-gpc.csv)
- [Lauberte et al. (2019): original article](https://doi.org/10.3390/molecules24091794)
- [Kazachenko et al. (2022): original article](https://doi.org/10.3390/polym14153000)
