---
title: Threat-Informed Detection — The CTI→SOC Pipeline
sidebar_label: Threat-Informed Detection
sidebar_position: 2
description: "How to build the CTI-to-SOC pipeline that turns threat actor TTP profiles into validated detection coverage — and keeps it current."
---

# Threat-Informed Detection: The CTI→SOC Pipeline

Threat-informed detection is the practice of building and prioritizing detection rules based on the actual TTPs of actual adversaries targeting your organization — not based on generic best practices, vendor recommendations, or ATT&CK coverage percentages.

The concept is simple. The implementation requires three connected components that most organizations do not have fully working: a CTI capability that produces behavioral intelligence, a detection engineering function that consumes it, and a validation loop that confirms detections actually work.

---

## The Complete Pipeline

```
┌──────────────────────────────────────────────────────────────────────┐
│                     THREAT-INFORMED DETECTION PIPELINE               │
│                                                                      │
│  CTI                    Detection Engineering         SOC/Hunt       │
│  ───────────────        ──────────────────────        ──────────     │
│                                                                      │
│  1. Actor TTP profile   4. Translate TTPs to          8. Validate    │
│     (ATT&CK mapped,        detection requirements        rules fire  │
│     evidence-labeled)      (data source check)           in practice │
│         ↓                      ↓                            ↓        │
│  2. Coverage gap        5. Write/update Sigma          9. Hunt       │
│     analysis vs your       rules with ATT&CK              against    │
│     current detections     tags                           hypotheses │
│         ↓                      ↓                            ↓        │
│  3. Prioritized         6. Deploy and baseline         10. Feed back │
│     detection gap list  7. Purple team validate            findings  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

Each step is necessary. A gap at any point breaks the pipeline.

---

## Step 1: Build the Actor TTP Profile

This is CTI's core deliverable for the detection pipeline. For each priority threat actor, produce an ATT&CK-mapped behavioral profile with:

- Technique IDs for each documented behavior, at the most specific sub-technique the evidence supports
- Confidence labels per mapping (Observed / Reported / Assessed) — not a flat list
- Evidence citations per mapping (what source documents each technique)
- Infrastructure pattern notes

For the methodology, see [ATT&CK as a Working Tool](https://medium.com/@1200km/attck-as-a-working-tool-theory-and-hands-on-practical-usage) — specifically the mapping workflow, evidence discipline, and Navigator layer production sections.

For a real example: the [Handala Hack Group CTI Research](https://medium.com/@1200km/cti-research-handala-hack-group-aka-handala-hack-team-ddbdd294cfb8) and the [MuddyWater/Seedworm Research](https://github.com/anpa1200/CTI/blob/main/CTI_MuddyWater_Seedworm_Research.md) demonstrate production-grade behavioral profiles with evidence labeling.

---

## Step 2: Gap Analysis Against Current Detections

Take the actor's ATT&CK Navigator layer and overlay it against your current detection coverage layer. The gap is your detection backlog.

For each technique in the actor's profile that you do not have validated coverage for:

1. Check the ATT&CK technique page — Data Sources section
2. Verify you collect those data sources at the required fidelity
3. If data source gap: fix data collection *before* writing rules
4. If data is available: write the detection requirement

This is more specific than it sounds. T1003.001 (LSASS Memory) requires `Process: Process Access` — which means Sysmon EventID 10 configured with lsass.exe as a monitored target. If you have Sysmon deployed but without that specific configuration, your LSASS detection rule will never fire. The data source check is not optional.

---

## Step 3: Prioritize the Detection Gap

Not all gaps are equal. Prioritize your detection engineering backlog using three factors:

**Actor priority:** Which actors are most likely to target your organization? Your highest-priority actor's undetected techniques come first.

**Technique impact:** Techniques associated with high-impact outcomes (T1490 — VSS deletion before ransomware, T1003.003 — NTDS dump for domain compromise, T1485 — data destruction) are prioritized over low-impact techniques.

**Detection coverage gap breadth:** Techniques with zero coverage anywhere in your stack (no rule, no alert, no manual hunt procedure) come before techniques with partial coverage.

The output: a prioritized list of 10–20 detection requirements for your next sprint. Not 200 ATT&CK techniques — focused, prioritized, driven by actual threat data.

---

## Step 4: Translate to Detection Requirements

Each prioritized technique becomes a detection requirement handed to the engineering team. A proper detection requirement includes:

```
Technique: T1003.003 — OS Credential Dumping: NTDS
Actor: [Priority actor tracked by CTI]
Confidence in actor usage: High (documented in [source])

