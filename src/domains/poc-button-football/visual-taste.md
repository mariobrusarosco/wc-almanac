# Visual Taste Notes

This document captures the current visual direction for the World Cup button-football collection experience. It is a working design note for the MVP, not a broad styling system.

## Product Feel

The interface should feel like a historical digital futebol de botão collection, not a sports dashboard.

The core metaphor is button football: tabletop football pieces arranged on a pitch, with each player represented by a circular button/disc.

The page should prioritize:

- collectible player buttons
- clear squad hierarchy
- readable names and stats
- calm historical presentation
- enough texture to feel like a physical tabletop collection

Avoid making the page feel like:

- a generic admin table
- a betting/statistics product
- a marketing landing page
- a flat card wall with no hierarchy

## Button Football Direction

Use futebol de botão as the main visual language.

The main 11 should eventually feel like pieces arranged on a tabletop pitch. The substitutes can feel like spare pieces in a tray, bench, or storage box.

Player identity should come from:

- shirt number
- player name or initials
- position
- team colors
- circular button shape

Do not rely on player photos. Player photos are out of scope for this product direction.

The buttons can be stylized rather than photorealistic, but they should retain the physical feeling of printed plastic pieces.

## First MVP Page

The POC home screen is the World Cup Almanac cover at `/v0/`.

The cover opens into a table of contents at `/v0/contents`.

The table of contents opens the editions section at `/v0/editions`.

Each edition can open into an edition overview page, starting with `/v0/editions/2022`.

The first album detail screen is Brazil, 2022.

Conceptual URL:

```txt
/v0/2022/bra
```

Current implementation can still render at `/` until routing exists.

The page should show:

- tournament label
- team name
- squad summary
- main 11 button area
- substitutes area

## Layout

Use a single page layout.

Do not add routing, filters, modals, or player-detail interactions in the first visual pass.

The `/v0/` home page should feel like a printed almanac cover: a large poster-like panel, Antonio typography, a quiet blue field, cream side spine, simple `Open` control, and the trophy image cropped on the right.

The `/v0/contents` page should feel like the first inside page of the almanac: cream paper, blue left spine, the trophy cropped from the left edge, a large boxed table-of-contents heading, and section rows with rule lines leading to page numbers.

The `/v0/editions` page should keep the same inside-page frame and list World Cup editions as book entries: host flag, host name, year badge, rule line, and page number.

The `/v0/editions/<year>` page should be an edition-specific overview spread: a strong edition color spine, previous/next edition navigation, host/year headline, winner block, final result block, and a compact section marker on the far right. It can start with curated POC data before the real API/read model exists.

The main 11 should eventually sit on a half-field layout.

Do not represent each team's real tactical formation yet. Use a consistent generic pyramid from defenders to forwards so every team can fit the same composition.

The goalkeeper is a special piece: a rectangular block in front of the goal, not a circular button.

The outfield player button is the core object, so each button or button-backed layout must keep enough room for:

- shirt number
- player name
- position
- app/start/goal stats

Until the half-field layout is implemented, pieces can wrap into multiple rows on desktop. Readability is more important than fitting exactly 11 pieces across.

## Button Rules

Player objects should look like collectible football buttons, not trading cards.

Each player object should include:

- shirt number
- position code
- player name
- appearances
- starts
- goals

No portrait placeholders. Use the circular button itself as the player identity object.

The preferred button label order is:

1. badge or badge placeholder
2. jersey number
3. player name outside or below the button

Real team badges are not required for now. The button should still reserve a visual badge area so the design can accept real or generated badges later.

Names and stat chips must stay inside their container. No horizontal overflow.

## Visual Hierarchy

The page title should be large and direct.

Section headings should align with their content. Avoid sending a section title far to the right just because there is empty horizontal space.

The main 11 section should feel more prominent than substitutes, ideally like a tabletop team setup on a half field. Substitutes should still be complete and readable.

Substitutes should use a bench/storage-box metaphor: smaller buttons placed in compartments, like pieces kept in a kid's button-football box.

## Color Direction

The current page palette can stay warm and paper-like, but team pieces should not all inherit Brazil's green/yellow identity.

Use:

- warm paper background
- deep green ink
- team-specific button colors
- green pitch/tabletop surfaces
- button-like plastic highlights
- subtle borders and shadows

Avoid:

- saturated flag-color overload
- heavy gradients as page backgrounds
- dark sports-dashboard styling
- overly decorative effects
- fake player-photo treatments

## Team Color Model

Team visuals are part of the product model, not only component styling.

For the POC, stable team identity visuals live in `data/db/team_visual_identities.json`, keyed by `teamId`. It owns badge asset paths and all-time team page colors.

Endpoint-shaped responses are assembled in the MSW mock layer from `data/db/*.json`, so the mock behaves like a small backend joining table rows.

Team appearance colors live in `data/db/world_cup_team_visual_identities.json`, keyed by `worldCupTeamId`. It owns edition-specific button football colors for a team/tournament appearance.

Tournament visual identity lives in `data/db/world_cup_visual_identities.json`, keyed by `worldCupId`. It owns edition-specific logo/trophy asset paths and page colors, while `data/db/tournaments.json` stays factual tournament data.

The minimum color roles are:

- button face
- darker button face
- button side/depth
- badge mark
- jersey number
- goalkeeper base
- goalkeeper mark
- UI accent
- UI accent text

Apply the selected profile through page-level CSS variables so the button and goalkeeper components remain team-agnostic.

## Data Display

Use `isStarter` as the layout driver for the main 11.

For the MVP, `isStarter` means the player belongs in the main album area for that team.

Use substitutes for all remaining squad players.

Do not expose the computation details in the UI yet.

Use URL search state for lightweight pitch controls. The position switcher uses `?position=...` and should fade non-matching players rather than removing them from the field.

## Responsive Behavior

The layout should scale down by wrapping pieces, not by squeezing them until text breaks.

Desktop:

- buttons may wrap into multiple rows
- page width can be generous
- button readability wins over exact row count

Mobile:

- one or two cards per row
- header summary can stack
- no text overlap

## Current Decisions

- The main 11 should use a half-field layout.
- The half-field layout should use a generic pyramid, not real team-specific formations yet.
- The goalkeeper should be represented by a rectangular piece.
- Outfield players should be represented by circular buttons.
- Each edition/team can get a unique accent.
- Substitutes should not use smaller trading cards; they should use button pieces in a bench/storage-box layout.
- Real team badges are not required for now.
- Button label order should be badge area, jersey number, then player name outside or below the button.

## Reference Images

- `data/badge-and-number-example.webp`: button label hierarchy and spacing. Badge comes first, jersey number underneath, name can sit outside/below the button. Buttons should sit very close to each other, nearly touching like physical pieces on turf.
- `data/buttons-of-bench-players-inspiration.webp`: bench/storage-box metaphor for substitutes.
- `data/formation-example.jpeg`: half-field pyramid setup with a rectangular goalkeeper piece.
