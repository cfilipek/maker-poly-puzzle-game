export function RulesPanel({
  defaultOpen = false,
}: {
  defaultOpen?: boolean
}) {
  return (
    <details open={defaultOpen} className="pixel-frame group bg-card p-4">
      <summary className="cursor-pointer font-mono text-xs marker:text-primary">
        How to play
      </summary>

      <div className="mt-4 flex flex-col gap-3 leading-relaxed">
        <ol className="flex list-decimal flex-col gap-2 pl-5">
          <li>
            Plant crop cards on your 4×4 Poly-Plot. You have 3 minutes
            to plan your layout.
          </li>
          <li>
            Lock in your plots to reveal the season’s hidden event.
            Events are shuffled at the start of each game.
          </li>
          <li>
            Calculate each crop’s yield using its base yield or active
            combo, then apply crop penalties and event penalties.
          </li>
          <li>
            Add your crops’ final yields to get your season score.
            Between seasons, you may move, remove, or replant crops.
          </li>
          <li>
            Play all 6 seasons. Your final score is the sum of your
            season scores. The farmer with the highest total wins!
          </li>
        </ol>

        <p className="text-sm">
          <strong>Neighbors:</strong> Only plots directly above, below,
          left, or right count. Diagonal plots do not count, and a crop
          is not its own neighbor.
        </p>

        <p className="bg-muted p-3 text-sm">
          <strong>Combo rule:</strong> An active combo replaces that
          crop’s base yield with 5 points before penalties. It does
          not add points to neighboring crops. Multiple qualifying
          neighbors do not increase this value. For example, corn
          beside beans has a yield of 5 before event penalties.
        </p>

        <p className="text-sm">
          <strong>Heavy feeders:</strong> Corn and tomatoes lose 2
          points if they have no neighboring Nitrogen-Fixer.
          During Nutrient Depletion, they also lose 2 points for
          being Heavy Feeders.
        </p>

        <p className="text-sm">
          <strong>Event protection:</strong> A neighboring Ground Cover
          protects a crop from weeds and drought. A neighboring Pest
          Deterrent protects it from pests. A neighboring Nitrogen-Fixer
          prevents the 1-point low-nitrogen penalty during Nutrient
          Depletion. Crops do not protect themselves.
        </p>

        <p className="text-sm">
          <strong>Lettuce:</strong> Lettuce yields 5 in its planting
          season and 1 in each later season, before event penalties.
          Moving or swapping it does not reset its age. To replant,
          select the Lettuce card and click an old lettuce plot,
          or remove it and plant lettuce again.
        </p>

        <p className="text-sm">
          <strong>Final yield:</strong> Apply all relevant penalties.
          Each crop’s yield stops at 0 and cannot become negative.
          Tap a planted crop to see its score breakdown.
        </p>
      </div>
    </details>
  )
}