Required data sources:
  - Process creation (Sysmon EventID 1 or Windows Event 4688)
  - File access monitoring for ntds.dit path
  - VSS/shadow copy operation logging
  - ntdsutil.exe execution monitoring

Detection logic to implement:
  1. ntdsutil.exe execution with "activate instance ntds" or "ifm" arguments
  2. vssadmin.exe or WMIC executing shadow copy creation on C: drive
  3. File access to \Windows\NTDS\ntds.dit outside of expected AD processes
  4. Secretsdump-like patterns: rapid LSA registry hive reads followed
     by NTDS.dit read (if not directly, via shadow copy path)

False positive sources:
  - AD backup software (document expected parent processes)
  - NTDS maintenance by AD admins (should be rare and schedulable)

Priority: High — this technique is in Priority Actor A's documented TTP set
           with High confidence; we currently have no validated detection
```

This requirement hands the detection engineer everything they need: what data sources to check, what logic to implement, what false positives to filter, and the business justification.

---

## Step 5–6: Write, Deploy, and Baseline

For Sigma rule implementation methodology, see the [CTI Analyst Field Manual](https://github.com/anpa1200/cti-analyst-field-manual) — it covers the complete Sigma authoring workflow, ATT&CK tag conventions, and deployment process.

Key practices:
- Every rule gets ATT&CK tags (technique ID and tactic)
- Every rule gets documented false positive cases
- Every rule gets a baseline period before alerting (reduce false-positive noise during initial deployment)

---

## Step 7: Purple Team Validate

**The most commonly skipped step.** Do not count a technique as covered until a realistic test has confirmed the rule fires.

Using [Atomic Red Team](https://github.com/redcanaryco/atomic-red-team):

```powershell
# Before testing: confirm data sources are being collected
Invoke-AtomicTest T1003.003 -ShowDetails

# Run the test in your environment
Invoke-AtomicTest T1003.003 -TestNumbers 1

# Check within 5 minutes: did an alert fire?
# If yes: mark coverage as validated. Note detection time.
# If no: investigate root cause before closing the gap.

# Clean up after test
Invoke-AtomicTest T1003.003 -TestNumbers 1 -Cleanup
```

The purple team exercise should use AI-assisted red team techniques — not just standard Atomic Red Team tests. If your priority actors are now using AI to generate evasive tooling (as described throughout this guide), your purple team should test with the same capability level.

For the [threat hunting hypothesis library](https://github.com/anpa1200/threat-hunting-hypotheses), each hypothesis maps to specific ATT&CK techniques and can be used to generate purple team test plans.

---

## Step 8–10: Hunt, Validate in Production, Feed Back

Purple team testing confirms rules fire in a controlled environment. Production hunting confirms they work against real attacker behavior (where attacker tools may behave differently than test scripts).

For each priority threat actor technique:
- Schedule a proactive threat hunt using the ATT&CK-driven hunting methodology from [Threat Hunting with the Pyramid of Pain](https://medium.com/@1200km/threat-hunting-with-the-pyramid-of-pain-8add3cedb380) and [Endpoint Threat Hunting: Proactive Detection](https://medium.com/@1200km/endpoint-threat-hunting-proactive-detection-on-windows-linux-and-macos-f892d9b8a113)
- Document findings: confirmed malicious (escalate + new rule), suspicious (watchlist), benign (document baseline)
- Feed confirmed findings back to CTI for actor profile updates

The closed loop: CTI finds new actor TTP → detection engineering builds validated rule → SOC hunts to confirm → findings update CTI profile.

---

## Keeping the Pipeline Current

The pipeline needs regular cadence operations:

| Activity | Frequency | Owner |
|---|---|---|
| CTI actor TTP profile review | Monthly | CTI |
| Detection coverage review against actor profiles | Monthly | CTI + Detection Engineering |
| Detection rule validation (Atomic Red Team) | Quarterly | Detection Engineering + SOC |
| Purple team exercise | Semi-annually | Red Team + SOC |
| Detection freshness audit (last-validated date) | Quarterly | Detection Engineering |
| Hunt against priority actor TTPs | Monthly | Threat Hunting |

In the old world, these cadences could be longer because attacker tool sets changed slowly. In the current environment, a six-month gap between detection validation cycles may mean your detections have been bypassed by tool evolution you have not tracked.

---

**Continue:** [SOC Analyst Playbook — Immediate Actions →](../soc-playbook/immediate-actions)
