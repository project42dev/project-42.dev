# Diagram authoring

Project 42 diagrams are accessible, source-first learning artifacts consumed from
the `@project42/platform` package. Mermaid source under
`node_modules/@project42/platform/content/diagrams/` is canonical. SVG and public
`.mmd` files under `public/diagrams/` are generated and must never be hand-edited.

## Diagram source location

Diagrams are authored and maintained in the `project42-platform` repository. This
site consumes the published catalog from `@project42/platform/content/diagrams/catalogue.json`.

To add or change a diagram, make changes in the `project42-platform` repository,
publish a new platform release, then bump the platform version in this site's
`package.json`.

## Generate diagrams locally

After bumping the platform version:

1. Install the Playwright browser once with:

   ```powershell
   npx playwright install chromium
   ```

2. Generate reviewed artifacts:

   ```powershell
   npm run diagrams:generate
   ```

3. Run `npm run diagrams:check` and the complete `npm run check` gate.

The generator pins Mermaid CLI, uses strict security settings, disables HTML labels,
embeds source provenance, copies the public source, and writes a hash manifest.
The CI check fails when a source, SVG, public source copy, or manifest is missing,
stale, unsafe, duplicated, or unregistered.

## Accessibility

Every catalog record requires:

- a concise summary for discovery;
- long alternative text that communicates nodes, decisions, and direction;
- a visible figure caption;
- a plain-language explanation;
- at least three practical takeaways.

The detail page uses the long alternative text on the SVG image. Card thumbnails are
decorative because their adjacent title and summary already describe the destination.
Generated SVGs also contain Mermaid's embedded title and description.

## Production boundary

Production serves static SVG and `.mmd` assets. It does not execute Mermaid, accept
user-supplied diagram syntax, or call an external rendering service.
