// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  mainSidebar: [
    'intro',
    {
      type: 'category',
      label: '1. The Old World',
      collapsed: false,
      items: ['01-context/skill-barrier'],
    },
    {
      type: 'category',
      label: '2. AI & the Skill Floor',
      collapsed: false,
      items: [
        '02-offensive-ai/skill-floor-collapse',
        '02-offensive-ai/from-my-research',
      ],
    },
    {
      type: 'category',
      label: '3. Pyramid of Pain, Post-AI',
      collapsed: false,
      items: [
        '03-pyramid-reloaded/level-by-level',
        '03-pyramid-reloaded/script-kiddie-scenario',
      ],
    },
    {
      type: 'category',
      label: '4. Why Legacy Defense Is Failing',
      collapsed: false,
      items: ['04-defense-failure/why-legacy-fails'],
    },
    {
      type: 'category',
      label: '5. The New Defense Paradigm',
      collapsed: false,
      items: [
        '05-new-paradigm/behavioral-detection',
        '05-new-paradigm/detection-stack',
      ],
    },
    {
      type: 'category',
      label: '6. CTI Must Evolve',
      collapsed: false,
      items: [
        '06-cti-evolution/beyond-ioc-feeds',
        '06-cti-evolution/threat-informed-detection',
      ],
    },
    {
      type: 'category',
      label: '7. SOC Analyst Playbook',
      collapsed: false,
      items: [
        '07-soc-playbook/immediate-actions',
        '07-soc-playbook/medium-term',
      ],
    },
  ],
};

export default sidebars;
