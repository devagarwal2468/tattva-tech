// Single source of truth for company facts shown across the website.
// Edit values here — every page reads from this file.

export const company = {
  name: 'Tattva Tech',
  legalName: 'Tattva Tech',
  tagline: 'Ideas into Impact',
  url: 'https://tattvatechsolutions.in',
  email: 'nkjain796@gmail.com',
  phone: '+91 91311 95754',
  phoneHref: 'tel:+919131195754',
  whatsappNumber: '919131195754',
  summary:
    'Tattva Tech is a technology and innovation company building software, AI, robotics and digital solutions for startups, businesses, educational institutions and organisations.',
};

export const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/tattvaa-tech/' },
  { label: 'Instagram', href: 'https://www.instagram.com/p/De_tXnDNWst/' },
];

export const offices = [
  {
    city: 'Gurugram',
    region: 'Haryana',
    address: 'South City 2, Sector 49, Gurugram, Haryana',
    image: '/images/office-gurugram.webp',
    imageAlt: 'Gurugram skyline',
  },
  {
    city: 'Gwalior',
    region: 'Madhya Pradesh',
    address: 'Tansen Nagar, Gwalior, Madhya Pradesh',
    image: '/images/office-gwalior.webp',
    imageAlt: 'Gwalior Fort',
  },
  {
    city: 'Saharanpur',
    region: 'Uttar Pradesh',
    address: '6/1400 New Jawahar Park, Behind Bhuteshwar Mandir, Raghav Puram, Saharanpur, Uttar Pradesh',
    image: '/images/office-saharanpur.webp',
    imageAlt: 'Saharanpur city view',
  },
];

// Headline numbers. These are the figures the company already published on the
// previous site — update them here whenever they change. Keep them truthful.
export const stats = [
  { value: '50+', label: 'Projects delivered' },
  { value: '30+', label: 'Clients served' },
  { value: '5+', label: 'In-house products' },
  { value: '3', label: 'Offices across India' },
];

export const leadership = [
  {
    name: 'Sanskar Jain',
    role: 'Founder',
    focus: 'Vision, product strategy and AI architecture',
    initials: 'SJ',
  },
  {
    name: 'Dev Agarwal',
    role: 'Co-Founder',
    focus: 'Business operations, growth and client partnerships',
    initials: 'DA',
  },
];

export const navigation = [
  { label: 'Services', to: '/services', hasMenu: true },
  { label: 'Products', to: '/products' },
  { label: 'Work', to: '/work' },
  { label: 'About', to: '/about' },
  { label: 'Insights', to: '/insights' },
  { label: 'Careers', to: '/careers' },
];

// Technologies the team works with (not partnerships or endorsements).
export const technologies = [
  'React',
  'Next.js',
  'Node.js',
  'TypeScript',
  'Python',
  'Django',
  'FastAPI',
  'Flutter',
  'React Native',
  'PostgreSQL',
  'MongoDB',
  'AWS',
  'Google Cloud',
  'Docker',
  'TensorFlow',
  'PyTorch',
  'OpenAI API',
  'LangChain',
  'ROS 2',
  'ESP32',
  'Raspberry Pi',
  'Figma',
];

export const engagementModels = [
  {
    title: 'Fixed-scope project',
    desc: 'A clearly defined scope, timeline and price. Best for websites, MVPs and well-understood builds.',
  },
  {
    title: 'Dedicated team',
    desc: 'Engineers and designers who work as an extension of your team, on a monthly engagement.',
  },
  {
    title: 'White-label delivery',
    desc: 'We build under your brand for agencies and technology companies that need extra capacity.',
  },
  {
    title: 'Long-term partnership',
    desc: 'Ongoing product development, maintenance and improvement after launch.',
  },
];

export const processSteps = [
  {
    title: 'Discover',
    desc: 'We understand your goals, users and constraints, then agree on scope, success metrics and a realistic plan.',
  },
  {
    title: 'Design',
    desc: 'Information architecture, wireframes and high-fidelity prototypes you can click through before we build.',
  },
  {
    title: 'Build',
    desc: 'Short sprints with working demos, code reviews and testing — you see progress every week, not at the end.',
  },
  {
    title: 'Launch & grow',
    desc: 'Production deployment, monitoring and handover, followed by support, iteration and growth.',
  },
];

export const principles = [
  {
    title: 'Product thinking first',
    desc: 'We start from the business outcome and the user, not from the technology. Every feature has to earn its place.',
    icon: 'Target',
  },
  {
    title: 'Transparent by default',
    desc: 'Clear estimates, weekly demos, shared boards and direct access to the people building your product.',
    icon: 'MessagesSquare',
  },
  {
    title: 'One connected team',
    desc: 'Engineering, AI, robotics, design and marketing under one roof — fewer hand-offs, faster delivery.',
    icon: 'Users',
  },
  {
    title: 'With you after launch',
    desc: 'We maintain, monitor and improve what we ship. Launch is the beginning of the relationship, not the end.',
    icon: 'LifeBuoy',
  },
];

export const faqs = [
  {
    q: 'What services does Tattva Tech provide?',
    a: 'Custom software, web and mobile applications, AI and machine learning, AI agents and automation, IoT and robotics, UI/UX and brand design, SaaS product development, and digital growth (SEO, AEO, GEO, content and marketing).',
  },
  {
    q: 'Can you take a project from idea to launch?',
    a: 'Yes. We support the full journey — discovery, planning, design, development, testing, deployment, marketing and ongoing improvement. Scope is shaped around your goals and budget.',
  },
  {
    q: 'Do you build custom robots and automation systems?',
    a: 'Yes. We design custom robotic systems and prototypes around the use case, requirements and budget — including robot architecture, sensors, embedded systems, computer vision and AI-powered or autonomous features.',
  },
  {
    q: 'Do you work with startups, schools and small businesses?',
    a: 'Yes. We work with startups, businesses, educational institutions, research organisations and other teams, and aim to make practical technology accessible across project sizes.',
  },
  {
    q: 'Do you work with clients outside India?',
    a: 'Yes. We collaborate remotely with startups, businesses, agencies and technology companies in different countries and time zones.',
  },
  {
    q: 'Do you offer white-label development or dedicated teams?',
    a: 'Yes. Depending on the project we work as a fixed-scope vendor, a white-label partner, a dedicated team, or a long-term technology partner.',
  },
  {
    q: 'How much does a project cost and how long does it take?',
    a: 'It depends on scope, complexity and delivery plan. After a short discovery call we share a written proposal with a project-specific estimate and timeline.',
  },
  {
    q: 'How do I get started?',
    a: 'Share your idea, goals and any requirements through the contact form or WhatsApp. We will set up a short call to understand your needs and suggest the right next step.',
  },
];
