// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  mainSidebar: [
    'intro',
    {
      type: 'category',
      label: '1. The Old World',
      collapsed: false,
      items: ['context/skill-barrier'],
    },
    {
      type: 'category',
      label: '2. AI & the Skill Floor',
      collapsed: false,
      items: [
        'offensive-ai/skill-floor-collapse',
        'offensive-ai/from-my-research',
      ],
    },
    {
      type: 'category',
      label: '3. Pyramid of Pain, Post-AI',
      collapsed: false,
      items: [
        'pyramid-reloaded/level-by-level',
        'pyramid-reloaded/script-kiddie-scenario',
      ],
    },
    {
      type: 'category',
      label: '4. Why Legacy Defense Is Failing',
      collapsed: false,
      items: ['defense-failure/why-legacy-fails'],
    },
    {
      type: 'category',
      label: '5. The New Defense Paradigm',
      collapsed: false,
      items: [
        'new-paradigm/behavioral-detection',
        'new-paradigm/detection-stack',
      ],
    },
    {
      type: 'category',
      label: '6. CTI Must Evolve',
      collapsed: false,
      items: [
        'cti-evolution/beyond-ioc-feeds',
        'cti-evolution/threat-informed-detection',
      ],
    },
    {
      type: 'category',
      label: '7. SOC Analyst Playbook',
      collapsed: false,
      items: [
        'soc-playbook/immediate-actions',
        'soc-playbook/medium-term',
      ],
    },
  ],
};

export default sidebars;
