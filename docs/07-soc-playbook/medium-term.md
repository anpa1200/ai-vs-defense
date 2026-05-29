---
title: SOC Analyst Playbook — 90-Day Roadmap
sidebar_label: 90-Day Roadmap
sidebar_position: 2
description: "The 90-day detection program upgrade: purple team with AI-assisted red team, detection freshness program, threat actor profiles with detection guidance, and anomaly-first SIEM investment."
---

# SOC Analyst Playbook: The 90-Day Roadmap

The immediate actions in the previous section are things you can do now. This section is the structural program that needs to exist within 90 days if your detection strategy is going to keep pace with AI-assisted offense.

---

## Month 1: Know Your Real State

### Priority 1.1 — Complete Detection Audit and Navigator Layer

Complete the detection audit from the immediate actions section and build a Navigator layer that reflects *validated* coverage, not theoretical coverage.

The difference matters for decision-making. Theoretical: "we have a rule tagged T1003.001." Validated: "that rule fires when tested with Atomic Red Team against Sysmon EventID 10 data, detected in under 3 minutes."

Target output: a Navigator heatmap that shows:
- Green: validated detection (tested, confirmed to fire)
- Yellow: theoretical detection (rule exists, untested)
- Red: confirmed gap (no rule)
- Gray: out of scope for your environment

This is the baseline map for everything that follows.

### Priority 1.2 — Data Source Inventory

Before writing detection rules for your priority threat actor's TTPs, verify which data sources you are actually collecting at what fidelity.

**Critical data sources for behavioral detection:**

| Data Source | Required For | Collection Check |
|---|---|---|
| Sysmon EventID 1 (Process Creation) | Process behavior detection | Is command line captured? Full image path? |
| Sysmon EventID 10 (Process Access) | LSASS credential dump detection | Is lsass.exe a monitored target? |
| Sysmon EventID 8 (CreateRemoteThread) | Process injection detection | Deployed on critical endpoints? |
| Windows Event 4624/4625 (Logon) | Authentication analysis | Is full logon data captured? Source IP? |
| Windows Event 4662 (Directory Access) | DCSync detection | SACL configured on AD objects? |
| Windows Event 4688 (Process Creation) | Alternative to Sysmon | Command line audit enabled? |
| PowerShell Event 4104 (Script Block) | PowerShell abuse detection | Script block logging enabled? |
| DNS query logging | C2 beacon detection | Client-level DNS logging enabled? |
| Network flow data | C2 detection, exfiltration | Flow data for critical segments? |

For each data source gap: fix it before writing rules that depend on it. A rule without its required data source will never fire, silently.

### Priority 1.3 — Build Priority Threat Actor Profiles

Identify your top 3 priority threat actors (based on sector relevance, past incidents, and intelligence feeds). For each:

1. Find or build an ATT&CK Navigator layer for the actor (MITRE Group pages, ISACs, sector CISAs)
2. Overlay against your validated coverage map
3. Identify the top 5 undetected techniques for each actor
4. These 15 techniques (5 × 3 actors) become your detection engineering backlog for Month 2

