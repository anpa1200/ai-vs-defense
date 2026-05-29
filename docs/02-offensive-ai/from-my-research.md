---
title: "From My Research: Concrete Examples"
sidebar_label: From My Research
sidebar_position: 2
description: "Hands-on documented evidence: custom malware in a weekend, one-prompt pentest, AI-assisted hardware attacks, and more."
---

# From My Research: Concrete Examples

The claims in this guide are not vendor whitepapers or theoretical projections. They are grounded in hands-on research I published across a series of documented experiments. Here is what I actually built and tested.

---

## Custom Malware Development: A Weekend Project

A few years ago, developing a functional custom malware implant required:

- Knowledge of C, C++, or Rust for Windows internals work
- Windows API expertise: process injection, persistence mechanisms, evasion techniques
- C2 protocol design and implementation
- PE format knowledge for shellcode and AV evasion
- Multi-version Windows testing methodology

This was a real skill barrier. Most Tier 3 actors could not clear it. They were limited to signature-known tools.

With [Cursor AI](https://medium.com/@1200km/how-cursor-ai-became-my-full-stack-development-partner-from-arduino-code-to-visual-validation-47fcccb9c845), the requirement changed: you need to understand **what the tool should accomplish**, not how to implement it. An analyst who understands what a persistence mechanism does but has never written Windows API code can now direct an AI to implement it.

The barrier shifted from **"can you build it?"** to **"do you understand what it should do?"** — a dramatically lower threshold.

:::info Authorized Research
All malware development research was conducted in isolated lab environments with no connectivity to production infrastructure. This is documented authorized security research.
:::

---

## Full Network Penetration Test with One Prompt

Using [HexStrike-AI](https://medium.com/@1200km/hexstrike-ai-a-force-multiplier-for-red-teams-and-a-dangerous-shift-in-the-threat-landscape-3e1d4e86f3ae), I documented an autonomous AI-driven penetration test that covered the complete engagement lifecycle.

The documented test at [AI-Driven Pentesting at Home](https://medium.com/@1200km/ai-driven-pentesting-at-home-using-hexstrike-ai-for-full-network-discovery-and-exploitation-00a9e88b3bde) showed:

1. **Network discovery** — intelligent scanning strategy, no manual [Nmap](https://medium.com/@1200km/mastering-nmap-a-comprehensive-guide-to-network-exploration-and-security-auditing-f36d74d1b2c0) syntax required
2. **Service enumeration** — automatic correlation with vulnerability databases
3. **Exploit selection** — AI-matched CVEs to available exploits from [Metasploit](https://medium.com/@1200km/the-ultimate-guide-to-metasploit-43c8573487df) and PoC repositories
4. **Exploitation** — autonomous execution of the highest-probability attack vector
5. **Post-exploitation** — credential harvesting, privilege escalation, persistence
6. **Lateral movement** — AI-analyzed network connections and pivoted to additional targets
7. **Full subnet compromise** — [from single target to full subnet](https://medium.com/@1200km/hexstrike-cursor-mcp-from-single-target-full-subnet-compromise-lab-pt-walkthrough) with AI orchestration

What would have required days of manual work by an experienced penetration tester — coordinating [Nmap](https://medium.com/@1200km/mastering-nmap-a-comprehensive-guide-to-network-exploration-and-security-auditing-f36d74d1b2c0), Nessus, [Metasploit](https://medium.com/@1200km/the-ultimate-guide-to-metasploit-43c8573487df), manual exploit research — was completed autonomously in hours.

The AI-driven web application variant at [AI-Driven Web Application Pentesting](https://medium.com/@1200km/ai-driven-web-application-pentesting-with-hexstrike-ai-67f3dae32040) demonstrated the same pattern for web targets, including business logic analysis and multi-step attack chaining that traditional scanners miss entirely.

---

## WiFi Cracking with One Prompt

[AI-Driven Wireless Penetration Testing](https://medium.com/@1200km/ai-driven-wireless-penetration-testing-one-promt-wifi-cracking-6477c06f6af4) documented the complete wireless attack workflow driven by a single prompt:

- Identify all visible networks and their encryption types
- Select optimal attack method per network (WEP, WPA, WPA2, WPA3)
- Execute deauthentication attack for WPA handshake capture
- Automatic [Aircrack-ng](https://medium.com/@1200km/wifi-cracking-with-aircrack-ng-d51cf98c789f) + [Hashcat](https://medium.com/@1200km/breaking-the-code-how-to-use-hashcat-for-effective-password-cracking-15f8da8facb8) orchestration with intelligent wordlist selection
- Full security assessment report

Previously: required wireless protocol knowledge, manual tool configuration, understanding of handshake mechanics.

After AI: requires knowing that WiFi cracking exists as a concept.

---

## Credential Attacks with AI Orchestration

**SMB brute-forcing** ([HexStrike + Gemini: AI-Assisted SMB Brute-Force](https://medium.com/@1200km/hexstrike-gemini-ai-assisted-smb-exposure-credential-brute-force-2c5f99dcdbf4)):
- AI generates targeted wordlists from OSINT data gathered during reconnaissance
- Adaptive rate limiting to avoid account lockout policies
- Automatic orchestration across [Hydra](https://medium.com/@1200km/mastering-hydra-the-ultimate-guide-to-network-logon-cracking-182579dbaed1), Medusa, Ncrack based on target response

**SSH credential attacks** ([HexStrike + Gemini: AI-Assisted SSH Brute-Force](https://medium.com/@1200km/hexstrike-gemini-ai-assisted-ssh-credential-brute-force-a9162f8e253b)):
- AI-generated username lists from system information gathered in recon
- Intelligent fallback to key-based attack strategies

**Password recovery operations:**
- [ZIP password recovery](https://medium.com/@1200km/ai-driven-zip-password-recovery-with-hexstrike-ai-and-gemini-cli-b8fc5c475ebc) — AI analyzes file metadata and context to generate targeted password lists
- [PDF password recovery](https://medium.com/@1200km/ai-driven-pdf-password-recovery-with-hexstrike-ai-and-gemini-cli-cfa7eb0fae91) — context-aware cracking with [John the Ripper](https://medium.com/@1200km/mastering-john-the-ripper-a-complete-guide-to-password-cracking-e42d68239c71) and [Hashcat](https://medium.com/@1200km/breaking-the-code-how-to-use-hashcat-for-effective-password-cracking-15f8da8facb8) orchestration
- [Office document recovery](https://medium.com/@1200km/ai-driven-office-documents-password-recovery-with-hexstrike-ai-and-gemini-cli-3c8bb7deb82d) — AI-driven format detection and recovery strategy selection

---

## Hardware Attack Tools: BadUSB with AI Assistance

[Building a USB Rubber Ducky with Arduino Leonardo using Cursor](https://medium.com/@1200km/building-a-usb-rubber-ducky-with-arduino-leonardo-with-cursor-a23dd64d1bbe) and the follow-up [Hacker Tool Development Workflow: Android Rubber Ducky Payloads in Cursor AI](https://medium.com/@1200km/how-cursor-ai-became-my-full-stack-development-partner-from-arduino-code-to-visual-validation-47fcccb9c845) documented complete AI-assisted hardware attack tool development.

Cursor AI handled:
- USB HID protocol implementation (Arduino C++)
- Payload script generation
- Cross-platform payload variation (Windows, Linux, macOS)
- Testing and iteration cycle

Hardware attack vectors — previously requiring embedded systems knowledge and USB protocol expertise — are now accessible to anyone who understands what a BadUSB attack accomplishes.

---

## AI-Driven Exploit Development

[AI-Driven Exploitation of Metasploitable: From Recon to Root with OpenAI Codex + HexStrike](https://medium.com/@1200km/ai-driven-exploitation-of-metasploitable2-from-recon-to-root-with-codex-hexstrike-ai-b892c07be39f) demonstrated that AI can:

- Analyze vulnerability scan results and identify exploitable targets
- Research exploit techniques using [Metasploit](https://medium.com/@1200km/the-ultimate-guide-to-metasploit-43c8573487df) and PoC databases
- Generate custom exploit code tailored to target configuration
- Test, analyze failure, and refine autonomously
- Execute full attack chains from initial recon to root access

This represents the shift I described in the intro: from "search for exploits and manually adapt them" to "AI generates and executes exploits with minimal human specification."

---

## The Unified Pattern

Every one of these examples follows the same pattern:

**Before AI:** A chain of specialized tools requiring expertise at each step, with manual correlation and decision-making between steps.

**After AI:** A natural language description of the goal, with AI handling tool selection, execution, result interpretation, and chaining.

The required skill shifts from **implementation expertise** to **goal specification**. The second is orders of magnitude more accessible.

---

**Continue:** [The Pyramid of Pain, Post-AI →](../03-pyramid-reloaded/level-by-level)
