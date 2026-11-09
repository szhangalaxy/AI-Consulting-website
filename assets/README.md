# Asset sources

- `fonts/inter-latin-*.woff2`: Inter, locally served from the pinned `@fontsource/inter@5.2.5` package. Source: https://cdn.jsdelivr.net/npm/@fontsource/inter@5.2.5/files/ . Licence and attribution: `fonts/LICENSE` (SIL Open Font License).
- `icons/*.svg`: unmodified Tabler outline icons from `@tabler/icons@3.35.0`. Source: https://cdn.jsdelivr.net/npm/@tabler/icons@3.35.0/icons/outline/ . Licence and attribution: `icons/LICENSE` (MIT).
- `studio-still-life.webp`: retained asset from the earlier design, no longer used by the page. Decorative generated editorial imagery, not a photograph of a real company office. Converted from its generated PNG with ImageMagick at quality 83, keeping the original pixel dimensions.
- `workflow-architecture.webp`: generated technical illustration replacing the still life in the current page. It depicts inputs, preparation, a review boundary and structured outputs. Labelled illustrative; it is not a client system, product screenshot, or measured audit result. The earlier still-life asset is retained but no longer used by the page.

The deployed page makes no requests to the asset sources. All assets are served from this repository.
