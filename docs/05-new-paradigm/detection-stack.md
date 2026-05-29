---
title: "The Detection Stack: What Survives AI-Assisted Offense"
sidebar_label: Detection Stack Assessment
sidebar_position: 2
description: "An honest tiered assessment of detection approaches and their robustness against AI-assisted attackers who use novel tools and AI-researched evasion."
---

# The Detection Stack: What Survives AI-Assisted Offense

Not all detections are equally robust against AI-assisted attackers. This section provides a tiered assessment of each detection approach, honest about what still works and what is losing reliability.

---

## The Robustness Spectrum

```
                     ROBUSTNESS TO AI-ASSISTED OFFENSE

LOW ◄──────────────────────────────────────────────────────► HIGH

  Hash     IP/      Static    Threshold   Process    Auth/Net   Cross-signal
 matching  Domain    YARA      alerts    baselines  baselines  correlation
          IOCs                          (single)
```

The robustness of a detection correlates strongly with one factor: **how much it depends on environment-specific normal behavior versus publicly documented attack signatures.**

---

## Tier 1 — Low Robustness (Signature-Based)

These detection types are losing reliability and should not be your primary investment for new controls:

### Hash Matching
**Robustness:** Very Low

Hash matching remains useful for known-bad files from previous campaigns. It provides zero value against novel tools — which is an increasingly large category.

Appropriate use: Keep hash matching as a quick-win layer, but do not build detection strategy around it. For known commodity malware from historical campaigns, it still fires.

### IP/Domain IOC Matching
**Robustness:** Very Low

Always weak (infrastructure was always rotatable), now even more so. Useful for blocking known-bad infrastructure while it is still active, but provides minimal detection value beyond that.

