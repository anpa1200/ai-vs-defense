---
title: CTI Must Evolve — Beyond IOC Feeds
sidebar_label: Beyond IOC Feeds
sidebar_position: 1
description: "Why CTI functions built around IOC feed processing are losing value, and what CTI must become to remain relevant in an AI-assisted threat landscape."
---

# CTI Must Evolve: Beyond IOC Feeds

If you have read this guide from the beginning, the problem with the current state of most CTI functions is already clear: the IOC treadmill is the default CTI output, and the IOC treadmill is the detection layer that is losing most ground to AI-assisted offense.

This section is not about criticizing CTI teams. It is about what they need to become.

---

## What Most CTI Functions Look Like Today

In the average organization, CTI is structured around:

1. **Ingesting commercial threat intelligence feeds** — hashes, IPs, domains, CVEs
2. **IOC enrichment and lookup** — querying VirusTotal, querying the feed database against SIEM logs
3. **Periodic threat reports** — "here are the top threat actors targeting our sector this month" with narrative descriptions and IOC appendices
4. **Reactive support to IR** — "help us understand what this malware does" after an incident

This is not useless. Commodity threat intelligence still has value for blocking known-bad infrastructure while it remains active and for context during incident response.

But as a *primary* CTI function, it is increasingly close to theater — working at the bottom of the Pyramid of Pain on indicators that are stale before you receive them, against attackers who are rotating infrastructure faster than your feed subscription can track.

**The hard question:** If your CTI output is primarily a list of hashes and domains, what percentage of actual attacks in the past year would that output have helped detect or prevent? Run that analysis honestly.

---

## What CTI Must Become: Adversary Behavioral Modeling

Real CTI in the AI-assisted threat landscape means **behavioral intelligence**, not indicator lists.

**Not:** "These are the IOCs associated with APT-X."

**But:** "This is how APT-X operates — what environment characteristics they seek before targeting, how they establish initial access, what their lateral movement pattern looks like, what their operational security habits are, and what behavioral signals would indicate their presence before they reach impact."

This distinction has direct defensive value: behavioral intelligence drives detection rule development. Indicator intelligence drives blocklists. The first is proactive. The second is reactive.

