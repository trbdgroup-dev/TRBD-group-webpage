import { doc, ol, p } from '../lib/lexical'

// Vertical content for the seed (E1).
//
// `base` is published: only wording from the approved HTML page, plus the hero
// headlines approved in the mockup.
// `draft` is saved as an UNPUBLISHED draft for the content writer to review:
// fuller service descriptions, "How we deliver" and common questions. It
// expands what the HTML page says and adds no facts of its own: no numbers,
// client names, named certifications or standards bodies, licences, offices,
// countries served or results. Anything like that must come from the firm.

export type VerticalSeed = {
  slug: 'manpower' | 'education-training' | 'oil-gas' | 'green-energy' | 'global-business'
  order: number
  image: string
  base: {
    name: string
    title: string
    heroHeadline: string
    summary: string
    whoWeWorkWith: string[]
    services: { name: string; summary: string }[]
  }
  draft: {
    serviceDescriptions: string[]
    howWeDeliver: { intro: string; steps: string[] }
    faqs: { question: string; answer: string }[]
  }
}

export const verticals: VerticalSeed[] = [
  {
    slug: 'manpower',
    order: 1,
    image: 'manpower-crew.jpg',
    base: {
      name: 'Manpower',
      title: 'Manpower & Workforce Solutions',
      heroHeadline: 'The right workforce, at home and overseas',
      summary:
        'We recruit and deploy skilled, semi-skilled and professional staff for projects at home and overseas, and handle the paperwork that comes with it.',
      whoWeWorkWith: [
        'Construction',
        'Facilities',
        'Hospitality',
        'Healthcare',
        'Manufacturing',
        'Energy projects',
      ],
      services: [
        {
          name: 'Permanent recruitment',
          summary: 'Screening, interviews and trade tests for long-term roles.',
        },
        {
          name: 'Contract & project staffing',
          summary: 'Crews mobilised for fixed-term projects and shutdowns.',
        },
        {
          name: 'Overseas placement',
          summary: 'Documentation, medicals, visas and travel for international deployment.',
        },
        {
          name: 'Payroll & HR outsourcing',
          summary: 'Attendance, payroll and statutory compliance managed for you.',
        },
      ],
    },
    draft: {
      serviceDescriptions: [
        'For long-term roles we start from your job description and the conditions on site, then screen, interview and trade-test candidates against them. You see a shortlist of people who have already shown they can do the work, so your own interviews can focus on fit.',
        'When a project or shutdown needs people for a fixed period, we put together crews of the trades you need and mobilise them to your timeline. We stay in touch with the crew while they are on site and arrange replacements if someone has to leave.',
        'For international deployment we take care of the steps between selection and the first day on site: documentation, medicals, visas and travel. Workers know what to expect before they leave, and you know when they will arrive.',
        'We can manage attendance, payroll and statutory compliance for the people working for you, so your team can concentrate on the work itself. You receive regular records of what has been paid and filed.',
      ],
      howWeDeliver: {
        intro:
          'Every manpower engagement follows the same four stages, whether you need one specialist or a full crew.',
        steps: [
          'Understand: we agree the roles, skills, numbers, site conditions and timelines with you.',
          'Plan: you get a recruitment plan with a schedule, costs and a named contact.',
          'Deliver: we screen, test and mobilise people, and report progress against the plan.',
          'Sustain: we stay in touch after deployment and arrange replacements if they are needed.',
        ],
      },
      faqs: [
        {
          question: 'What kinds of roles do you recruit for?',
          answer:
            'Skilled, semi-skilled and professional roles, for long-term positions and for fixed-term projects, across sectors such as construction, facilities, hospitality, healthcare, manufacturing and energy projects.',
        },
        {
          question: 'How do you check that candidates can do the job?',
          answer:
            'We screen and interview every candidate and use trade tests where the role calls for them, so the people on your shortlist have already shown the skills the job needs.',
        },
        {
          question: 'Can you staff a short project or a shutdown?',
          answer:
            'Yes. We mobilise crews for fixed-term projects and shutdowns, and arrange replacements if someone has to leave during the project.',
        },
        {
          question: 'What do you handle for overseas placements?',
          answer:
            'Documentation, medicals, visas and travel, so selected workers can be deployed internationally without your team managing each step.',
        },
      ],
    },
  },
  {
    slug: 'education-training',
    order: 2,
    image: 'education-training-workshop.jpg',
    base: {
      name: 'Education & Training',
      title: 'Education & Training',
      heroHeadline: 'Training that leads to job-ready skills',
      summary:
        'We design and deliver training that leads to job-ready skills, from technical trades to corporate leadership, and guide students toward study opportunities.',
      whoWeWorkWith: ['Students', 'Job seekers', 'Corporate teams', 'Technicians', 'Institutions'],
      services: [
        {
          name: 'Vocational & skill training',
          summary: 'Trade courses aligned to industry and certification standards.',
        },
        {
          name: 'HSE & safety certification',
          summary: 'Health, safety and environment programmes for site personnel.',
        },
        {
          name: 'Corporate learning',
          summary: 'Leadership, soft skills and compliance training for staff.',
        },
        {
          name: 'Study abroad counselling',
          summary: 'Course selection, admissions and visa guidance for students.',
        },
      ],
    },
    draft: {
      serviceDescriptions: [
        'Our trade courses are built around the skills employers ask for and aligned to the relevant industry and certification standards. Learners practise the work itself, so they finish ready to start on site rather than needing to learn on the job.',
        'Health, safety and environment programmes prepare site personnel to work safely and to meet the standards their employers and clients expect. We can run them for new starters or as refreshers for existing teams.',
        'For companies, we run leadership, soft-skills and compliance training for staff, shaped around your organisation, your goals and the people taking part.',
        'For students considering study abroad, we help with course selection, admissions and visa guidance, so they can make a clear choice and complete each step with confidence.',
      ],
      howWeDeliver: {
        intro: 'Whether we are training one team or a full intake, we follow the same four stages.',
        steps: [
          'Understand: we learn who the learners are, what they need to be able to do and by when.',
          'Plan: you get a programme outline, schedule and cost before training starts.',
          'Deliver: we run the training and keep you updated on attendance and progress.',
          'Sustain: we offer follow-up and refresher training so the skills last.',
        ],
      },
      faqs: [
        {
          question: 'Who are your training programmes for?',
          answer:
            'Students, job seekers, corporate teams, technicians and institutions. We design programmes around what each group needs to be able to do afterwards.',
        },
        {
          question: 'Can you train our staff as a group?',
          answer:
            'Yes. We run leadership, soft-skills, compliance and safety training for company teams, planned around your schedule.',
        },
        {
          question: 'Do you help students who want to study abroad?',
          answer: 'Yes. We guide students through course selection, admissions and visas.',
        },
      ],
    },
  },
  {
    slug: 'oil-gas',
    order: 3,
    image: 'oil-gas-refinery.jpg',
    base: {
      name: 'Oil & Gas',
      title: 'Oil & Gas Services',
      heroHeadline: 'Specialist people and support across the asset lifecycle',
      summary:
        'We support upstream, midstream and downstream operators with specialist people, technical consulting and project support across the asset lifecycle.',
      whoWeWorkWith: [
        'Operators',
        'EPC contractors',
        'Refineries',
        'Pipelines',
        'Service companies',
      ],
      services: [
        {
          name: 'Technical manpower',
          summary: 'Engineers, inspectors, operators and rig crews on call.',
        },
        {
          name: 'Project support',
          summary: 'Planning, procurement coordination and site supervision.',
        },
        {
          name: 'Inspection & QA/QC',
          summary: 'Third-party inspection and quality documentation.',
        },
        {
          name: 'Operations & maintenance',
          summary: 'Shutdown, turnaround and routine maintenance teams.',
        },
      ],
    },
    draft: {
      serviceDescriptions: [
        'We provide engineers, inspectors, operators and rig crews when your own team needs extra hands or a particular specialism, for planned work or at short notice.',
        'Our project support covers planning, procurement coordination and site supervision, helping projects stay organised from mobilisation to handover.',
        'We carry out third-party inspection and prepare the quality documentation your project, client or regulator needs, so you have a clear record of what was checked and when.',
        'For shutdowns, turnarounds and routine maintenance we supply and organise maintenance teams, so planned work can be completed within its window.',
      ],
      howWeDeliver: {
        intro:
          'From a single inspector to a turnaround team, our oil and gas work follows the same four stages.',
        steps: [
          'Understand: we review the scope, site conditions, safety requirements and timelines.',
          'Plan: you get a clear scope, schedule and cost, with named owners for each deliverable.',
          'Deliver: our people mobilise and report progress against the plan.',
          'Sustain: we stay available for follow-up work, audits and replacements.',
        ],
      },
      faqs: [
        {
          question: 'Which parts of the industry do you work with?',
          answer:
            'Upstream, midstream and downstream: operators, EPC contractors, refineries, pipelines and service companies.',
        },
        {
          question: 'Can you supply people at short notice?',
          answer:
            'We provide engineers, inspectors, operators and rig crews on call. Tell us the roles and dates and we will confirm what we can mobilise.',
        },
        {
          question: 'Do you support shutdowns and turnarounds?',
          answer:
            'Yes. We supply and organise maintenance teams for shutdowns, turnarounds and routine maintenance.',
        },
        {
          question: 'What does your inspection work include?',
          answer: 'Third-party inspection and the quality documentation that goes with it.',
        },
      ],
    },
  },
  {
    slug: 'green-energy',
    order: 4,
    image: 'green-energy-solar-field.jpg',
    base: {
      name: 'Green Energy',
      title: 'Green Energy Consulting',
      heroHeadline: 'Renewable projects that cut costs and emissions',
      summary:
        'We help businesses and developers plan, build and run renewable energy projects that cut costs and emissions.',
      whoWeWorkWith: [
        'Industrial plants',
        'Commercial buildings',
        'Developers',
        'Municipalities',
        'Investors',
      ],
      services: [
        {
          name: 'Solar project advisory',
          summary:
            'Feasibility, design review and vendor selection for rooftop and ground-mount systems.',
        },
        {
          name: 'Energy audits',
          summary: 'Measure consumption and find savings before you invest.',
        },
        {
          name: 'Sustainability strategy',
          summary: 'Decarbonisation roadmaps and ESG reporting support.',
        },
        {
          name: 'Installation & O&M teams',
          summary: 'Trained crews for installation, commissioning and upkeep.',
        },
      ],
    },
    draft: {
      serviceDescriptions: [
        'For rooftop and ground-mount solar, we help you check feasibility, review designs and select vendors, so you can decide with a clear view of what the project involves.',
        'An energy audit measures how your site uses energy and where savings can be made, so you know where investment will help most before you commit to it.',
        'We help organisations set out a decarbonisation roadmap and support their ESG reporting, connecting long-term goals to practical steps.',
        'Our trained crews install, commission and maintain renewable systems, so they keep performing after handover.',
      ],
      howWeDeliver: {
        intro:
          'From a first audit to a running solar system, our green energy work follows the same four stages.',
        steps: [
          'Understand: we look at your site, your energy use and what you want to achieve.',
          'Plan: you get a clear scope, schedule and cost before work begins.',
          'Deliver: we carry out the advisory work or installation and report against the plan.',
          'Sustain: our teams look after operation and maintenance so results hold over time.',
        ],
      },
      faqs: [
        {
          question: 'Where should we start?',
          answer:
            'Many clients start with an energy audit. It shows how your site uses energy and where savings can be made, before you invest.',
        },
        {
          question: 'Do you work on rooftop and ground-mount solar?',
          answer:
            'Yes. We advise on feasibility, design review and vendor selection for both, and provide trained crews for installation, commissioning and upkeep.',
        },
        {
          question: 'Can you help with sustainability reporting?',
          answer: 'Yes. We support decarbonisation roadmaps and ESG reporting.',
        },
      ],
    },
  },
  {
    slug: 'global-business',
    order: 5,
    image: 'global-business-skyline.jpg',
    base: {
      name: 'Global Business',
      title: 'Global Business Advisory',
      heroHeadline: 'Enter new markets with fewer surprises',
      summary:
        'We help companies enter new markets, find the right partners and set up operations abroad with fewer surprises.',
      whoWeWorkWith: ['SMEs', 'Exporters', 'Startups', 'Investors', 'Family businesses'],
      services: [
        {
          name: 'Market entry strategy',
          summary: 'Market research, entry models and go-to-market plans.',
        },
        {
          name: 'Company formation',
          summary: 'Incorporation, licensing and local registration support.',
        },
        {
          name: 'Partner & trade matchmaking',
          summary: 'Introductions to distributors, suppliers and joint-venture partners.',
        },
        {
          name: 'Cross-border compliance',
          summary: 'Guidance on import, export, tax and regulatory requirements.',
        },
      ],
    },
    draft: {
      serviceDescriptions: [
        'Before you commit to a new market, we research it with you, compare entry models and put together a go-to-market plan that fits your goals and resources.',
        'When you are ready to set up, we support incorporation, licensing and local registration, so the practical steps of starting operations are handled in order.',
        'We introduce you to distributors, suppliers and joint-venture partners who match what you are looking for, and help you prepare for those conversations.',
        'We guide you through import, export, tax and regulatory requirements, so you understand your obligations before they become problems.',
      ],
      howWeDeliver: {
        intro: 'Every market-entry engagement follows the same four stages.',
        steps: [
          'Understand: we learn what you sell, where you want to grow and what you are prepared to invest.',
          'Plan: you get a market entry plan with clear steps, a schedule and costs.',
          'Deliver: we support research, set-up, introductions and compliance, and report progress.',
          'Sustain: we stay on for follow-up as your operations abroad develop.',
        ],
      },
      faqs: [
        {
          question: 'Who do you help with market entry?',
          answer:
            'SMEs, exporters, startups, investors and family businesses looking to grow across borders.',
        },
        {
          question: 'Can you help set up a company abroad?',
          answer: 'Yes. We support incorporation, licensing and local registration.',
        },
        {
          question: 'Do you help find partners?',
          answer:
            'Yes. We introduce clients to distributors, suppliers and joint-venture partners.',
        },
      ],
    },
  },
]

/** Rich text for the draft fields, built from the plain strings above. */
export const draftRichText = (v: VerticalSeed) => ({
  serviceDescriptions: v.draft.serviceDescriptions.map((text) => doc(p(text))),
  howWeDeliver: doc(p(v.draft.howWeDeliver.intro), ol(v.draft.howWeDeliver.steps)),
})
