export function RulesPanel({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="pixel-frame group bg-card p-4">
      <summary className="cursor-pointer font-mono text-xs marker:text-primary">How to play</summary>
      <div className="mt-4 flex flex-col gap-3 leading-relaxed">
        <ol className="flex list-decimal flex-col gap-2 pl-5">
          <li>Place your crop cards strategically around your Poly-Plot (3 minutes to plan).</li>
          <li>During each Season, a hidden event occurs that may impact your yield.</li>
          <li>At the end of the Season, total the yield of your crops, factoring in all Combo Effects.</li>
          <li>Between Seasons, you may replant any plots that you wish.</li>
        </ol>
        <p className="bg-muted p-3 text-sm">
          <strong>Combo rule:</strong> Combo Effects that would add points to neighbors add nothing. Instead, if the combo
          is active, the crop itself is worth 5 points. Example: a Marigold next to any crop is worth 5. Corn next to a
          Climber (Beans) is worth 5.
        </p>
        <p className="text-sm">
          <strong>Neighbors</strong> are the plots directly above, below, left and right. Replanted Lettuce is fresh again
          and earns its full 5. Plants that are the protecting trait themselves (e.g. a Squash during Weeds) are not
          penalized by that event.
        </p>
      </div>
    </details>
  )
}
