import { doc, h2, p, ul } from '../lib/lexical'

// Site-wide seed content (E1). Wording comes from the approved HTML page and
// mockup. Phone, office address and working hours stay empty until the firm
// provides them (the site hides empty rows).

export const siteSettings = {
  companyName: 'TRBD Consulting Group',
  legalName: 'TRBD Consulting Group Private Limited',
  tagline: 'People, skills, energy and markets under one roof.',
  contactEmail: 'contact@trbdgroup.com',
}

export const navigationAnchors = {
  header: [
    { label: 'Verticals', anchor: 'verticals' },
    { label: 'How we work', anchor: 'approach' },
    { label: 'Why TRBD', anchor: 'why' },
  ],
  cta: { label: 'Contact us', anchor: 'contact' },
  footer: [
    { label: 'How we work', anchor: 'approach' },
    { label: 'Why TRBD', anchor: 'why' },
    { label: 'Contact', anchor: 'contact' },
  ],
} as const

export const homeBlocks = (heroImageId: number) => [
  {
    blockType: 'hero' as const,
    label: 'TRBD Consulting Group',
    title: 'People, skills, energy and markets under one roof',
    ctaLabel: 'Explore our verticals',
    backgroundImage: heroImageId,
  },
  {
    blockType: 'sectionIntro' as const,
    anchor: 'about' as const,
    label: 'Who we are',
    heading: 'One partner, one point of accountability.',
    text: 'TRBD Consulting Group Private Limited helps organisations hire the right workforce, build their skills, run energy projects, move to cleaner power and grow across borders. A single account lead coordinates every part of your project, so you work with one team instead of several vendors.',
  },
  {
    blockType: 'verticalsList' as const,
    anchor: 'verticals' as const,
    label: 'What we do',
    heading: 'Five verticals, connected by one team.',
    intro:
      'Our verticals often work together. A new energy project may need skilled crews, safety training and market-entry support at the same time, and we can deliver all three.',
  },
  {
    blockType: 'approachStages' as const,
    anchor: 'approach' as const,
    label: 'How we work',
    heading: 'From first brief to long-term support',
    intro:
      'Every engagement follows the same four stages, whether we are filling fifty positions or opening a new market.',
    stages: [
      {
        title: 'Understand',
        text: 'We study your goals, site conditions, compliance needs and timelines before proposing anything.',
      },
      {
        title: 'Plan',
        text: 'You get a clear scope, schedule and cost, with named owners for each deliverable.',
      },
      {
        title: 'Deliver',
        text: 'Our team mobilises people, programmes or projects and reports progress against the plan.',
      },
      {
        title: 'Sustain',
        text: 'We stay on for follow-up, audits, retraining and replacement so results hold over time.',
      },
    ],
  },
  {
    blockType: 'whyPoints' as const,
    anchor: 'why' as const,
    label: 'Why TRBD',
    heading: 'What clients get from working with us',
    intro:
      'We are built for organisations that need several kinds of support and would rather not manage several vendors.',
    points: [
      {
        title: 'One point of contact',
        icon: 'user-round' as const,
        text: 'A single account lead coordinates every vertical involved in your project.',
      },
      {
        title: 'Compliance first',
        icon: 'shield-check' as const,
        text: 'Documentation, certifications, visas and safety standards are checked before work begins.',
      },
      {
        title: 'Sector knowledge',
        icon: 'briefcase' as const,
        text: 'Our consultants come from the industries they advise, from rigs to classrooms to boardrooms.',
      },
      {
        title: 'Scalable teams',
        icon: 'chart-column' as const,
        text: 'We staff a short assignment or a multi-year programme with the same process.',
      },
      {
        title: 'Cross-border reach',
        icon: 'globe' as const,
        text: 'We help clients source talent, partners and opportunities across countries and regions.',
      },
      {
        title: 'Transparent reporting',
        icon: 'file-text' as const,
        text: 'Regular progress reports show what has been done, what is next and what it costs.',
      },
    ],
  },
  {
    blockType: 'contact' as const,
    anchor: 'contact' as const,
    label: 'Contact',
    heading: 'Tell us what you need',
    text: 'Email us a few details about your requirement and our team will get back to you within two working days.',
    buttonLabel: 'Email us',
  },
]

// Draft privacy notice: describes stage 1 as built (no forms, no accounts,
// cookie-free analytics, email only). Must be reviewed, ideally by someone
// familiar with India's DPDP Act, before launch and again when stage 2 adds the
// enquiry form.
export const privacyBlocks = [
  {
    blockType: 'richText' as const,
    body: doc(
      p(
        'This notice explains how TRBD Consulting Group Private Limited ("TRBD", "we") handles personal data on this website.',
      ),
      h2('What we collect'),
      p(
        'This website does not ask you for personal data. There are no forms, accounts or sign-ups on the site at present.',
      ),
      p(
        'If you email us, we receive the details you choose to send, such as your name, email address and the requirement you describe. We use them only to reply to you and to discuss the work you have asked about.',
      ),
      h2('Analytics and cookies'),
      p(
        'We measure visits with privacy-friendly analytics that do not use cookies and do not identify you. The site sets no advertising or tracking cookies.',
      ),
      h2('Your rights'),
      ul([
        'Ask what personal data we hold about you.',
        'Ask us to correct or delete it.',
        'Withdraw any consent you have given.',
      ]),
      p('To make a request, email contact@trbdgroup.com.'),
      h2('Changes to this notice'),
      p(
        'We will update this notice when the website changes, for example when we add an enquiry form, and show the date of the latest version here.',
      ),
    ),
  },
]
