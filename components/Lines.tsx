// Renders text keeping its line breaks.
export function Lines({ text }: { text: string }) {
  return text.split('\n').map((line, i, all) => (
    <span key={i}>{line}{i < all.length - 1 && <br />}</span>
  ));
}
