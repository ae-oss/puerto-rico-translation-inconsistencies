# Puerto Rico Translation Inconsistencies

A static, public reader for possible differences in legal meaning between Puerto Rico legislation and its officially published English versions. A separate federal-guidance section compares matched English and Spanish DOL FMLA FAQ questions relevant to Puerto Rico. Legislative and federal-guidance findings have separate counts. The library includes adjudicated text-level findings marked for continued legal review, plus separate screening notes for unresolved or contextually resolved wording. Potential impact is distinct from demonstrated legal effect. The demonstration is fictional, separate from research data, and excluded from all counts.

## Run locally

Requires Node.js 22+ and pnpm 11.

```sh
pnpm install
pnpm dev
```

`pnpm build` validates the JSON data and exports the site to `out/`. The export is deployable to GitHub Pages without a database or paid server.

## Add research

- `src/data/laws.json` holds each law, the edition being compared, review coverage, and official links. Each law needs its own unique `id`.
- `research/agents/findings-drafts.json` holds unpublished research drafts locally. The entire `research/agents/` directory is ignored by Git so these drafts and review notes do not enter the public source repository. Use `src/data/demo.json` to see the format, but do **not** copy its fictional text into a real finding.
- `src/data/findings.json` holds only findings approved for public release. Published entries can still show an open legal-review stage and must state limits and counterreadings.
- `src/data/federal-guidance.json` holds separately published agency-guidance comparisons. They are displayed at `/federal-guidance/` and excluded from Puerto Rico act counts. The FMLA evidence and review record is in `research/federal-puerto-rico/fmla-round2/` locally.
- `src/data/review-notes.json` holds unresolved candidates and wording errors that do not support a legal-impact finding; these appear outside finding counts.
- `src/data/act-texts.json` holds the extracted official English act text, page anchors, and links to findings. Regenerate it with `python scripts/extract-act-text.py` after placing the official English PDFs at `tmp/pdfs/act4-english.pdf`, `tmp/pdfs/act80-english.pdf`, `tmp/pdfs/act180-english.pdf`, `tmp/pdfs/act427-english.pdf`, and `tmp/pdfs/act1-english.pdf`. Act 100's scanned English text is a corrected OCR transcription in `scripts/transcriptions/act100-english.json`; its neighboring acts are excluded. The `tmp/` directory is ignored by Git. Act 180 PDF page 18 and Act 427 PDF page 6 are translator certifications, excluded from their readers. Act 1 contains only ten selected, noncontiguous context pages from the original 1,316-page English Code.
- `src/lib/types.ts` is the TypeScript data model. `scripts/validate-data.mjs` checks the essential publication fields during every build.

Each real finding includes a law ID, section, Spanish and English excerpts, an independent translation, highlighted text parts, an explanation, possible consequences, impact and confidence assessments, initial and critical reviews, downstream status and citations, and source URLs. Keep unpublished work in the ignored research file. Once a record is approved for release, copy it to `src/data/findings.json`, set `published: true`, validate and build, then deploy. Review status is separate from publication status. A hidden page element is not private in a public repository, so never place an unpublished draft in `src/data/findings.json`.

For the original 2017 comparison, use the two PDFs on the [Puerto Rico Legislative Assembly record](https://sutra.oslpr.org/prontuarios/leyes-aprobadas/122925). Do not silently replace them with later consolidated texts. If the comparison concerns legal effect at a particular date, check the language precedence rule applicable at that time. The [2020 Civil Code, Article 26](https://bvirtualogp.pr.gov/ogp/Bvirtual/leyesreferencia/PDF/55-2020.pdf) and the archived [1930 Civil Code, Article 13](https://bvirtualogp.pr.gov/ogp/Bvirtual/leyesreferencia/PDF/C%C3%B3digos/48-1930.pdf) use different formulations.

The reader displays the full official English legislative text for each listed original enactment except Act 1 of 2011, whose page clearly labels a targeted review of English PDF pages 81–86, 123–124, and 430–431 only, paired with Spanish scan pages 68–72, 104–105, and 362–363. No whole-Code review is implied. The original Act 80 and Act 100 archives are scans; their searchable text is OCR and can contain transcription mistakes. The reader flags this and links to the official PDFs, which control for exact wording. Adjacent acts on shared archive spreads are excluded. The Spanish Act 180, Act 427, and Act 1 scans have unusable text layers, so published quotations were checked visually against the official page images.

## Deploy

The GitHub Actions workflow in `.github/workflows/deploy.yml` runs on pushes to `main`, validates and exports the site, then deploys `out/` to GitHub Pages. Enable Pages in repository settings with **GitHub Actions** as the build source. The workflow sets a base path using the repository name, so the site works at `https://<owner>.github.io/<repository>/`.

GitHub Pages on the free plan requires a public repository. The repository contains only site source and public research material; do not commit private notes or credentials.
