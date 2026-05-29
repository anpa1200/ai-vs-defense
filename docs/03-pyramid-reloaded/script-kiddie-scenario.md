---
title: "What a Script Kiddie + AI Actually Looks Like"
sidebar_label: The New Script Kiddie
sidebar_position: 2
description: "A realistic 3-day attack scenario in 2025 that would have required a senior professional attacker in 2020."
---

# What a "Script Kiddie + AI" Actually Looks Like

Abstract descriptions of AI-lowering-the-bar can feel unconvincing. Let me make it concrete: here is a realistic attack scenario that an intermediate-skill attacker with AI tools could execute in 2025 — and the equivalent scenario from 2020 that would have required a senior professional.

The attacker has: intermediate security knowledge (equivalent to a mid-level CTF player), access to AI tools (Cursor, Gemini CLI, HexStrike-AI or equivalent), and a target organization to investigate.

---

## Day 1 — Target Research and Tool Preparation

### 2020 Version (Senior Professional Required)

A senior attacker with OSINT experience manually:
- Queried [Shodan](https://medium.com/@1200km/shodan-you-can-find-everything-640f47f41bbe) with domain-specific filters they knew from experience
- Ran [theHarvester](https://medium.com/@1200km/theharvester-your-essential-tool-for-osint-and-reconnaissance-in-cybersecurity-10aa6d76f5b3) for email enumeration
- Used [Sublist3r](https://medium.com/@1200km/sublist3r-your-essential-tool-for-subdomain-enumeration-c1910121d712) or [OWASP Amass](https://medium.com/@1200km/owasp-amass-project-guide-94bd55521f91) for subdomain discovery
- Correlated results manually across tools
- Built a credential stealer using C++ Windows API knowledge they had accumulated over years

**Time required:** Multiple days. Several separate skill domains.

### 2025 Version (Intermediate Skill + AI)

Using [HexStrike + Cursor for OSINT](https://medium.com/@1200km/hexstrike-cursor-for-osint-from-one-email-to-a-full-exposure-map), the attacker provides one email address and lets the AI:

- Query [Shodan](https://medium.com/@1200km/shodan-you-can-find-everything-640f47f41bbe) for exposed services and IP ranges
- Run [theHarvester](https://medium.com/@1200km/theharvester-your-essential-tool-for-osint-and-reconnaissance-in-cybersecurity-10aa6d76f5b3) for employee email enumeration
- Execute [Sublist3r](https://medium.com/@1200km/sublist3r-your-essential-tool-for-subdomain-enumeration-c1910121d712) and [OWASP Amass](https://medium.com/@1200km/owasp-amass-project-guide-94bd55521f91) for subdomain discovery
- Cross-reference [SpiderFoot](https://medium.com/@1200km/spiderfoot-deep-dive-installation-scans-and-practical-use-cases-11ea6537ad6f) against breach databases and social platforms
- Automatically correlate everything into a digital footprint map

Simultaneously, using [Cursor AI](https://medium.com/@1200km/how-cursor-ai-became-my-full-stack-development-partner-from-arduino-code-to-visual-validation-47fcccb9c845):
- Specify: "Build a credential stealer that harvests Chrome saved passwords and sends them to a remote endpoint, avoiding common EDR behavioral signatures"
- AI iterates on implementation, tests against detection, and produces a functional binary

**Time required:** Hours. No multi-year skill prerequisite.

The key output that differs from 2020: **a custom-built tool with no existing detection signatures**. The 2020 attacker, if they lacked development skills, would have used Mimikatz — which every EDR vendor detects immediately. The 2025 attacker has a novel binary.

---

## Day 2 — Initial Access

### 2020 Version

Crafting convincing spearphishing required either social engineering expertise or purchasing access from a specialized operator. Creating a malicious macro document that evaded email gateway sandboxes required understanding of sandbox evasion techniques.

### 2025 Version

Using data gathered by AI in Day 1:
- AI drafts personalized spearphishing emails per target using LinkedIn role data and corporate context
- AI generates a macro-enabled document with sandbox evasion techniques selected based on what was documented as having weak Sigma coverage
- AI configures C2 server with a custom malleable profile tuned to blend with the target organization's normal SaaS traffic patterns (based on Shodan/[Censys](https://medium.com/@1200km/censys-for-enhanced-cybersecurity-insight) fingerprinting of their infrastructure)

The AI's knowledge of documented detection patterns (from public Sigma rules, ATT&CK, vendor blogs) enables designing the initial access chain with evasion built in, not bolted on.

---

## Day 3 — Exploitation and Post-Compromise

### 2020 Version

Post-compromise in 2020 required: Active Directory expertise for enumeration, lateral movement technique knowledge, credential dumping expertise, and operational discipline to not trigger behavioral alerts.

A Tier 3 attacker would have used known tools (Mimikatz, BloodHound, PsExec) and likely triggered EDR alerts on well-defended networks.

### 2025 Version

Using [HexStrike-AI](https://medium.com/@1200km/hexstrike-ai-a-force-multiplier-for-red-teams-and-a-dangerous-shift-in-the-threat-landscape-3e1d4e86f3ae) connected through MCP:

- AI-guided post-exploitation: identify high-value accounts and AD topology without running BloodHound directly (an AI-suggested alternative with weaker EDR coverage)
- Custom persistence mechanism the AI suggested for its detection gap compared to common Registry Run Key approaches
- Credential harvesting through a technique selected for its minimal Sigma rule coverage
- Lateral movement timed to match normal business hours based on the organization's public timezone information

**The result:** An attack that uses:
- No known-malicious binary signatures
- No documented C2 profile patterns
- Techniques specifically selected to avoid the most common detection rules

**Required skill to execute in 2025:** Intermediate. Someone who understands what each step accomplishes.

**Required skill to execute in 2020:** Senior offensive security professional. 5+ years experience across multiple specialty domains.

---

## The Comparison in Numbers

| Capability | 2020 Equivalent | 2025 Equivalent |
|---|---|---|
| Full OSINT correlation from one email | 4–8h manual, OSINT analyst | 30min, AI orchestrated |
| Custom credential stealer (no signatures) | 1–2 weeks, C++ developer | 1–2 days, AI-assisted development |
| Sandbox-evading phishing document | Specialized capability | AI-suggested technique selection |
| Custom C2 profile, no Cobalt Strike | Days of testing, C2 expertise | Hours, prompt-driven |
| Full post-compromise AD enumeration | AD expertise required | AI-guided, no deep AD knowledge needed |
| Lateral movement with operational timing | Senior OPSEC discipline | AI-suggested timing based on target research |

---

## What This Means for Your SOC

When you receive an alert tomorrow and classify the actor as "likely commodity/low-skill based on initial TTPs," that classification is now less reliable.

The indicators that used to imply low skill — using known tools, predictable patterns, recognizable signatures — are now optional choices. An actor who *would have* been Tier 3 in 2020 can *choose* not to use known tools in 2025. Not because they developed the skill — because AI provides it.

**The threat model recalibration:** Raise your baseline assumption about adversary capability. A mid-market organization being targeted by what looks like a low-tier actor may be facing something more capable than the initial TTPs suggest. The absence of known tool signatures is no longer reliable evidence of a low-skill actor — it may simply mean they used AI to generate a custom tool.

---

**Continue:** [Why Legacy Defense Patterns Are Failing →](../defense-failure/why-legacy-fails)
