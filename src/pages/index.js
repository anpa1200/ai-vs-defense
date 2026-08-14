import React from 'react';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const PAGE_TITLE = 'Old Defense vs New-Age Attacks';
const PAGE_DESCRIPTION = 'Learn how AI lowers offensive skill barriers and how SOC and CTI teams can adapt with behavioral baselines, resilient detections, and a practical roadmap.';

const FEATURES = [
  {
    title: 'The Old World',
    text: 'Capability tiers, the Pyramid of Pain, and why the skill barrier was an implicit defense for 20 years.',
    to: '/context/skill-barrier',
  },
  {
    title: 'AI & the Skill Floor',
    text: 'What AI provides to any attacker today — and why every script kiddie now punches above their weight class.',
    to: '/offensive-ai/skill-floor-collapse',
  },
  {
    title: 'Pyramid of Pain, Post-AI',
    text: 'Level-by-level: what it costs an AI-assisted attacker to change each indicator type today.',
    to: '/pyramid-reloaded/level-by-level',
  },
  {
    title: 'The New Defense Paradigm',
    text: 'Behavioral baselines, statistical anomaly detection, and the detection stack that survives AI-assisted offense.',
    to: '/new-paradigm/behavioral-detection',
  },
  {
    title: 'CTI Must Evolve',
    text: 'Beyond IOC feeds — what threat intelligence looks like when indicators rotate in hours, not months.',
    to: '/cti-evolution/beyond-ioc-feeds',
  },
  {
    title: 'SOC Analyst Playbook',
    text: 'Immediate actions and a 90-day roadmap to bring your detection program into the AI era.',
    to: '/soc-playbook/immediate-actions',
  },
];

const breadcrumbStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {'@type': 'ListItem', position: 1, name: '1200km', item: 'https://1200km.com/'},
    {'@type': 'ListItem', position: 2, name: 'AI vs. Defense', item: 'https://1200km.com/ai-vs-defense/'},
  ],
};

export default function Home() {
  const coverImg = useBaseUrl('/img/cover-castle.png');

  return (
    <Layout
      title={PAGE_TITLE}
      description={PAGE_DESCRIPTION}
    >
      <Head>
        <meta name="twitter:title" content={`${PAGE_TITLE} | 1200km`} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbStructuredData)}</script>
      </Head>
      {/* ── Hero ── */}
      <div className={styles.hero}>
        <img
          src={coverImg}
          alt="A medieval castle wall being breached by digital energy — representing legacy defense meeting AI-powered attacks"
          className={styles.heroImg}
        />
        <div className={styles.heroOverlay}>
          <span className={styles.heroBadge}>CTI · SOC · Threat Intelligence</span>
          <h1 className={styles.heroTitle}>
            Old Defense vs<br /><span>New-Age Attacks</span>
          </h1>
          <p className={styles.heroTagline}>
            AI collapsed the skill barrier that protected organizations for 20 years.
            The controls, models, and frameworks built around that barrier are losing accuracy.
            Here is what changed — and what to do about it.
          </p>
          <div className={styles.heroActions}>
            <Link className={styles.btnPrimary} to="/intro">
              Read the Guide →
            </Link>
            <Link className={styles.btnSecondary} to="/soc-playbook/immediate-actions">
              SOC Playbook
            </Link>
          </div>
        </div>
      </div>

      {/* ── Intro strip ── */}
      <div className={styles.intro}>
        <h2 className={styles.introHeading}>The Threat Model Has Structurally Changed</h2>
        <p className={styles.introText}>
          The real shift is not that AI makes attackers faster — it is that the <strong>capability tier system</strong> that
          organized the threat landscape for two decades has collapsed. Script kiddies with AI assistance
          now outperform experienced hackers from five years ago. Custom malware and TTPs that required
          nation-state resources in 2019 can be produced in hours today. Legacy defense was built for a
          world that no longer exists.
        </p>
      </div>

      {/* ── Feature cards ── */}
      <div className={styles.features}>
        {FEATURES.map(({title, text, to}) => (
          <Link key={to} to={to} className={styles.card}>
            <div className={styles.cardTitle}>{title}</div>
            <p className={styles.cardText}>{text}</p>
          </Link>
        ))}
      </div>

      {/* ── Author strip ── */}
      <div className={styles.author}>
        Research and writing by{' '}
        <a href="https://medium.com/@1200km" target="_blank" rel="noopener noreferrer">
          Andrey Pautov (@1200km)
        </a>
        {' '}· CTI analyst · All offensive examples from authorized lab research ·{' '}
        <a href="https://github.com/anpa1200" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </div>
    </Layout>
  );
}
