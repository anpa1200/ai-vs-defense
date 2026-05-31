---
title: SOC Analyst Playbook — Immediate Actions
sidebar_label: Immediate Actions
sidebar_position: 1
description: "Concrete actions you can take this month: detection audit, validation testing, baseline establishment, and adversarial rule review."
---

# SOC Analyst Playbook: Immediate Actions (This Month)

The previous sections explained why the threat model changed. This section is about what you do about it. Starting now, not after the next planning cycle.

---

## Action 1: Audit Your Detection Coverage Against the Pyramid

Run an honest assessment of where your current detection investment sits on the Pyramid of Pain.

**How to do it:**

1. Pull a list of all active detection rules in your SIEM/EDR
2. Categorize each rule: hash/signature, IP/domain IOC, static YARA, threshold-based, ATT&CK behavioral, or baseline deviation
3. Count rules per category
4. For ATT&CK behavioral rules: check whether they are *genuinely* behavioral (detect what the technique *does*) or signature rules dressed with ATT&CK tags (detect a specific tool's pattern)

**What you will likely find:**

Most organizations discover that 60–80% of their detection volume is concentrated at the bottom two tiers (hash/signature and IOC matching) — the least robust against AI-assisted offense.

**The target state:** Behavioral and baseline-based rules should constitute the majority of your high-fidelity, low-false-positive alert pipeline. Signature rules are still useful as a first filter but should not dominate the detection strategy.

---

## Action 2: Validate Your Critical TTP Detections with Atomic Red Team

For every technique in your priority threat actor's profile that you believe you have detection coverage for, run the actual test. Do not assume the rule works. Verify it.

**Setup:**

```powershell
# Install invoke-atomicredteam
Install-Module -Name invoke-atomicredteam, powershell-yaml -Scope CurrentUser
Import-Module invoke-atomicredteam
```

**Start with the highest-impact techniques for ransomware/APT scenarios:**

```powershell
# T1490 — Inhibit System Recovery (VSS deletion)
# This is the last detection before ransomware executes
Invoke-AtomicTest T1490 -ShowDetailsBrief
Invoke-AtomicTest T1490 -TestNumbers 1
# Did your alert fire? Check within 5 minutes.

# T1003.001 — LSASS Credential Dumping
Invoke-AtomicTest T1003.001 -ShowDetailsBrief
Invoke-AtomicTest T1003.001 -TestNumbers 1
# Requires Sysmon EventID 10 for lsass.exe — verify data source first

# T1059.001 — Malicious PowerShell
Invoke-AtomicTest T1059.001 -TestNumbers 1
# Download cradle patterns — should trigger your PS logging rules

# T1055.001 — DLL Injection
Invoke-AtomicTest T1055.001 -TestNumbers 1
# Process injection — tests Sysmon EventID 8/10 coverage

# T1003.003 — NTDS Credential Dumping
Invoke-AtomicTest T1003.003 -TestNumbers 1
# ntdsutil execution and shadow copy patterns
```

**For each test: document the result in your ATT&CK Navigator layer:**
- PASS: Detected (alert fired, correct content, within acceptable time)
- PARTIAL: Alert fired but noisy or late
- FAIL: Missed (alert did not fire — investigate root cause)
- DATA GAP: Telemetry not collected — fix data source first

**The validated Navigator layer is your real coverage map** — not the theoretical one with all your rules mapped to ATT&CK IDs.

For the full ATT&CK Navigator gap analysis workflow, see [ATT&CK as a Working Tool](https://medium.com/@1200km/attck-as-a-working-tool-theory-and-hands-on-practical-usage) and the [CTI Analyst Field Manual](https://github.com/anpa1200/cti-analyst-field-manual).

---

## Action 3: Establish Behavioral Baselines for Your Top 10 High-Risk Assets

Pick your 10 highest-risk assets (privileged user accounts, domain controllers, crown-jewel servers, privileged workstations). Start building behavioral baselines for them now.

**Authentication baselines (start here — lowest effort, high value):**

```sql
-- Query: Establish logon time baseline for privileged accounts
-- Run against last 90 days; exclude known maintenance windows

SELECT
    AccountName,
    DAYOFWEEK(TimeCreated) AS day_of_week,
    HOUR(TimeCreated) AS hour_of_day,
    LogonType,
    WorkstationName,
    IpAddress,
    COUNT(*) AS frequency
FROM windows_security_events
WHERE EventID = 4624
  AND AccountName IN (/* your privileged account list */)
  AND TimeCreated > DATEADD(day, -90, GETDATE())
GROUP BY AccountName, day_of_week, hour_of_day, LogonType, WorkstationName, IpAddress
ORDER BY AccountName, frequency DESC;
```

The output tells you: normal logon patterns per account. Any future logon that falls outside this distribution is an anomaly worth investigating.

**Process baseline (for domain controllers and crown-jewel servers):**

Enable Sysmon on critical servers if not already present, then:

```powershell
# List all processes created in past 30 days on a specific server
# (from Sysmon EventID 1 logs)
# Build a whitelist of expected process names and parent processes

# Focus on: unexpected parents for PowerShell, cmd, wscript, cscript
# Unexpected: anything spawning from Office apps, browsers, 
#             email clients, or custom LOB applications
```

For the full methodology on building and hunting against these baselines, see [Endpoint Threat Hunting: Proactive Detection on Windows, Linux, and macOS](https://medium.com/@1200km/endpoint-threat-hunting-proactive-detection-on-windows-linux-and-macos-f892d9b8a113) and [Protocol-Level Network Threat Hunting](https://medium.com/@1200km/protocol-level-network-threat-hunting-a-wireshark-centric-guide-a6770ffc96c6).

---

## Action 4: Review Your Threshold-Based Alerts with Adversarial Eyes

For each threshold-based alert in your SIEM, ask: **"If I knew this exact threshold, how would I operate to stay below it while still achieving my attack goal?"**

**Examples to review:**

| Alert | Threshold | Adversarial bypass |
|---|---|---|
| Brute-force detection | 5 failed logins / 60s | 1 attempt / 30min from distributed infrastructure |
| PowerShell encoded command | Any `-enc` flag | Vary encoding; use other obfuscation methods |
| Port scan detection | 20+ ports scanned in 60s | Slow scan: 1 port / 5min over 12h |
| Data exfiltration | Outbound > 500MB in 1h | 50MB/day across 10 days |
| Unusual logon time | Outside 8am–10pm | Time attack to match normal peak hours |

Alerts that can be trivially defeated by operating slightly below the threshold should be:
- Supplemented with behavioral correlation (not replaced — they still catch lazy attackers)
- Tuned to combine with adjacent signals that are harder to simultaneously avoid

This review typically reveals a significant number of alerts that are providing false confidence — they look like detection coverage but an AI-assisted attacker can research and avoid them in minutes.

---

## Action 5: Add LSASS and VSS as Immediate Priority Detections

If you have none of the following, these are your two highest-priority immediate detections — because they protect against credential domain compromise and ransomware respectively, and they detect behavior regardless of tool:

**LSASS access monitoring (Sysmon EventID 10):**

```yaml
# Sigma rule: suspicious LSASS access
title: Suspicious LSASS Process Access
id: d7f9a54c-f1c6-4c99-b3a8-7e3b8c7d4e2f
status: test
description: Detects any process accessing LSASS memory — potential credential dumping
references:
  - https://attack.mitre.org/techniques/T1003/001/
tags:
  - attack.credential_access
  - attack.t1003.001
logsource:
  category: process_access
  product: windows
detection:
  selection:
    TargetImage|endswith: '\lsass.exe'
    GrantedAccess|contains:
      - '0x1010'
      - '0x1410'
      - '0x147a'
      - '0x143a'
  filter_legitimate:
    SourceImage|contains:
      - '\MsMpEng.exe'
      - '\csrss.exe'
      - '\wininit.exe'
      - '\services.exe'
      - '\lsass.exe'
  condition: selection and not filter_legitimate
falsepositives:
  - Security scanning tools with valid business use
  - Some legitimate EDR/AV products (add to filter_legitimate)
level: high
```

**VSS deletion monitoring:**

```yaml
title: Volume Shadow Copy Deletion — Pre-Ransomware Indicator
id: b3c4e6f0-2a7b-4d5c-9e1f-3d8a7b6c5e4d
status: test
description: Detects deletion of shadow copies — commonly precedes ransomware execution
references:
  - https://attack.mitre.org/techniques/T1490/
tags:
  - attack.impact
  - attack.t1490
logsource:
  category: process_creation
  product: windows
detection:
  selection:
    CommandLine|contains:
      - 'vssadmin delete shadows'
      - 'wmic shadowcopy delete'
      - 'bcdedit /set recoveryenabled no'
      - 'bcdedit /set bootstatuspolicy ignoreallfailures'
      - 'wbadmin delete catalog'
  condition: selection
falsepositives:
  - Legitimate backup rotation software (verify and add to allowlist)
level: critical
```

Validate both rules with Atomic Red Team immediately after deployment:
```powershell
Invoke-AtomicTest T1003.001  # Tests LSASS access detection
Invoke-AtomicTest T1490       # Tests VSS deletion detection
```

---

**Continue:** [Medium-Term Roadmap (90-Day Plan) →](./medium-term)