For organizations that want to do infrastructure attribution properly, the [infrastructure pivoting methodology](https://medium.com/@1200km/infrastructure-pivoting-how-cti-analysts-expand-from-a-single-ioc) provides techniques for tracking attacker infrastructure *before* it is burned — which is far more valuable than blocking already-rotated IOCs.

### Static String YARA Rules
**Robustness:** Low

AI-varied strings and AI-assisted obfuscation defeat static YARA rules. A custom binary developed with [Cursor AI](https://medium.com/@1200km/how-cursor-ai-became-my-full-stack-development-partner-from-arduino-code-to-visual-validation-47fcccb9c845) will not contain strings from known tool repositories.

Appropriate use: Maintain YARA rules for known malware families as a triage aid. Expand toward behavioral YARA rules (memory scanning patterns, code structure patterns) which are harder to vary.

---

## Tier 2 — Moderate Robustness (Behavioral Signatures)

These approaches are more robust because they describe behavioral patterns rather than specific tool signatures:

### ATT&CK TTP-Based Detection (Validated)
**Robustness:** Moderate–High

ATT&CK-mapped behavioral detections — rules built around what techniques *do* rather than what tools are named — have meaningful robustness against novel tooling.

The key word is *validated*. A Sigma rule tagged `attack.t1003.001` that only detects Mimikatz by name is a signature rule dressed as a TTP rule. A rule that detects any process accessing LSASS memory via Sysmon EventID 10 is a genuine TTP detection.

For building ATT&CK-aligned behavioral detections with proper data source coverage, see the [ATT&CK as a Working Tool methodology](https://medium.com/@1200km/attck-as-a-working-tool-theory-and-hands-on-practical-usage). For the Sigma implementation workflow, the [CTI Analyst Field Manual](https://github.com/anpa1200/cti-analyst-field-manual) covers detection engineering integration.

**Important:** ATT&CK TTP detection is only as good as its data sources. Before writing detection rules for a technique, verify the required data sources (listed on each ATT&CK technique page) are actually being collected in your environment at the necessary fidelity. A LSASS access detection rule is useless without Sysmon EventID 10 configured for lsass.exe as a target.

### Process Relationship Anomaly Detection
**Robustness:** Moderate–High

Process trees that deviate from established baselines are hard for attackers to avoid: they must execute code somewhere, and that execution will show up as a process relationship.

The detection is strongest when combined with baselines (as described in the previous section) rather than static rules: "this specific parent-child relationship has never appeared in 90 days of historical data" is more reliable than "`winword.exe` spawning `cmd.exe` matches a known rule."

---

## Tier 3 — High Robustness (Baseline-Dependent)

These detection types are the most robust against AI-assisted offense because they cannot be circumvented without knowledge of your specific environment:

### User/Entity Behavioral Baseline Deviation (UEBA)
**Robustness:** High

UEBA detections alert on deviation from a user's or entity's established behavioral profile. An attacker using stolen credentials must behave in ways consistent with how that user normally behaves — which requires knowing the baseline, which requires prolonged, low-visibility reconnaissance of your monitoring infrastructure.

The implementation challenge is real: baseline establishment requires 30–90 days of clean data, maintenance requires handling legitimate behavioral drift (role changes, new projects, seasonal patterns), and tuning requires close collaboration between detection engineering and the business.

But when implemented correctly, UEBA provides detections that:
- Are specific to your environment (not publicly documented)
- Cannot be researched from public Sigma/ATT&CK resources
- Require the attacker to have prior knowledge of your monitoring to evade

### Network Traffic Statistical Baseline Deviation
**Robustness:** High

Network baselines catch anomalous communication patterns regardless of tool signature. An encrypted C2 channel, even one configured to blend with HTTPS traffic, creates new external connections that may not be in the established baseline for that endpoint.

Practical implementation layers:
- Per-endpoint external destination whitelist (alert on first-time external connections)
- Per-process network volume baseline (alert on statistical outliers)
- DNS query frequency and cardinality baseline (alert on spikes and unusual query patterns)
- Per-AS outbound connection baselines (alert on new AS numbers for sensitive endpoints)

Related: [Protocol-Level Network Threat Hunting](https://medium.com/@1200km/protocol-level-network-threat-hunting-a-wireshark-centric-guide-a6770ffc96c6) covers the methodology for building and hunting against network behavioral baselines.

### Cross-Signal Correlation (Multi-Layer)
**Robustness:** Very High

The most robust detection is not any single signal — it is the correlation of multiple independent signals that would individually be borderline:

```
Example: Correlated alert from three weak signals

Signal 1: Authentication to a server outside normal hours (weak alone)
Signal 2: New external connection from same system 10 minutes later (weak alone)
Signal 3: Volume spike in DNS queries from same system (weak alone)

Combined: High-confidence lateral movement + C2 establishment indicator
```

Each individual signal has a high false-positive rate. Correlated together, they become a high-confidence indicator that is extremely difficult for an attacker to defeat — because defeating it requires simultaneously avoiding three independent detection mechanisms, each monitoring different aspects of behavior.

AI-assisted attackers can optimize against known threshold rules (single signals). Optimizing against correlated multi-signal detections requires knowing all three signals and their correlation logic — which is not publicly documented.

---

## The Detection Investment Matrix

A practical framework for allocating detection engineering effort:

| Detection Type | New Investment Priority | Maintenance Priority |
|---|---|---|
| Hash matching | None (new rules) | Low (auto-updated feeds) |
| IP/Domain IOC | None (new rules) | Low (threat feed automation) |
| Static YARA | Low | Low |
| Threshold alerts (existing) | None (new rules) | High (tune false positives) |
| ATT&CK TTP behavioral | **High** | **High** |
| Process baseline | **High** | **High** |
| Auth/network baseline | **High** | **High** |
| Cross-signal correlation | **High** | **Moderate** |

The message is: **stop investing in new threshold and signature rules; invest in validated behavioral detections and baseline-based anomaly detection.**

This does not mean deleting your existing signature rules. They still catch commodity threats and provide quick wins on known-bad. It means the marginal next dollar of detection engineering effort should go toward behavioral detection, not toward a 1,001st Sigma rule that matches the 1,001st documented Cobalt Strike pattern.

---

## Practical Minimum Baseline: What Every SOC Should Have

If you are starting from scratch on behavioral detection, prioritize in this order:

1. **LSASS access monitoring** (Sysmon EventID 10) — catches credential dumping regardless of tool
2. **Service account interactive logon alerting** — catches lateral movement with stolen credentials
3. **Process injection indicators** (Sysmon EventID 8, 10) — catches memory-based C2
4. **New external connection alerting for sensitive endpoints** — catches C2 regardless of profile
5. **Off-hours authentication alerting for privileged accounts** — catches attacker use of stolen credentials
6. **VSS deletion and recovery-inhibition commands** — last line before ransomware impact (see [ATT&CK T1490](https://attack.mitre.org/techniques/T1490/))

These six give you meaningful detection coverage against the critical phases of a modern intrusion regardless of what tools the attacker uses — because they monitor the *actions* that matter, not the *tools* performing them.

---

**Continue:** [What Your CTI Team Must Now Do →](../cti-evolution/beyond-ioc-feeds)
