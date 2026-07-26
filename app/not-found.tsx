export default function NotFound() {
  return (
    <main className="not-found shell">
      <p className="eyebrow">404 / Off the map</p>
      <h1>This path has not been charted.</h1>
      <p>Return to the academy or search the field guide for another route.</p>
      <div className="button-row">
        <a className="button button-primary" href="https://learn.project-42.dev">
          Learning paths
        </a>
        <a className="button button-secondary" href="https://guide.project-42.dev">
          Field Guide
        </a>
      </div>
    </main>
  );
}
