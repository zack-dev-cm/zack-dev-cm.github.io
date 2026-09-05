# Rights, attribution and changes

This release uses separate terms for code, original reanalysis material and the two source articles. Source authors retain credit for their published work. Inclusion and reanalysis do not imply their endorsement of LigninQC or its conclusions.

## Code and tests

Copyright © 2026 LigninQC contributors. The Python source code, helper scripts and tests are provided under the [MIT license](LICENSE). This software license does not replace the source-article licenses below.

## Original reanalysis material

Copyright © 2026 LigninQC contributors. The newly written scientific documentation, analysis descriptions, original reanalysis figures and numerical analysis outputs are provided under [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). See the [license text](https://creativecommons.org/licenses/by/4.0/legalcode).

Credit “LigninQC contributors, LigninQC 1.0.0, 5 September 2026” for these additions and cite the original articles for their measurements, calculations and source content. [CITATION.cff](CITATION.cff) identifies the software release. Indicate changes when redistributing an adaptation. The synthetic format example in `examples/own-data.csv` is a LigninQC example, not published scientific evidence.

## Lauberte et al. (2019)

Liga Lauberte; Gabin Fabre; Jevgenija Ponomarenko; Tatiana Dizhbite; Dmitry V. Evtuguin; Galina Telysheva; Patrick Trouillas. **Lignin Modification Supported by DFT-Based Theoretical Study as a Way to Produce Competitive Natural Antioxidants.** *Molecules* 2019, 24(9), 1794. [DOI: 10.3390/molecules24091794](https://doi.org/10.3390/molecules24091794).

Source copyright notice: **© 2019 by the authors.** The article identifies MDPI, Basel, Switzerland as licensee and states that it is distributed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The full source notice is retained in the bundled XML under `article/front/article-meta/permissions`.

Bundled source and derived files:

- `data/sources/PMC6539611.xml`: unchanged article XML, retrieved from [Europe PMC full-text XML](https://www.ebi.ac.uk/europepmc/webservices/rest/PMC6539611/fullTextXML) on 5 September 2026. [Full article at PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC6539611/).
- `data/sources/lauberte2019-figure1.png`: unchanged original Figure 1, downloaded from the [publisher's image file](https://mdpi-res.com/molecules/molecules-24-01794/article_deploy/html/images/molecules-24-01794-g001.png). The figure is included under the article license; its caption contains no separate third-party credit or license notice. It permits offline inspection of the model structures and added phenolic-OH counts.
- `data/lauberte2019/table1.csv`: transcription of Table 1. Added columns identify missingness, original source cells, imported values, chemical-state mapping and phenolic-OH counts. Empty outcomes remain missing. The ± values are retained as reported confidence-interval half-widths, not relabelled standard deviations.
- `data/lauberte2019/provenance.json` and `claims.json`: source locators, methods context, attribution, transformations and the ABTS table/prose discrepancy. The table values are preserved; the prose alternatives are not represented as corrected laboratory measurements.
- Relevant sections of `data/sources/source-extracts.html`: exact selected source paragraphs and tables with added navigation and layout. Wording, data and chemical sub/superscripts are retained. It is a selected reading view, not the complete article or a corrected edition.

Table 1 contains factual values imported by the article from earlier works. Their provenance remains explicit; this release does not claim to have measured them or to reproduce those earlier papers:

- DPPH values for compounds 15 and 16, source footnote **a**, reference **47**: R. Bortolomeazzi; G. Verardo; A. Liessi; A. Callea. Formation of dehydrodiisoeugenol and dehydrodieugenol from the reaction of isoeugenol and eugenol with DPPH radical and their role in the radical scavenging activity. *Food Chemistry* 2010, 118, 256–265. [DOI: 10.1016/j.foodchem.2009.04.115](https://doi.org/10.1016/j.foodchem.2009.04.115).
- Aqueous pKa values, source footnote **b**, reference **48**: M. Ragnar; C. T. Lindgren; N.-O. Nilvebrant. pKa-Values of Guaiacyl and Syringyl Phenols Related to Lignin. *Journal of Wood Chemistry and Technology* 2000, 20, 277–305. [DOI: 10.1080/02773810009349637](https://doi.org/10.1080/02773810009349637).

Source footnote **c** identifies compound 17 as insoluble in the DPPH reaction medium. This is preserved as an unavailable result, not a zero activity.

## Kazachenko et al. (2022)

Aleksandr S. Kazachenko; Feride Akman; Natalya Yu. Vasilieva; Yuriy N. Malyar; Olga Yu. Fetisova; Maxim A. Lutoshkin; Yaroslava D. Berezhnaya; Angelina V. Miroshnikova; Noureddine Issaoui; Zhouyang Xiang. **Sulfation of Wheat Straw Soda Lignin with Sulfamic Acid over Solid Catalysts.** *Polymers* 2022, 14(15), 3000. [DOI: 10.3390/polym14153000](https://doi.org/10.3390/polym14153000).

Source copyright notice: **© 2022 by the authors.** The article identifies MDPI, Basel, Switzerland as licensee and states that it is distributed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The full source notice is retained in the bundled XML under `article/front/article-meta/permissions`.

Bundled source and derived files:

- `data/sources/PMC9331396.xml`: unchanged article XML, retrieved from [Europe PMC full-text XML](https://www.ebi.ac.uk/europepmc/webservices/rest/PMC9331396/fullTextXML) on 5 September 2026. [Full article at PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC9331396/).
- `data/kazachenko2022/table2.csv`: Table 2 transposed to one row per temperature, retaining the two sample assignments and published cumulative mass-loss values.
- `data/kazachenko2022/table1-gpc.csv`: Table 1 transcribed to labelled CSV columns, retaining reported values and missing entries.
- `data/kazachenko2022/provenance.json` and `claims.json`: methods, locators, source interpretations and explicitly preserved prose assignments. Neither conflicting thermal representation is certified as the underlying laboratory truth.
- Relevant sections of `data/sources/source-extracts.html`: exact selected source paragraphs and tables with added navigation and layout, as described above.

## Scope of redistribution

The source material in this package is limited to these two named CC BY article XML files, the original Lauberte Figure 1 and the attributed extracts/transcriptions described above. Full publisher PDFs used during checking, private source caches, other cited papers and third-party supplementary archives are not included. In particular, the Li et al. 2021 ACS supporting-information archive, whose repository metadata specifies CC BY-NC 4.0, is not part of this release.

Original source files retain their license notices and identifiers; SHA-256 values are recorded in each provenance file and the release manifest. New calculations and plots are secondary analyses of rounded published values. They are not new experiments, newly performed DFT calculations or statements endorsed by the source authors.
