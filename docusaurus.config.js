// @ts-check
import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Old Defense vs New-Age Attacks',
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
          routeBasePath: '/',
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
      image: 'img/cover-castle.png',
      colorMode: { respectPrefersColorScheme: true },
      navbar: {
        title: 'Old Defense vs New-Age Attacks',
        logo: { alt: '1200km', src: 'img/logo.svg' },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'mainSidebar',
            position: 'left',
            label: 'Read the Guide',
          },
          {
            label: 'Projects',
            position: 'right',
            items: [
              { label: 'CTI Analyst Field Manual', href: 'https://anpa1200.github.io/cti-analyst-field-manual/' },
              { label: 'CTI as a Code', href: 'https://anpa1200.github.io/CTI_as_a_Code/' },
              { label: 'Operation Desert Hydra', href: 'https://anpa1200.github.io/operation-desert-hydra/' },
              { label: 'Customer-Driven AI CTI', href: 'https://anpa1200.github.io/customer-driven-ai-cti-project/' },
              { label: 'Israel Threat Actors CTI', href: 'https://anpa1200.github.io/israel-government-threat-actors-cti/' },
              { label: 'AI vs Defense', href: 'https://anpa1200.github.io/ai-vs-defense/' },
              { label: 'HexStrike AI', href: 'https://github.com/0x4m4/hexstrike-ai' },
            ],
          },
          {
            href: 'https://medium.com/@1200km',
            label: 'Medium',
            position: 'right',
          },
          {
            href: 'https://github.com/anpa1200/ai-vs-defense',
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
              { label: 'Introduction', to: '/intro' },
              { label: 'The Old World', to: '/context/skill-barrier' },
              { label: 'AI & the Skill Floor', to: '/offensive-ai/skill-floor-collapse' },
              { label: 'Pyramid of Pain Post-AI', to: '/pyramid-reloaded/level-by-level' },
              { label: 'Why Legacy Defense Fails', to: '/defense-failure/why-legacy-fails' },
              { label: 'The New Paradigm', to: '/new-paradigm/behavioral-detection' },
              { label: 'CTI Must Evolve', to: '/cti-evolution/beyond-ioc-feeds' },
              { label: 'SOC Playbook', to: '/soc-playbook/immediate-actions' },
            ],
          },
          {
            title: 'Ecosystem',
            items: [
              { label: 'CTI Analyst Field Manual', href: 'https://anpa1200.github.io/cti-analyst-field-manual/' },
              { label: 'CTI as a Code', href: 'https://anpa1200.github.io/CTI_as_a_Code/' },
              { label: 'Operation Desert Hydra', href: 'https://anpa1200.github.io/operation-desert-hydra/' },
              { label: 'Customer-Driven AI CTI', href: 'https://anpa1200.github.io/customer-driven-ai-cti-project/' },
              { label: 'Israel Threat Actors CTI', href: 'https://anpa1200.github.io/israel-government-threat-actors-cti/' },
              { label: 'HexStrike AI', href: 'https://github.com/0x4m4/hexstrike-ai' },
            ],
          },
          {
            title: 'Author',
            items: [
              { label: 'Medium (@1200km)', href: 'https://medium.com/@1200km' },
              { label: 'LinkedIn', href: 'https://www.linkedin.com/in/andrey-pautov/' },
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
