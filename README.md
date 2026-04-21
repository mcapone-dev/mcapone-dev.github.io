# Campaign Chronicle Site

This is a **static website** that publishes your Dungeon Master PR review campaigns as a
MUD-style chronicle. It's regenerated automatically by the `dm-site-generator` skill after
every review, and it contains **zero code** from any reviewed pull request — only the story
of the reviews.

## What's here

```
site/
├── index.html                                  lobby (campaign selector)
├── campaigns/
│   ├── the-codex-reaches/index.html           per-campaign chronicle
│   ├── the-silver-protocols/index.html        ...
│   └── ashborn-realms/index.html              ...
├── assets/
│   ├── styles.css                             shared phosphor-CRT theme
│   └── script.js                              shared interactions
└── README.md                                  this file
```

## Previewing locally

No build step required. Open `index.html` directly, or serve with any static server:

```bash
cd "/Users/mcapone/obsidian/Dungeon Master/site"
python3 -m http.server 4173
# then visit http://localhost:4173
```

## Publishing to GitHub Pages

Two clean options. Pick one:

### Option A — Dedicated Pages repo (`<username>.github.io`)

Use this if you already have a personal Pages repo.

```bash
# clone your pages repo once
git clone git@github.com:mcapone/mcapone.github.io.git ~/github/mcapone.github.io

# every time the chronicle is regenerated, sync:
rsync -a --delete \
  "/Users/mcapone/obsidian/Dungeon Master/site/" \
  ~/github/mcapone.github.io/

cd ~/github/mcapone.github.io
git add -A
git commit -m "chronicle: regenerate"
git push
```

Your chronicle will be live at `https://mcapone.github.io/`.

### Option B — A sub-path on an existing repo

Drop the `site/` tree into a `docs/` folder of any repo and enable Pages → `docs/` in the
repo's Settings. The chronicle will be live at
`https://<user>.github.io/<repo>/` (or your CNAME).

```bash
rsync -a --delete \
  "/Users/mcapone/obsidian/Dungeon Master/site/" \
  /path/to/your-repo/docs/
```

## Automating the publish step

The `dm-site-generator` skill regenerates the HTML after every review. If you want the
publish step to happen automatically, add a small post-generation hook:

1. Clone your Pages repo once (as above).
2. Tell `dm-site-generator` to copy the generated `site/` into your Pages repo clone
   and commit + push. Either:
   - Set the `publish_target` input on the skill to your Pages repo path; the skill will
     rsync and `git add/commit/push` after each regeneration.
   - Or wire it as a Claude Code `Stop` hook that runs a shell script.

No GitHub Actions are required. The whole pipeline is local + `git push`.

## No code, ever

The chronicle is built from the campaign markdown files in your vault:
- `Campaigns/*/index.md`, `timeline.md`, `lore.md`, `sessions/*.md`, `characters/*.md`,
  `complete-summary.md`, `highlights.md`.

The generator enforces the same code-exclusion rules as `dm-campaign-summary`. If you ever
spot a path, function name, or diff hunk leak into the chronicle, that's a bug in the
generator — please file it and the DM suite will patch the redaction pass.

## Customizing

- **Theme colors** — edit `assets/styles.css`, variables at `:root { --fg, --amber, … }`.
  The `phosphor green` default is one of many possible aesthetics; amber, blue, or
  parchment all work within the same structure.
- **ASCII emblems** — the lobby uses a distinct emblem per campaign. `dm-site-generator`
  picks or generates these based on the campaign name. Hand-edit them in each page's
  `.campaign-emblem` pre-block if you want a custom look.
- **Footer / legal** — edit in each page's `<footer>` block, or in the generator's
  template.

## Deploy-time checklist

- [ ] Did the generator finish without errors? (Check the run output.)
- [ ] Open `index.html` locally and confirm all three campaign cards render.
- [ ] Click through to each campaign chronicle; confirm navigation works.
- [ ] View-source and ensure there are no file paths, diff markers, or identifiers.
- [ ] If deploying via Option A or B, confirm the Pages URL returns `200` after push.

## Accessibility

- All interactive elements are keyboard-focusable.
- CRT scanlines and flicker are purely decorative and respect `prefers-reduced-motion`.
- The base font size is 24px; character portraits and ASCII scenes are marked `aria-hidden`.
- Color isn't the only signal for verdicts — icons and text reinforce meaning.

## License

The chronicle content is yours — your campaigns, your PRs, your story. The theme is
permissively usable; feel free to fork the template for your own team's chronicle.
