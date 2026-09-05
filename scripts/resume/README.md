# Resume source

Edit `resume-content.json` and run `python3 scripts/resume/build_resume.py` from the repository root. The generator writes the two-page PDF, accessible HTML, and legacy download aliases under `public/resume/`. It requires Python 3, ReportLab, and Arial (macOS) or Liberation Sans (Linux). Fonts are embedded in the PDF.

After rebuilding, render both PDF pages and inspect the layout before publishing. Run the portfolio build to copy current outputs into `docs/`. Keep claims consistent with the visible portfolio and verified project work.
