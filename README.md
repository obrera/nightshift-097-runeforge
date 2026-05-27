# RuneForge

Nightshift build 097: a Solana game crafting and equipment app for player-crafters preparing a spell rune for a game loadout.

Live target: <https://runeforge097.colmena.dev>

## What It Does

RuneForge lets a player choose catalyst stones, socket pattern, and rune school; simulates stability, fracture risk, and combat stats; generates first-party MPL Core metadata plus SVG media; and mints the finished rune as a connected-wallet-signed devnet MPL Core asset.

The NFT job is transferable/custodied game equipment ownership. The crafted rune is the on-chain item, so ownership, transferability, and holder verification matter for loadouts, trading, and inventory custody.

## Capabilities

- Crafting workbench for rune school, catalyst, and socket selection.
- Stat and forge stability simulator.
- First-party metadata and SVG preview routes.
- Connected wallet-signed MPL Core createV1 mint using wallet-ui.
- Asset verifier for devnet MPL Core rune ownership.
- Creator/operator console for recipe tuning, supply, risk, and runtime readiness.

## Stack

- TypeScript, Bun, Vite, React, Tailwind dark-mode UI.
- Hono/Bun server on port `3000`.
- `@wallet-ui/react`, `@solana/kit`, `@solana/react`, and published npm `@obrera/mpl-core-kit-lib`.
- No legacy Solana web3 package, no wallet adapter React package, and no server mint path.

## Run Locally

```bash
bun install
bun run build
PUBLIC_BASE_URL=http://localhost:3000 bun run start
```

Then open <http://localhost:3000>.

Useful routes:

- `GET /health`
- `GET /api/bootstrap`
- `GET /api/metadata/rune.json?school=astral&pattern=spiral-lock&catalysts=sunshard,voidglass,stormsalt`
- `GET /api/media/rune.svg?...`

## Proof

```bash
PROOF_BASE_URL=https://runeforge097.colmena.dev bun run proof
```

The proof script uses `/home/obrera/projects/pubkey-link/tools/tokens/keypair/alice-keypair.json` by default when present. It verifies metadata/media over HTTP, mints one devnet MPL Core asset through `getCreateV1Instruction`, fetches the asset, and prints JSON with asset, signature, owner/updateAuthority, metadata URI, media status, and attribute count.

## Recovery Status

This recovery pass regenerated `bun.lock`, verified the local production build, served the app on port `31097`, checked `/health` and the main page over HTTP, and minted a devnet MPL Core proof asset through the proof script.

## Nightshift

- Challenge: Nightshift Solana Week, build `097`.
- Selected use-case family: game equipment minting/crafting.
- Primary actor: player-crafter preparing a spell rune for a loadout.
- Wallet disclosure: the product-critical mint is client-side and connected-wallet-signed through wallet-ui; the server only hosts metadata/media/readiness.
- Agent: OpenAI GPT-5 Codex.
