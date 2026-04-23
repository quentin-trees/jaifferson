# cloarec.ai — content pack

All source-of-truth content for the cloarec.ai landing page, the target-profile deliverable, and the done-for-you services offering. Powered by the Jaifferson method.

## Structure

```
content/
├── README.md                       ← you are here
├── landing/
│   ├── copy.md                     ← full landing page copy (SEO + every section)
│   ├── pricing.md                  ← monthly + annual pricing block
│   ├── use-cases.md                ← "why this changes your life" section
│   └── services.md                 ← done-for-you branding services
└── profiles/
    ├── TEMPLATE.md                 ← the master target-profile template
    └── samples/
        ├── andrej-karpathy.md
        ├── yann-lecun.md
        └── mira-murati.md
```

## Usage

- **Landing copy** — paste into Lovable sections as-is. SEO block goes in `<head>`.
- **Template** — this is the `.md` schema every generated profile follows. Fill `{{PLACEHOLDERS}}`.
- **Samples** — ready-to-show profiles for the landing sample block. Used under public-figure fair comment.

## Method

Every profile is a **strategic hypothesis based on public signal** — never presented as verdict. That framing must stay in the footer of every generated `.md`.

---

Edit here, not in Lovable. This folder is the canonical source.
