---
title: The New Defense Paradigm — Behavioral Baselines
sidebar_label: Behavioral Baselines
sidebar_position: 1
description: "From 'known bad' to 'unknown anomalous': behavioral baselines, statistical detection, and why environment-specific baselines are your most robust defensive layer."
---

# The New Defense Paradigm: Behavioral Baselines

The previous section described what is failing. This section describes what works — and more importantly, *why* it works against AI-assisted offense.

The core shift: **from "block the known bad" to "detect the unknown anomalous."**

---

## The Fundamental Orientation Change

**Old paradigm:** I know what bad looks like. I have signatures, hashes, and IOC lists. If something matches, it is bad.

**New paradigm:** I do not reliably know what bad looks like in advance. But I know what my environment normally looks like. When something deviates from that normal, it is suspicious.

This is not a new concept. UEBA (User and Entity Behavior Analytics) has existed for years. Machine learning-based anomaly detection is a standard SIEM feature. The shift I am describing is in **priority and emphasis**: these behavioral approaches need to move from supplementary layers on top of signature detection to *primary* layers.

AI can generate a tool that has no known signature. It cannot easily make that tool behave in ways that are indistinguishable from the normal behavior of your environment — because your normal behavior is specific, documented by your history, and not publicly available.

---

## Building Behavioral Baselines

A behavioral baseline is a statistical model of normal behavior for a user, endpoint, or process in your environment. Detections built on deviation from this baseline are robust against novel tooling because the baseline is:

1. **Environment-specific** — an attacker researching public Sigma rules cannot know what "normal PowerShell usage" looks like in your organization specifically
2. **Dynamic** — baselines evolve with your environment, unlike static rules that age
3. **Difficult to impersonate** — staying below a baseline requires knowing the baseline, which requires prolonged reconnaissance of your monitoring

### Process Behavior Baselines

For each critical process in your environment, establish:

**Parent-child relationships:**
- What processes does `explorer.exe` normally spawn? Distribution over 90 days.
- What is the typical parent of `powershell.exe` in your environment? Which specific applications invoke it?
- When does `cmd.exe` get spawned by Office applications? (Rarely, if ever, on clean systems)

**Command-line profile:**
- What is the typical command-line length distribution for PowerShell invocations?
- What flags are normally used in your legitimate scripts?
- What is the normal frequency of `powershell.exe -enc` (encoded command) invocations?

**Deviation detection:** When a new parent-child relationship appears, when command-line patterns deviate significantly from the established distribution, when invocation frequency spikes — these are anomalies worth investigating regardless of whether the invoked tool has a known signature.

