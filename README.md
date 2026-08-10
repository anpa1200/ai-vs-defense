# Old Defense vs New-Age Attacks

A practitioner-focused guide to how AI-assisted offensive capability changes the threat landscape—and how SOC, CTI, and detection-engineering teams can respond.

[Read the published guide](https://1200km.com/ai-vs-defense/) · [Browse the source](docs/intro.md) · [Author's security research](https://medium.com/@1200km)

## What this guide covers

- The collapse of the traditional offensive-security skill barrier
- The Pyramid of Pain after AI-assisted tooling
- Why IOC-heavy and signature-first defenses lose effectiveness
- Behavioral and anomaly-first detection strategies
- CTI-to-SOC handoffs and threat-informed detection
- Immediate and medium-term modernization actions for security teams

The analysis is grounded in hands-on published research, including:

- [HexStrike-AI: A Force Multiplier for Red Teams](https://medium.com/@1200km/hexstrike-ai-a-force-multiplier-for-red-teams-and-a-dangerous-shift-in-the-threat-landscape-3e1d4e86f3ae)
- [AI-Driven Pentesting at Home](https://medium.com/@1200km/ai-driven-pentesting-at-home-using-hexstrike-ai-for-full-network-discovery-and-exploitation-00a9e88b3bde)
- [Threat Hunting with the Pyramid of Pain](https://medium.com/@1200km/threat-hunting-with-the-pyramid-of-pain-8add3cedb380)
- [Endpoint Threat Hunting: Proactive Detection](https://medium.com/@1200km/endpoint-threat-hunting-proactive-detection-on-windows-linux-and-macos-f892d9b8a113)

## Run locally

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm start
```

The development site opens at `http://localhost:3000`. To create a production build:

```bash
npm run build
npm run serve
```

## Repository structure

- `docs/` — guide chapters and research references
- `src/` — site styling and components
- `static/` — images and other static assets
- `docusaurus.config.js` — site metadata, navigation, and deployment settings
- `sidebars.js` — documentation navigation

## Responsible-use scope

This project is intended for defensive security practitioners, SOC analysts, detection engineers, and CTI teams. Offensive examples refer to authorized lab research.

## Author

Andrey Pautov — [1200km.com](https://1200km.com/) · [Medium](https://medium.com/@1200km) · [GitHub](https://github.com/anpa1200)