Resources:
- [MITRE ATT&CK Groups](https://attack.mitre.org/groups/) — pre-built Navigator layers for tracked groups
- [CTI Research: Handala Hack Group](https://medium.com/@1200km/cti-research-handala-hack-group-aka-handala-hack-team-ddbdd294cfb8) — example of a fully produced behavioral profile
- [MuddyWater/Seedworm Research](https://github.com/anpa1200/CTI/blob/main/CTI_MuddyWater_Seedworm_Research.md) — another production example
- [ATT&CK as a Working Tool](https://medium.com/@1200km/attck-as-a-working-tool-theory-and-hands-on-practical-usage) — the full analytical methodology

---

## Month 2: Build and Deploy

### Priority 2.1 — Detection Engineering Against Your Gap Backlog

Work through the 15 detection requirements from Month 1. For each:

1. Verify data source is available (from Month 1 inventory)
2. Write Sigma rule with proper ATT&CK tags
3. Convert for your SIEM platform using sigma-cli
4. Deploy with a 2-week baselining period (no alerting, log-only mode)
5. Review false positives from baseline period
6. Enable alerting with tuned filters

For Sigma rule writing methodology, see the [CTI Analyst Field Manual](https://github.com/anpa1200/cti-analyst-field-manual) — it covers the complete Sigma authoring workflow and the CTI-to-detection engineering handoff.

**Don't forget the threat hunting side:** For each technique you are building detection for, also build a hunt hypothesis. Even before the detection is live, you can hunt manually for historical instances.

See the [Threat Hunting Hypotheses library](https://github.com/anpa1200/threat-hunting-hypotheses) for pre-built ATT&CK-aligned hypotheses.

### Priority 2.2 — Run a Purple Team Exercise (AI-Assisted Red Team)

This is non-optional if you want to validate that your detections work against realistic modern threats.

**The red team must use AI-assisted techniques.** If your purple team exercise uses entirely manual, traditional red team tools (standard Cobalt Strike, out-of-the-box Metasploit, unmodified Mimikatz), you are testing against 2022-era threat capability.

**What AI-assisted red team looks like for purple teaming:**

- Custom implants built with Cursor AI for the exercise (no existing signatures)
- C2 profiles tuned by AI against your specific Sigma rules
- Post-exploitation techniques selected by AI based on your documented coverage gaps
- Lateral movement patterns designed to avoid your authentication baselines

The goal is not to demonstrate that you can be compromised (you probably can). The goal is to determine which specific detection layers fire and which do not — and generate a concrete list of validated gaps.

**Exercise format:**

1. CTI provides actor TTP profile as the exercise scope
2. Red team builds emulation plan from that profile
3. Red team announces each technique before execution (so blue team notes exact timestamps)
4. Blue team checks detection within 5 minutes
5. Immediate documentation: detected / partial / missed / data gap
6. Post-exercise: confirmed gaps become Month 3 detection backlog

Resources for purple team methodology:
- [Threat Hunting with the Pyramid of Pain](https://medium.com/@1200km/threat-hunting-with-the-pyramid-of-pain-8add3cedb380) — covers the full ATT&CK-aligned purple team workflow

### Priority 2.3 — Implement UEBA for Privileged Accounts

If you do not have UEBA coverage for privileged accounts by end of Month 2, add it.

Minimum coverage:
- Domain Admin accounts: authentication baseline with off-hours alerting
- Service accounts: first-ever interactive logon alert (should fire immediately for any service account interactive logon — legitimate scenarios are essentially zero)
- High-value users: new device, new geography, anomalous resource access

This does not require a separate UEBA product if you have a capable SIEM. It requires SQL-queryable baseline data and deviation alerting logic built from it.

---

## Month 3: Validate, Iterate, and Systematize

### Priority 3.1 — Validate All Newly Deployed Rules

Every detection deployed in Month 2 gets a validation run with Atomic Red Team or equivalent before being counted as covered:

```powershell
# Validation template for each new detection
# 1. Run the test
Invoke-AtomicTest T{technique-id} -TestNumbers 1

# 2. Record result
#    - Alert fired: Yes/No
#    - Time to alert: X minutes
#    - Alert content accuracy: correct ATT&CK tag, correct severity
#    - False positive notes from baseline period

# 3. Update Navigator layer
#    - Green: validated detection confirmed
#    - Yellow: rule deployed but validation failed (investigate)

# 4. Clean up
Invoke-AtomicTest T{technique-id} -TestNumbers 1 -Cleanup
```

### Priority 3.2 — Establish Detection Freshness Program

Every detection rule should have a `last_validated` field. Rules older than 6 months without validation are flagged for review.

This is not administrative overhead. A rule that was valid against 2022 Cobalt Strike profiles may not fire against AI-tuned C2 profiles. A rule that detected Mimikatz by name is not detecting the custom credential dumper built with AI assistance last week. Regular validation is the mechanism for discovering this drift before an attacker exploits it.

**Freshness policy:**
- Critical rules (covering Tier 1 techniques in active actor profiles): validate quarterly
- High rules: validate semi-annually
- Medium/Low rules: validate annually

### Priority 3.3 — Establish Recurring Cadences

The threat landscape now changes faster. Static programs fail. Required recurring cadences:

| Cadence | Activity | Owner |
|---|---|---|
| Weekly | Review new sector CTI reports for TTP updates | CTI |
| Monthly | Hunt against priority actor TTP techniques | Threat Hunting |
| Monthly | Detection coverage review vs. actor profile | CTI + Detection Engineering |
| Quarterly | Atomic Red Team validation sweep | Detection Engineering |
| Quarterly | Detection freshness review | Detection Engineering |
| Semi-annually | Full purple team exercise (AI-assisted red team) | Red Team + SOC |
| Annually | Baseline recalibration for behavioral detections | SOC/Detection Engineering |

---

## What "Updated and Fit" Looks Like

This is the state you are working toward:

**CTI:** Produces behavioral intelligence products — actor TTP profiles with evidence labels, detection guidance mapped to your stack, gap analysis reports. Tracks AI-assisted TTP evolution as an active intelligence requirement.

**Detection Engineering:** Has a validated (not theoretical) ATT&CK coverage map. Has a prioritized detection backlog driven by threat data. Has a freshness program ensuring rule decay is tracked and remediated.

**SOC/Hunting:** Has behavioral baselines for critical assets. Has a hunt program scheduled around priority threat actor TTPs. Has fast feedback loops to CTI and detection engineering.

**Purple Team:** Runs exercises with AI-assisted red team capability. Tests custom-built tools with no existing signatures. Reports findings in ATT&CK-mapped format for direct integration with detection backlog.

This is not a perfect state. It is a continuously maintained state — which is the point. The offense is dynamic. The defense must match it.

---

## Quick Reference: Key Resources

**Research and guides referenced throughout this document:**

| Topic | Resource |
|---|---|
| AI-assisted pentesting | [HexStrike-AI Guide](https://anpa1200.github.io/Hexstrike-AI-guide/) |
| ATT&CK methodology | [ATT&CK as a Working Tool](https://medium.com/@1200km/attck-as-a-working-tool-theory-and-hands-on-practical-usage) |
| CTI analytical workflow | [CTI Analyst Field Manual](https://github.com/anpa1200/cti-analyst-field-manual) |
| Hunt hypotheses library | [Threat Hunting Hypotheses](https://github.com/anpa1200/threat-hunting-hypotheses) |
| CTI research examples | [CTI Research Repository](https://github.com/anpa1200/CTI) |
| Endpoint threat hunting | [Proactive Detection Guide](https://medium.com/@1200km/endpoint-threat-hunting-proactive-detection-on-windows-linux-and-macos-f892d9b8a113) |
| Network threat hunting | [Protocol-Level Hunting](https://medium.com/@1200km/protocol-level-network-threat-hunting-a-wireshark-centric-guide-a6770ffc96c6) |
| Pyramid of Pain original | [Threat Hunting with Pyramid of Pain](https://medium.com/@1200km/threat-hunting-with-the-pyramid-of-pain-8add3cedb380) |
| Malware analysis | [Static Analysis & File Fingerprinting](https://medium.com/@1200km/static-malware-analysis-file-fingerprinting) |
| AI offensive tools | [Full AI revolution overview](https://medium.com/@1200km/the-ai-revolution-in-cybersecurity) |
| Infrastructure analysis | [CVSS v4 Practical Guide](https://medium.com/@1200km/cvss-v4-practical-guide-for-security-teams) |
| All articles | [Medium: @1200km](https://medium.com/@1200km) |
| All projects | [GitHub: anpa1200](https://github.com/anpa1200) |

---

*Andrey Pautov — CTI Analyst and Security Researcher*  
*[Medium](https://medium.com/@1200km) · [GitHub](https://github.com/anpa1200) · [LinkedIn](https://linkedin.com/in/andrey-pautov) · [All Projects](https://anpa1200.github.io/)*
