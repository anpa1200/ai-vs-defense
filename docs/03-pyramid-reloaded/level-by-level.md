---
title: The Pyramid of Pain, Post-AI
sidebar_label: Level-by-Level Analysis
sidebar_position: 1
description: "A level-by-level analysis of the Pyramid of Pain with AI assistance: what does it cost an attacker to change each indicator type today?"
---

# The Pyramid of Pain, Post-AI

The [Pyramid of Pain](https://medium.com/@1200km/threat-hunting-with-the-pyramid-of-pain-8add3cedb380) remains the right conceptual model for thinking about detection. Indicators higher up the pyramid are still harder for attackers to change than indicators lower down.

But **"harder" is not absolute — it is relative to the attacker's resources and expertise.** AI has significantly lowered the cost at every level. The question for each level is: what does it now actually cost an AI-assisted attacker to change this indicator?

---

## The Updated Pyramid

```
         ╔══════════════════════════════════════════╗
         ║          TTPs                            ║  Days to weeks (↓ from months)
         ╠══════════════════════════════════════════╣
         ║          Tools                           ║  Days (↓ from months/years)
         ╠══════════════════════════════════════════╣
         ║       Network Artifacts                  ║  Hours (↓ from days)
         ╠══════════════════════════════════════════╣
         ║        Host Artifacts                    ║  Hours (↓ from days)
         ╠══════════════════════════════════════════╣
         ║        Domain Names                      ║  Minutes (unchanged)
         ╠══════════════════════════════════════════╣
         ║         Hash Values                      ║  Minutes (unchanged, trivially automated)
         ╚══════════════════════════════════════════╝
```

The arrow at each level indicates the direction costs moved with AI assistance. The bottom two levels are unchanged — they were already trivial. The top four levels have all shifted significantly.

---

## Level 1 — Hash Values

**Cost to change (2020):** Minutes. Recompile with any trivial source modification.

**Cost to change (2025):** Minutes, now with automation. AI can generate functionally equivalent malware variants on demand:

```
Prompt: "Rewrite this C2 agent with different function names, 
         different XOR key, different beacon interval randomization, 
         and different registry key names for persistence. Keep all 
         functional behavior identical."
```

Result: A new binary hash in under 10 minutes. No detection on any existing signature.

Hash-based detection was already the weakest indicator. This is unchanged in principle, only accelerated in practice.

**Defensive action:** Hash matching should be the last layer you build on, not the first. It was never reliable; it is now even less so.

---

## Level 2 — IP Addresses and Domain Names

**Cost to change (2020):** Minutes. Domain registration and fast-flux DNS were already trivially available.

**Cost to change (2025):** Minutes. Unchanged.

This level has always been weak. Fast flux DNS, bulletproof hosting, legitimate cloud infrastructure abuse, and domain generation algorithms all predate AI. AI adds nothing significant here.

**Defensive action:** IP and domain blocking has always been a rear-guard action. Block known-bad, but do not invest in this layer as primary detection. Focus on infrastructure analysis — registration patterns, TLS certificates, AS clustering — which is harder to change even with AI. For full methodology, see [Infrastructure Pivoting: From Single IOC to Full Network Map](https://medium.com/@1200km/infrastructure-pivoting-how-cti-analysts-expand-from-a-single-ioc).

---

## Level 3 — Network Artifacts

Network artifacts include C2 protocol signatures, HTTP User-Agent strings, TLS certificate characteristics, beacon timing patterns, and custom protocol headers.

**Cost to change (2020):** Days. Required understanding Cobalt Strike's malleable C2 profile format, knowing which signatures defenders were looking for, and testing against detection platforms.

**Cost to change (2025):** Hours. The process is now a prompt:

```
Prompt: "Here are the public Sigma rules for detecting Cobalt Strike C2 
         traffic. Review my current C2 profile configuration. Suggest 
         modifications that make my traffic look like legitimate O365 API 
         calls while avoiding the detection patterns in these rules."
```

The AI knows the Sigma rule corpus. It knows the documented detection patterns. It can generate a C2 profile specifically tuned to avoid current known signatures.

The same applies to [Metasploit](https://medium.com/@1200km/the-ultimate-guide-to-metasploit-43c8573487df) handler configurations, custom HTTP headers, beacon timing jitter, and TLS certificate generation.

**Defensive action:** Network artifact detection needs to shift toward statistical behavioral baselines — what does "normal" traffic look like for your environment? — rather than signature matching against known C2 profiles. A custom C2 profile that looks like legitimate SaaS traffic will not trigger your Cobalt Strike rule.

---

## Level 4 — Host Artifacts

Host artifacts include specific registry keys created by tools, file names and paths of dropped payloads, event log entries generated by tool behavior, and process parent-child relationships.

**Cost to change (2020):** Days. Required familiarity with EDR detection logic — which artifact patterns trigger which rules — which was specialized knowledge not widely accessible.

**Cost to change (2025):** Hours. The [SigmaHQ rule repository](https://github.com/SigmaHQ/sigma) is public. [ATT&CK technique pages](https://attack.mitre.org) document the artifacts each technique produces. An AI with access to this knowledge can suggest specific modifications to avoid known host-artifact detections:

```
Prompt: "Look at these Sigma rules for Mimikatz detection. What registry 
         keys, process names, and command-line patterns do they target? 
         What modifications would make a credential dumping tool avoid 
         these specific detection patterns?"
```

This is a practical, answerable prompt. The attacker does not need to understand Mimikatz internals — they need to understand that they want to dump credentials without triggering those rules, which is a goal-level specification.

**Defensive action:** Host artifact detection needs depth — multiple overlapping rules for the same technique via different data sources. If you only have a process-creation rule for credential dumping, an attacker who changes the process name evades it. If you also have a Sysmon EventID 10 rule on LSASS access and a registry access rule, they need to defeat all three simultaneously.

---

## Level 5 — Tools ⚠️ The Critical Shift

This is where the fundamental change happens.

**The old assumption:** Novel tools require Tier 1/2 resources. Most actors use signature-known tools (Cobalt Strike, Metasploit, Mimikatz, PsExec), and those tools have known detection signatures.

**The new reality:** Anyone can build a novel tool with AI assistance.

A custom malware implant built with Cursor AI last weekend:
- Has no VirusTotal detections (never seen before)
- Matches no existing Sigma rules (no documented behavior pattern)
- Triggers no EDR heuristics based on known malware families
- Contains no strings from known tool repositories

The [Cursor AI development workflow](https://medium.com/@1200km/how-cursor-ai-became-my-full-stack-development-partner-from-arduino-code-to-visual-validation-47fcccb9c845) documents exactly this: starting from a natural language description of desired functionality, iterating to working code, testing against detection. The [BadUSB research](https://medium.com/@1200km/building-a-usb-rubber-ducky-with-arduino-leonardo-with-cursor-a23dd64d1bbe) shows the same pattern for hardware-based attack tools.

**Cost to change (2020):** Months to years. Required a developer with deep systems programming knowledge and security tool expertise.

**Cost to change (2025):** Days. Required: understanding what you want to build, basic ability to test whether it works.

**Defensive implication:** Your entire signature-based detection stack — every YARA rule, every EDR signature, every hash blocklist — is blind to tools that did not exist when those signatures were written. Novel custom tools are now within reach of actors who would have been Tier 3 two years ago.

**Defensive action:** Behavioral detection must replace signature detection as the primary layer for high-priority threats. Process behavior, memory patterns, network communication profiles — not tool names or hashes. A new tool that injects into a legitimate process and establishes an encrypted C2 channel will exhibit behavioral patterns that deviate from normal, even if its signature is unknown.

---

## Level 6 — TTPs

TTPs remain the hardest level for attackers to change. Fundamental behavioral patterns — how the attacker establishes persistence, how they do lateral movement, how they communicate with C2 — cannot be trivially varied. Changing them requires re-engineering the attack methodology.

**This is still true.** But "hardest" has changed in degree.

**What AI enables at the TTP level:**

**TTP variation research:** An AI can review your current attack methodology against publicly documented detection logic and suggest alternative approaches:

```
Prompt: "I'm using DCSync (T1003.006) for credential access. 
         What are alternative techniques that achieve the same 
         goal — full domain credential access — but have different 
         behavioral signatures and weaker Sigma coverage?"
```

**Detection gap analysis:** AI can synthesize current Sigma rules, ATT&CK detection guidance, and EDR vendor documentation to identify techniques with weaker coverage:

```
Prompt: "Which persistence techniques in ATT&CK Enterprise have the 
         fewest publicly available Sigma detection rules? Which have 
         the most limited EDR coverage based on documented data sources?"
```

**Defense-evasion-first design:** AI enables designing attacks with detection evasion built in from the start — selecting techniques specifically because they have weaker coverage, less mature detection, or less available telemetry.

**Cost to change (2020):** Months. Required deep expertise, organizational structure, time to develop and test new approaches.

**Cost to change (2025):** Days to weeks for a competent attacker. No longer requires nation-state resources. Still the most expensive level, but no longer prohibitively so.

**The bottom line:** The implicit defense provided by TTP inertia — the assumption that most actors will not vary their fundamental techniques — is less reliable. Threat actors who would previously have been stuck in a fixed TTP pattern because changing it was too expensive can now research and implement TTP variations more quickly.

---

## Summary Table

| Level | Cost Pre-AI | Cost Post-AI | Change |
|---|---|---|---|
| Hash Values | Minutes | Minutes | None |
| IPs / Domains | Minutes | Minutes | None |
| Network Artifacts | Days | Hours | Significant ↓ |
| Host Artifacts | Days | Hours | Significant ↓ |
| **Tools** | **Months/Years** | **Days** | **Critical ↓** |
| TTPs | Months | Days–Weeks | Material ↓ |

The Tools level is the most important shift for SOC teams to internalize. Your entire detection stack assumes attackers use known tools. A meaningful portion of the threat population no longer does.

---

**Continue:** [A Realistic "Script Kiddie + AI" Attack Scenario →](./script-kiddie-scenario)