Related methodology: [Endpoint Threat Hunting: Proactive Detection on Windows, Linux, and macOS](https://medium.com/@1200km/endpoint-threat-hunting-proactive-detection-on-windows-linux-and-macos-f892d9b8a113) covers the practical implementation of process behavioral monitoring and anomaly hunting.

### Authentication Baselines

For each user account and service account:

**Logon patterns:**
- Normal logon times (day of week, hour of day)
- Normal source IP ranges and geographies
- Normal logon types (interactive vs. network vs. remote interactive)
- Normal frequency of authentication events

**Service account specifics:**
- Service accounts should **never** have interactive logons (type 2 or 10)
- Service accounts should authenticate from expected source systems only
- Authentication frequency for service accounts should be highly predictable

**Deviation detection:** Interactive logon for a service account, authentication from an unexpected geography, off-hours authentication that has no historical precedent, sudden spike in authentication frequency — all signal worthy of investigation regardless of whether a credential dumping tool was detected.

The [Protocol-Level Network Threat Hunting guide](https://medium.com/@1200km/protocol-level-network-threat-hunting-a-wireshark-centric-guide-a6770ffc96c6) covers network-level authentication pattern analysis, including Kerberos and NTLM behavioral baselines.

### Network Communication Baselines

For each endpoint and application:

**Destination profile:**
- Normal set of external FQDNs and IP ranges communicated with
- Normal protocol distribution (HTTP vs HTTPS vs SMB vs DNS)
- Normal outbound volume per hour/day
- Normal external AS numbers (cloud providers, CDNs, SaaS vendors)

**TLS/certificate profile:**
- Normal certificate authorities encountered
- Normal cipher suites used
- Normal SNI patterns for HTTPS connections

**Deviation detection:** A new external destination that has no historical precedent for that endpoint, a spike in DNS query volume, an encrypted channel to a new IP not in the normal destination profile — these all warrant investigation regardless of whether the C2 traffic matches a known profile.

### Memory Behavior Baselines

This is the most powerful layer against process injection attacks — and the most technically demanding to implement:

**Memory profile:**
- Normal working set size for critical processes
- Normal loaded module list for `explorer.exe`, `lsass.exe`, and browser processes
- Normal remote thread creation patterns (which processes create threads in which other processes)

**Deviation detection:** A new module loaded into `explorer.exe` with no corresponding file on disk (reflective DLL injection), a process access event to `lsass.exe` from an unexpected process, an anomalous spike in working set size — all indicators of process injection regardless of the injection tool's signature.

---

## Statistics Over Signatures: Practical Comparisons

Let me contrast the signature approach with the statistical baseline approach for specific scenarios:

### Credential Dumping Detection

**Signature approach:**
```
Alert: Process "mimikatz.exe" executed
Alert: Command line contains "sekurlsa::logonpasswords"
Alert: Known Mimikatz import hash detected
```
*AI-assisted bypass: Custom tool with different name, different imports, different strings. All alerts miss.*

**Baseline approach:**
```
Alert: lsass.exe accessed by process outside established baseline set
       (Sysmon EventID 10, target = lsass.exe, source NOT IN [known_good_list])

Alert: Process with handle to lsass.exe reading memory at anomalous frequency
       (statistical deviation from 30-day baseline for lsass access events)

Alert: New process reading lsass.exe that has no file-on-disk record
       (Sysmon EventID 1 + EventID 10 correlation, file creation not observed)
```
*AI-assisted bypass: Very difficult. The attacker must access LSASS — that access is the anomaly, not the tool identity.*

### Lateral Movement Detection

**Signature approach:**
```
Alert: psexec.exe or psexesvc.exe detected (Windows Event 7045)
Alert: Metasploit psexec module command line pattern
Alert: SMB admin share access with specific tool fingerprint
```
*AI-assisted bypass: Custom lateral movement tool, no psexec binary, no known signatures. All alerts miss.*

**Baseline approach:**
```
Alert: New SMB lateral connection from workstation X to server Y —
       this specific source-destination pair has no historical precedent
       in the past 90 days

Alert: Service installed on remote system during business hours from
       non-admin workstation — matches behavioral profile of lateral
       movement but not a known tool

Alert: Domain Admin account authenticating to server Z that it has
       never previously accessed — deviation from established access baseline
```
*AI-assisted bypass: The attacker must make lateral connections. New source-destination pairs are anomalous regardless of tool.*

---

## The Baseline Investment vs. Signature Investment

Building and maintaining behavioral baselines is more operationally demanding than adding Sigma rules:

| Approach | Implementation Effort | Maintenance Effort | Robustness to Novel Tools |
|---|---|---|---|
| Signature/IOC rule | Low | Low (mostly automatic) | Low |
| Threshold alert | Low | Moderate (threshold tuning) | Low |
| Process baseline | Moderate | Moderate (baseline drift management) | High |
| Authentication baseline | Moderate | Moderate | High |
| Network baseline | Moderate–High | High | High |
| Memory behavioral | High | High | Very High |

The investment difference is real. But the threat model has changed in a way that makes the lower-effort signature approach less reliable. The organizations that will detect AI-assisted intrusions are the ones that invested in behavioral baselines — not the ones with the largest Sigma rule library.

---

**Continue:** [The Detection Stack: What Survives AI-Assisted Offense →](./detection-stack)
