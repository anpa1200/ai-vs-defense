// @ts-check
import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'AI vs Defense',
  tagline: 'How AI collapsed the skill floor — and what SOC teams must do about it',
  favicon: 'img/favicon.svg',

  future: { v4: true },

  url: 'https://anpa1200.github.io',
  baseUrl: '/ai-vs-defense/',
  organizationName: 'anpa1200',
  projectName: 'ai-vs-defense',
  trailingSlash: false,

  onBrokenLinks: 'warn',
  markdown: {
    format: 'detect',
    hooks: { onBrokenMarkdownLinks: 'warn' },
  },

  i18n: { defaultLocale: 'en', locales: ['en'] },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/anpa1200/ai-vs-defense/tree/main/',
        },
        blog: false,
        theme: { customCss: './src/css/custom.css' },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      announcementBar: {
        id: 'ai_defense_note',
        content:
          'This guide is for <strong>defensive security practitioners, SOC analysts, and CTI teams</strong>. All offensive examples are from authorized lab research.',
        backgroundColor: '#0f172a',
        textColor: '#f97316',
        isCloseable: true,
      },
      image: 'img/social-card.png',
      colorMode: { respectPrefersColorScheme: true },
      navbar: {
        title: 'AI vs Defense',
        logo: { alt: '1200km', src: 'img/logo.svg' },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'mainSidebar',
            position: 'left',
            label: 'Read the Guide',
          },
          {
            href: 'https://medium.com/@1200km',
            label: 'Medium',
            position: 'right',
          },
          {
            href: 'https://github.com/anpa1200',
            label: 'GitHub',
            position: 'right',
          },
          {
            href: 'https://anpa1200.github.io/',
            label: 'All Projects',
            position: 'right',
            className: 'navbar-portfolio-btn',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'This Guide',
            items: [
              { label: 'Introduction', to: '/docs/intro' },
              { label: 'The Old World', to: '/docs/01-context/skill-barrier' },
              { label: 'AI & the Skill Floor', to: '/docs/02-offensive-ai/skill-floor-collapse' },
              { label: 'Pyramid of Pain Post-AI', to: '/docs/03-pyramid-reloaded/level-by-level' },
              { label: 'Why Legacy Defense Fails', to: '/docs/04-defense-failure/why-legacy-fails' },
              { label: 'The New Paradigm', to: '/docs/05-new-paradigm/behavioral-detection' },
              { label: 'CTI Must Evolve', to: '/docs/06-cti-evolution/beyond-ioc-feeds' },
              { label: 'SOC Playbook', to: '/docs/07-soc-playbook/immediate-actions' },
            ],
          },
          {
            title: 'Related Research',
            items: [
              { label: 'HexStrike-AI Guide', href: 'https://anpa1200.github.io/Hexstrike-AI-guide/' },
              { label: 'CTI Analyst Field Manual', href: 'https://github.com/anpa1200/cti-analyst-field-manual' },
              { label: 'Threat Hunting Hypotheses', href: 'https://github.com/anpa1200/threat-hunting-hypotheses' },
              { label: 'CTI Research Repo', href: 'https://github.com/anpa1200/CTI' },
            ],
          },
          {
            title: 'Author',
            items: [
              { label: 'Medium (@1200km)', href: 'https://medium.com/@1200km' },
              { label: 'LinkedIn', href: 'https://linkedin.com/in/andrey-pautov' },
              { label: 'GitHub', href: 'https://github.com/anpa1200' },
              { label: 'All Projects', href: 'https://anpa1200.github.io/' },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Andrey Pautov. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['bash', 'python', 'yaml', 'sql', 'powershell'],
      },
    }),
};

export default config;
