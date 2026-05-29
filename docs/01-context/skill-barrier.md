---
title: The Old World — Why the Skill Barrier Existed
sidebar_label: The Skill Barrier
sidebar_position: 1
description: "The capability tier system, the Pyramid of Pain, and why defensive models assumed a high skill floor for sophisticated attacks."
---

# The Old World: Why the Skill Barrier Existed

To understand what AI changed, you first have to understand what the old system actually looked like — and why it provided an implicit layer of defense that most security programs never explicitly relied on, but absolutely depended on.

---

## The Capability Tier System

Threat actors were not created equal. For most of the last two decades, there was a meaningful, observable stratification by capability:

### Tier 1 — Nation-State and Elite Organized Crime

The top tier had everything: full in-house development teams, zero-day exploit stockpiles, custom implant frameworks built from scratch, dedicated OPSEC infrastructure, and the operational discipline to change TTPs when a campaign was burned.

What made this tier distinct was not just skill — it was **investment**. Developing a novel, undetected implant requires months of developer time, testing against current EDR products, kernel-level expertise, and deep knowledge of Windows internals. Maintaining operational infrastructure requires dedicated teams for domain registration, server provisioning, and identity management.

Examples: Sandworm (T-Mobile, NotPetya, Ukrainian power grid), [APT29 / Cozy Bear](https://attack.mitre.org/groups/G0016/) (SolarWinds, Democratic National Committee), [Lazarus Group](https://attack.mitre.org/groups/G0032/) (SWIFT banking attacks, WannaCry), FIN7 at peak capability.

### Tier 2 — Professional Criminal Ransomware Operators

This tier had real technical capability but primarily leveraged and modified existing frameworks rather than building from scratch. They purchased zero-days, leased Cobalt Strike licenses, hired developers for custom post-exploitation modules, and invested in operational security without maintaining the full infrastructure of Tier 1.

The key characteristic: **they were profitable enough to invest in evasion**. When a Cobalt Strike profile became commonly detected, they tuned it. When a persistence mechanism was burned, they had alternatives ready.

Examples: LockBit operators, ALPHV/BlackCat, Cl0p, the Lapsus$ group at peak sophistication.

### Tier 3 — Commodity Threat Actors

At this level, actors used publicly available, signature-known tools. Mimikatz for credential dumping, PsExec for lateral movement, Metasploit for exploitation, PowerSploit for post-exploitation. No custom development. Limited infrastructure sophistication.

The critical defensive implication: **their tool signatures were known and detectable**. A competent SOC with current EDR signatures and basic Sigma rules could catch most Tier 3 activity. The Pyramid of Pain held them at the bottom two tiers — change the tool, get detected on the same signature; keep the tool, same result.

### Tier 4 — Script Kiddies

No technical depth. Downloaded tools from GitHub, followed video tutorials, used known CVE exploit scanners without understanding the vulnerabilities. Predictable, signature-matched, easily blocked. Not a serious threat to any organization with basic security hygiene.

---

## Why This Stratification Was an Implicit Defense

Here is what the tier system actually meant for defensive strategy:

**Most threat actors were Tier 3 or 4.** The overwhelming majority of attacks — the ones that fill SOC alert queues — came from actors using known tools with known signatures. Standard signature-based detection, IOC feeds, and threshold alerts handled most of the volume.

**Tier 1 and 2 were rare.** Nation-state and elite criminal actors existed, but they targeted specific organizations. The statistical likelihood of a random mid-market company facing a custom APT implant was low. Enterprises could afford to prioritize the common case (Tier 3/4) and accept residual risk from the rare case (Tier 1/2).

**The gap between tiers was wide.** A Tier 4 actor could not become Tier 1 by learning more. The resources required — time, money, expertise, infrastructure — represented a genuine barrier. This gap was stable.

Your defensive controls assumed this distribution. They were built to handle the common case reliably and accept some risk at the top.

---

## The Pyramid of Pain: Built for This World

David Bianco's [Pyramid of Pain](https://medium.com/@1200km/threat-hunting-with-the-pyramid-of-pain-8add3cedb380) (2013) formalized the asymmetry between attacker and defender at each indicator tier:

```
         ╔══════════════════╗
         ║      TTPs        ║  ← Hardest for attacker to change
         ╠══════════════════╣
         ║     Tools        ║
         ╠══════════════════╣
         ║ Network Artifacts║
         ╠══════════════════╣
         ║  Host Artifacts  ║
         ╠══════════════════╣
         ║  Domain Names    ║
         ╠══════════════════╣
         ║   Hash Values    ║  ← Trivial for attacker to change
         ╚══════════════════╝
```

The model's elegant logic: **force the attacker to operate higher up the pyramid**. Stop blocking hashes (trivially changed with a recompile) and start detecting behavioral patterns (expensive to change because it requires re-engineering the attack).

The model worked because the cost asymmetry was real and anchored in the tier system:

- **Developing novel tools** required Tier 1 or Tier 2 resources — developer time, testing infrastructure, EDR evasion expertise
- **Changing TTPs fundamentally** required re-engineering attack methodology — which required the expertise and organizational structure of upper-tier actors
- **Tier 3 actors** were stuck at the bottom of the pyramid by their own skill ceiling. They used known tools with known signatures. When those signatures were caught, they were caught.

The pyramid was not just a detection philosophy. It was a description of how the capability tier system created a natural containment mechanism for most attackers.

---

## The Assumptions That Are Now Broken

The Pyramid of Pain rested on three assumptions that were reasonable in 2013–2022:

**Assumption 1:** Developing novel tools requires Tier 1/2 resources.

**Assumption 2:** Changing TTPs requires deep expertise and significant time investment.

**Assumption 3:** Most actors are Tier 3/4 and will remain so.

All three assumptions fail in the presence of capable AI assistance.

The next sections explain why — with specific, hands-on evidence.

---

**Continue:** [AI and the Collapse of the Skill Floor →](../02-offensive-ai/skill-floor-collapse)