The [CTI Analyst Field Manual](https://github.com/anpa1200/cti-analyst-field-manual) provides the full structured methodology for building behavioral intelligence products — from ATT&CK mapping to detection engineering requirements to gap analysis. The [ATT&CK as a Working Tool](https://medium.com/@1200km/attck-as-a-working-tool-theory-and-hands-on-practical-usage) guide covers the analytical skills required.

### What a Behavioral Intelligence Report Contains

For a priority threat actor, a behavioral intelligence product should include:

**1. ATT&CK TTP Profile (Evidence-Labeled)**

Not a flat list of technique IDs — a structured mapping with confidence levels and evidence sources per technique, organized by tactic phase. For methodology, see the [Handala Hack Group CTI research](https://medium.com/@1200km/cti-research-handala-hack-group-aka-handala-hack-team-ddbdd294cfb8) as a practical example of evidence-labeled mapping with source citation.

**2. Infrastructure Pattern Analysis**

How does this actor build and maintain infrastructure? Which hosting providers? Which domain registration patterns? Which TLS certificate habits? What AS clustering? This enables [infrastructure pivoting](https://medium.com/@1200km/infrastructure-pivoting-how-cti-analysts-expand-from-a-single-ioc) to find new infrastructure before it is used.

**3. Targeting Characteristics**

What does a target look like to this actor? What sectors, what company sizes, what technology stack indicators, what geographies? Pre-attack reconnaissance indicators that may be visible in your honeypot telemetry or OSINT.

**4. Detection Guidance Mapped to Your Stack**

Not generic detection advice — specific detection requirements mapped to your SIEM and EDR capabilities:
- "This actor uses DCSync (T1003.006) for credential access. Detection requires Windows Event 4662 on your domain controllers with appropriate SACL configuration."
- "This actor deploys ISO-delivered LNK files for initial access. Detection requires monitoring for LNK execution and ISO mount events via Sysmon EventID 26."

**5. Coverage Gap Analysis**

Which of this actor's documented techniques do you currently have no validated detection for? This is the input to your detection engineering backlog.

---

## Tracking AI-Assisted Attack Evolution

Your threat intelligence must include tracking how AI tools are changing the TTPs of actors you follow.

This is new. Three years ago, CTI teams tracked actor TTP evolution on a timescale of months — the rate at which nation-state groups and professional criminal organizations evolved their methodology. That was tractable.

Now, lower-tier actors can evolve their tool set on a timescale of days, with AI assistance. The ransomware group that used standard Cobalt Strike last month may be using custom-built implants this month, not because they hired developers, but because they used AI to build one.

**Practical implications for CTI work:**

- When tracking an actor's tool set, note when novel, previously-unknown tools appear — this may indicate AI-assisted development rather than traditional tool development investment
- When tracking TTP changes, evaluate whether the change pattern suggests AI-researched evasion (changes specifically targeting known detection gaps) versus operational response to incident response activity
- Include AI tool usage as an intelligence collection requirement: are there indicators your tracked actors are using AI tools for development or reconnaissance?

---

## The CTI-SOC Feedback Loop Must Be Real

In too many organizations, CTI and SOC operate as separate silos. CTI produces reports quarterly. SOC processes alerts daily. The connection is a SharePoint folder.

This separation is a liability in the current environment:

**SOC → CTI feedback that CTI needs:**
- What are the top alert categories by volume? Which are high false-positive rate? Detection gap indicators come from knowing what the SOC is *not* seeing as much as what it is seeing.
- When an incident is confirmed, what TTPs were used? Feed this back to CTI immediately for actor profile updates.
- What suspicious but unconfirmed activity patterns are analysts noticing? These are hunting leads.

**CTI → SOC feedback that SOC needs:**
- When a new actor TTP report arrives, translate it immediately into specific hunt queries and detection rule updates — not a PDF to read when time permits.
- When a threat actor changes their tooling (relevant to your sector), flag affected detection rules for review.
- Pre-attack intelligence: if CTI has visibility into infrastructure associated with an actor targeting your sector, the SOC needs that as an actionable alert before the attack, not a threat report afterward.

---

## The "Strong CTI Team" Requirement

The characterization I keep returning to: CTI teams must be genuinely strong in the current environment. Not "processing IOC feeds" strong. Analytically strong, technically strong, and operationally connected.

**Analytical strength:** Structured analytical methodology, evidence-discipline in ATT&CK mapping, ability to distinguish confirmed observations from analyst inference. The [CTI Analyst Field Manual](https://github.com/anpa1200/cti-analyst-field-manual) and the [ATT&CK working tool guide](https://medium.com/@1200km/attck-as-a-working-tool-theory-and-hands-on-practical-usage) cover this in depth.

**Technical strength:** CTI analysts who understand how attacks actually work — not just what they are called. An analyst who has never used [Nmap](https://medium.com/@1200km/mastering-nmap-a-comprehensive-guide-to-network-exploration-and-security-auditing-f36d74d1b2c0), never run [Metasploit](https://medium.com/@1200km/the-ultimate-guide-to-metasploit-43c8573487df), never done [credential dumping in a lab](https://medium.com/@1200km/static-malware-analysis-file-fingerprinting) cannot accurately assess the detection implications of the TTPs they are mapping. The offense-defense understanding gap produces intelligence that sounds authoritative but misses practical implications.

**Operational connection:** CTI findings must flow directly to detection engineering and hunting, not into a report archive. The feedback loop described above must be real and fast.

---

**Continue:** [Threat-Informed Detection: The CTI→SOC Pipeline →](./threat-informed-detection)
