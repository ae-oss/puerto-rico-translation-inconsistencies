# Puerto Rico Translation Inconsistencies

A static, public reader for possible differences in legal meaning between Puerto Rico legislation and its officially published English versions. The library covers the original 2017 Act 4 and original 1976 Act 80. It currently includes 11 adjudicated text-level findings, each still marked for critical legal review, plus separate screening notes for unresolved or contextually resolved wording. Potential impact is distinct from demonstrated legal effect. The demonstration is fictional, separate from research data, and excluded from all counts.

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
- `src/data/review-notes.json` holds unresolved candidates and wording errors that do not support a legal-impact finding; these appear outside finding counts.
- `src/lib/types.ts` is the TypeScript data model. `scripts/validate-data.mjs` checks the essential publication fields during every build.

Each real finding includes a law ID, section, Spanish and English excerpts, an independent translation, highlighted text parts, an explanation, possible consequences, impact and confidence assessments, initial and critical reviews, downstream status and citations, and source URLs. Keep unpublished work in the ignored research file. Once a record is approved for release, copy it to `src/data/findings.json`, set `published: true`, validate and build, then deploy. Review status is separate from publication status. A hidden page element is not private in a public repository, so never place an unpublished draft in `src/data/findings.json`.

For the original 2017 comparison, use the two PDFs on the [Puerto Rico Legislative Assembly record](https://sutra.oslpr.org/prontuarios/leyes-aprobadas/122925). Do not silently replace them with later consolidated texts. If the comparison concerns legal effect at a particular date, check the language precedence rule applicable at that time. The [2020 Civil Code, Article 26](https://bvirtualogp.pr.gov/ogp/Bvirtual/leyesreferencia/PDF/55-2020.pdf) and the archived [1930 Civil Code, Article 13](https://bvirtualogp.pr.gov/ogp/Bvirtual/leyesreferencia/PDF/C%C3%B3digos/48-1930.pdf) use different formulations.

## Deploy

The GitHub Actions workflow in `.github/workflows/deploy.yml` runs on pushes to `main`, validates and exports the site, then deploys `out/` to GitHub Pages. Enable Pages in repository settings with **GitHub Actions** as the build source. The workflow sets a base path using the repository name, so the site works at `https://<owner>.github.io/<repository>/`.

GitHub Pages on the free plan requires a public repository. The repository contains only site source and public research material; do not commit private notes or credentials.
