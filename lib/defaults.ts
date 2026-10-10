// The whole editable site as one document. Anything missing from storage falls
// back to these values, which mirror the original static site.

export type Settings = { pageTitle: string; name: string; typedText: string; cvFile: string };

export type HeroData = {
  description: string; image: string;
  button1Label: string; button1Link: string; button2Label: string; button2Link: string;
};

export type AboutData = {
  sectionTitle: string; sectionSubtitle: string; image: string; quote: string;
  heading: string; bio: string; funFactEmoji: string; funFactText: string;
  button1Label: string; button2Label: string;
};

export type SkillsData = {
  summaryTitle: string; summaryText: string; certificationsTitle: string;
};

export type ResumeData = {
  sectionTitle: string; sectionSubtitle: string;
  experienceTitle: string; experienceIcon: string; experienceSubtitle: string;
  educationTitle: string; educationIcon: string; educationSubtitle: string;
};

export type PortfolioData = { sectionTitle: string; sectionSubtitle: string; allLabel: string };

export type ContactData = {
  sectionTitle: string; sectionSubtitle: string; infoTitle: string;
  formTitle: string; formSubtitle: string; buttonLabel: string; whatsappNumber: string;
};

// --- list items (each carries its own `order`) ---
export type SocialLink = { platform: string; url: string; icon: string; order: number };
export type HeroCard = { icon: string; label: string; order: number };
export type Highlight = { icon: string; title: string; text: string; order: number };
export type TimelineItem = { year: string; description: string; order: number };
export type SkillItem = { name: string; percent: number };
export type SkillCategory = { title: string; icon: string; skills: SkillItem[]; order: number };
export type SkillStat = { number: string; label: string; icon: string; order: number };
export type Certification = { label: string; order: number };
export type ExperienceItem = {
  role: string; company: string; duration: string; description: string;
  achievements: string[]; order: number;
};
export type EducationItem = {
  title: string; year: string; institution: string; description: string; order: number;
};
export type ContactInfo = { icon: string; title: string; text: string; link: string; order: number };
export type PortfolioFilter = { key: string; label: string; order: number };

/**
 * A block of a project's write-up. Projects are built from an ordered list of
 * these, so a detail page can read like a blog post: headings, paragraphs and
 * images in any order.
 */
export type ProjectBlock =
  | { type: 'heading'; id: string; text: string; icon?: string }
  | { type: 'text'; id: string; text: string }
  | { type: 'image'; id: string; src: string; caption?: string }
  | { type: 'gallery'; id: string; images: string[]; caption?: string };

export type Project = {
  slug: string;              // the /portfolio/<slug> URL
  title: string;
  category: string;          // small label over the card title
  image: string;             // card image + first detail slide
  gallery: string[];         // extra detail images

  /**
   * Optional description per detail image, keyed by image path. Clicking a
   * thumbnail shows the matching text instead of opening a lightbox.
   * Images with no entry here simply show no description.
   */
  imageNotes?: Record<string, string>;
  filters: string[];         // which filter keys this belongs to
  description: string;       // card caption + detail lead
  tech: string[];
  features: string[];
  date: string;
  client: string;
  liveUrl: string;
  /**
   * Whether this was paid/professional work or something built independently.
   * Shown as a badge so visitors can tell them apart at a glance.
   */
  kind?: 'professional' | 'personal';

  /** Free-form labels, e.g. "Capstone", "Open Source". */
  tags?: string[];

  /** The write-up, as an ordered list of blocks. */
  blocks: ProjectBlock[];
  order: number;

  // Superseded by `blocks`; kept so projects saved before the block editor
  // still render. migrateProject() folds these into blocks on read.
  overview?: string;
  challenge?: string;
  solution?: string;
};

/** Turns the old overview/challenge/solution fields into blocks, once. */
export function migrateProject(p: Project): Project {
  if (p.blocks?.length) return p;
  const blocks: ProjectBlock[] = [];
  const add = (title: string, icon: string, body?: string) => {
    if (!body?.trim()) return;
    blocks.push({ type: 'heading', id: `${title}-h`, text: title, icon });
    blocks.push({ type: 'text', id: `${title}-t`, text: body });
  };
  add('Project Overview', 'bi-clipboard-data', p.overview);
  add('The Challenge', 'bi-exclamation-diamond', p.challenge);
  add('The Solution', 'bi-award', p.solution);
  return { ...p, blocks };
}

export type SiteContent = {
  settings: Settings;
  hero: HeroData;
  about: AboutData;
  skills: SkillsData;
  resume: ResumeData;
  portfolio: PortfolioData;
  contact: ContactData;
  socials: SocialLink[];
  heroCards: HeroCard[];
  highlights: Highlight[];
  timeline: TimelineItem[];
  skillCategories: SkillCategory[];
  skillStats: SkillStat[];
  certifications: Certification[];
  experience: ExperienceItem[];
  education: EducationItem[];
  contactInfo: ContactInfo[];
  portfolioFilters: PortfolioFilter[];
  projects: Project[];
};

export const defaultContent: SiteContent = {
  settings: {
    pageTitle: 'Rafly Adriansyah',
    name: 'Rafly Adriansyah',
    typedText: 'Rafly Adriansyah',
    cvFile: '/CV-Rafly-Adriansyah.pdf',
  },

  hero: {
    description:
      'Full Stack Engineer from Bandung, Indonesia. I build scalable web applications, backend systems, and real-time monitoring platforms with Node.js, Python and AWS, and work on IoT integration and embedded applications with Qt.',
    image: '/assets/img/profile/profile-square-1.jpg',
    button1Label: 'View My Work', button1Link: '#portfolio',
    button2Label: 'Get In Touch', button2Link: '#contact',
  },

  about: {
    sectionTitle: 'About',
    sectionSubtitle: 'Get to know about me!',
    image: '/assets/img/profile/profile-square-1.jpg',
    quote: 'Building meaningful digital experiences through creative code.',
    heading: "Hi, I'm Rafly Adriansyah – Full Stack Engineer",
    bio: 'Full Stack Engineer with experience developing scalable web applications, backend systems, and real-time monitoring platforms. Skilled in Node.js, Python, AWS, Linux, MQTT, API development, and embedded application development using Qt. Experienced in IoT integration, cloud infrastructure, and industrial monitoring systems.',
    funFactEmoji: '💡',
    funFactText: 'Full Stack Engineer & lifelong learner based in Bandung',
    button1Label: 'View My Work',
    button2Label: 'Download Resume',
  },

  skills: {
    summaryTitle: 'Professional Expertise',
    summaryText:
      'Full Stack Engineer building scalable web applications, backend systems and real-time monitoring platforms. Experienced in API development, IoT integration with MQTT and Qt, cloud infrastructure on AWS, and large-scale data processing.',
    certificationsTitle: 'Certifications',
  },

  resume: {
    sectionTitle: 'Resume',
    sectionSubtitle:
      'My professional journey across full stack development, IoT and cloud engineering.',
    experienceTitle: 'Professional Journey',
    experienceIcon: 'bi-briefcase',
    experienceSubtitle: 'Work experiences in data, cloud, and software engineering projects.',
    educationTitle: 'Academic Excellence',
    educationIcon: 'bi-mortarboard',
    educationSubtitle: 'Formal education and certification in informatics, cloud, and engineering.',
  },

  portfolio: {
    sectionTitle: 'Portfolio',
    sectionSubtitle: 'Some of my projects and capstone works in web, cloud, and automation.',
    allLabel: 'All Projects',
  },

  contact: {
    sectionTitle: 'Contact',
    sectionSubtitle: 'You can reach me directly via WhatsApp, or through other contact methods below!',
    infoTitle: 'Contact Info',
    formTitle: 'Contact via WhatsApp',
    formSubtitle: 'Isi data berikut untuk langsung chat WhatsApp dengan saya 👋',
    buttonLabel: 'Send via WhatsApp',
    whatsappNumber: '6283100592719',
  },

  socials: [
    { platform: 'Twitter', url: 'https://twitter.com/rflyadr', icon: 'bi-twitter-x', order: 0 },
    { platform: 'Facebook', url: 'https://www.facebook.com/rflyadr', icon: 'bi-facebook', order: 1 },
    { platform: 'Instagram', url: 'https://www.instagram.com/gabolehdilihat', icon: 'bi-instagram', order: 2 },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/rflyadr', icon: 'bi-linkedin', order: 3 },
  ],

  heroCards: [
    { icon: 'bi-cloud', label: 'Cloud', order: 0 },
    { icon: 'bi-code-slash', label: 'Programming', order: 1 },
    { icon: 'bi-cpu', label: 'IoT Development', order: 2 },
  ],

  highlights: [
    { icon: 'bi-window-stack', title: 'Full Stack Development', text: 'Building web applications end to end with React, Next.js, NestJS and Vite.', order: 0 },
    { icon: 'bi-cpu', title: 'IoT & Embedded', text: 'Real-time monitoring and embedded applications using MQTT, Qt/C++ and edge computing.', order: 1 },
    { icon: 'bi-cloud', title: 'Cloud Infrastructure', text: 'AWS services including S3, DynamoDB, RDS, EC2, Greengrass and Amplify.', order: 2 },
  ],

  timeline: [
    { year: '2025 – Present', description: 'Software Engineer, PT. Qimtronics Cipta Anagata\nFleet management, equipment tracking and Qt/C++ health station applications.', order: 0 },
    { year: '2021 – 2025', description: 'B.Sc. Informatics Engineering, STMIK AMIK Bandung.\nIoT, AI and Machine Learning focused. Graduated October 2025.', order: 1 },
    { year: '2023 – 2025', description: 'Data Quality Assurance, PT. Samudra Data Nuswantara\nManaged data across 8 projects and automated reporting with Bash/Python.', order: 2 },
  ],

  // Each category's skills add up to 100%: a bar is that skill's share of the category.
  // Categories follow the CV's Technical Skills section.
  skillCategories: [
    {
      title: 'Web Development', icon: 'bi-code-slash', order: 0,
      skills: [
        { name: 'React', percent: 26 }, { name: 'Next.js', percent: 26 },
        { name: 'NestJS', percent: 24 }, { name: 'Vite', percent: 24 },
      ],
    },
    {
      title: 'Backend & Scraping', icon: 'bi-server', order: 1,
      skills: [
        { name: 'Node.js', percent: 35 }, { name: 'Python', percent: 33 },
        { name: 'Web Scraping / Crawling', percent: 32 },
      ],
    },
    {
      title: 'Database & Systems', icon: 'bi-database', order: 2,
      skills: [
        { name: 'SQL', percent: 27 }, { name: 'NoSQL', percent: 25 },
        { name: 'Linux', percent: 25 }, { name: 'Windows', percent: 23 },
      ],
    },
    {
      title: 'AWS Infrastructure', icon: 'bi-cloud', order: 3,
      skills: [
        { name: 'S3', percent: 21 }, { name: 'DynamoDB', percent: 20 },
        { name: 'EC2', percent: 20 }, { name: 'RDS', percent: 20 },
        { name: 'Amplify', percent: 19 },
      ],
    },
  ],

  // Icons match the original template's (commented-out) stats block.
  skillStats: [
    { number: '3+', label: 'Years Experience', icon: 'bi-trophy', order: 0 },
    { number: '8+', label: 'Projects Handled', icon: 'bi-diagram-3', order: 1 },
    { number: '150+', label: 'Devices Maintained', icon: 'bi-people', order: 2 },
  ],

  certifications: [{ label: 'AWS Certified Cloud Practitioner', order: 0 }],

  experience: [
    {
      role: 'Software Engineer', company: 'PT. Qimtronics Cipta Anagata', duration: 'Sep 2025 – Present',
      description: 'Building real-time monitoring and tracking platforms for fleet and heavy-equipment operations, plus embedded applications for edge devices.',
      achievements: [
        'Built a real-time Fleet Management System with fleet assignment, live unit tracking and interactive map editing using Next.js and NestJS',
        'Developed a Support Equipment Tracking System for standalone heavy-equipment tracking, including alert management and dispatcher-to-operator chat',
        'Developed a Qt/C++ Health Station application on Tinker Board SBC, integrated with AWS Greengrass for edge computing and OTA deployment',
      ],
      order: 0,
    },
    {
      role: 'Data Quality Assurance', company: 'PT. Samudra Data Nuswantara', duration: 'Aug 2023 – Sep 2025',
      description: 'Managed and processed large-scale datasets, handled client data requests and automated reporting workflows.',
      achievements: [
        'Managed and processed large-scale datasets across 8 projects',
        'Handled client data requests',
        'Developed automation scripts using Bash/Python with Elasticsearch API integration',
      ],
      order: 1,
    },
    {
      role: 'AWS Cloud Data Analytics Apprentice', company: 'PT. Techno International Mandira', duration: 'Sep 2024 – Dec 2024',
      description: 'Analysed data and built an AI chatbot while learning to run AWS infrastructure.',
      achievements: [
        'Analysed data using Amazon QuickSight',
        'Developed an AI chatbot with Amazon Bedrock (LLM) for the Capstone project',
        'Set up and managed AWS components such as EC2, DynamoDB and S3 for data storage and processing',
      ],
      order: 2,
    },
    {
      role: 'Laravel Developer Intern', company: 'Regional Education Office 7 West Java', duration: 'Feb 2024 – Jun 2024',
      description: 'Built personnel management web applications for submissions.',
      achievements: [
        'Built personnel management web apps for submissions',
        'Developed using Laravel without a team',
        'Assisted the public relations team in designing templates for social media',
      ],
      order: 3,
    },
    {
      role: 'IT & Electronic Technician Freelance', company: 'Laboratory of Electronics', duration: 'Jan 2023 – Dec 2024',
      description: 'Maintained over 150 devices, handled troubleshooting and provided preventive maintenance for 20 regular clients.',
      achievements: [], order: 4,
    },
  ],

  education: [
    {
      title: 'B.Sc. Informatics Engineering', year: 'Sep 2021 – Oct 2025',
      institution: 'STMIK AMIK Bandung (Institute of Informatics and Computer Management)',
      description: 'IoT, AI and Machine Learning focused.\nAdditional activities: R&D Robotics, robotics development and technology competitions.',
      order: 0,
    },
    {
      title: 'AWS Certified Cloud Practitioner', year: '2024', institution: 'Amazon Web Services',
      description: 'Certified for AWS cloud fundamentals and cloud data analytics.', order: 1,
    },
  ],

  contactInfo: [
    { icon: 'bi-geo-alt', title: 'Location', text: 'Bandung, Indonesia', link: '', order: 0 },
    { icon: 'bi-telephone', title: 'Phone', text: '+62 831-0059-2719', link: 'tel:+6283100592719', order: 1 },
    { icon: 'bi-envelope', title: 'Email', text: 'raflyadriansyah79@gmail.com', link: 'mailto:raflyadriansyah79@gmail.com', order: 2 },
    { icon: 'bi-linkedin', title: 'LinkedIn', text: 'linkedin.com/in/rflyadr', link: 'https://linkedin.com/in/rflyadr', order: 3 },
  ],

  portfolioFilters: [
    { key: 'web', label: 'Web Development', order: 0 },
    { key: 'iot', label: 'IoT / Embedded', order: 1 },
    { key: 'cloud', label: 'Cloud', order: 2 },
    { key: 'ai', label: 'AI / Data', order: 3 },
  ],

  projects: [
    {
      slug: 'fleet-management', title: 'Real-Time Fleet Management System', category: 'Web / Real-Time',
      image: '', gallery: [], filters: ['web', 'cloud'],
      description: 'Real-time fleet platform with unit assignment, live tracking and interactive map editing.',
      tech: ['Next.js', 'NestJS', 'TypeScript', 'Real-time'],
      features: ['Fleet assignment', 'Live unit tracking', 'Interactive map editing'],
      date: '2025', client: 'PT. Qimtronics Cipta Anagata', liveUrl: '',
      kind: 'professional', tags: ['Qimtronics', 'Production'],
      blocks: [
        { type: 'heading', id: 'h1', text: 'Project Overview', icon: 'bi-clipboard-data' },
        { type: 'text', id: 't1', text: 'A real-time Fleet Management System built with Next.js and NestJS, covering fleet assignment, live unit tracking and interactive map editing.' },
      ],
      order: 0,
    },
    {
      slug: 'equipment-tracking', title: 'Support Equipment Tracking System', category: 'Web / Real-Time',
      image: '', gallery: [], filters: ['web', 'cloud'],
      description: 'Standalone heavy-equipment tracking with alert management and dispatcher-to-operator chat.',
      tech: ['Next.js', 'NestJS', 'Real-time'],
      features: ['Standalone equipment tracking', 'Alert management', 'Dispatcher-to-operator chat'],
      date: '2025', client: 'PT. Qimtronics Cipta Anagata', liveUrl: '',
      kind: 'professional', tags: ['Qimtronics', 'Production'],
      blocks: [
        { type: 'heading', id: 'h1', text: 'Project Overview', icon: 'bi-clipboard-data' },
        { type: 'text', id: 't1', text: 'A tracking system for standalone heavy equipment, including alert management and direct chat between dispatchers and operators.' },
      ],
      order: 1,
    },
    {
      slug: 'health-station', title: 'Qt/C++ Health Station', category: 'IoT / Embedded',
      image: '', gallery: [], filters: ['iot', 'cloud'],
      description: 'Embedded health station on Tinker Board SBC, integrated with AWS Greengrass for edge computing and OTA deployment.',
      tech: ['Qt', 'C++', 'Tinker Board SBC', 'AWS Greengrass', 'MQTT'],
      features: ['Embedded Qt application', 'Edge computing with AWS Greengrass', 'OTA deployment'],
      date: '2025', client: 'PT. Qimtronics Cipta Anagata', liveUrl: '',
      kind: 'professional', tags: ['Qimtronics', 'Embedded'],
      blocks: [
        { type: 'heading', id: 'h1', text: 'Project Overview', icon: 'bi-clipboard-data' },
        { type: 'text', id: 't1', text: 'A Qt/C++ Health Station application running on Tinker Board SBC hardware, integrated with AWS Greengrass for edge computing and over-the-air deployment.' },
      ],
      order: 2,
    },
    {
      slug: 'virbi', title: 'Virtual Bicycle', category: 'IoT Project',
      image: '/assets/img/portfolio/virbi.png', gallery: [], filters: ['iot', 'web'],
      description: 'A prototype of a smart bicycle with sensor integration and cloud dashboard.',
      tech: ['IoT', 'Sensors', 'Cloud Dashboard'], features: ['Sensor integration', 'Cloud dashboard'],
      date: '', client: '', liveUrl: '',
      kind: 'personal', tags: ['Campus Project'],
      blocks: [
        { type: 'heading', id: 'h1', text: 'Project Overview', icon: 'bi-clipboard-data' },
        { type: 'text', id: 't1', text: 'A prototype of a smart bicycle with sensor integration and cloud dashboard.' },
      ],
      order: 3,
    },
    {
      slug: 'smart-home', title: 'Smart Home', category: 'AI / IoT',
      image: '/assets/img/portfolio/iot.png', gallery: [], filters: ['iot', 'ai'],
      description: 'IoT smart home system with AI assistant and remote monitoring.',
      tech: ['IoT', 'AI Assistant', 'Cloud'], features: ['AI assistant', 'Remote monitoring'],
      date: '', client: '', liveUrl: '',
      kind: 'personal', tags: ['Campus Project'],
      blocks: [
        { type: 'heading', id: 'h1', text: 'Project Overview', icon: 'bi-clipboard-data' },
        { type: 'text', id: 't1', text: 'IoT smart home system with AI assistant and remote monitoring.' },
      ],
      order: 4,
    },
    {
      slug: 'chatbot', title: 'Chatbot Web Apps Using Agentic AI & RAG', category: 'Web / AI',
      image: '/assets/img/portfolio/chatbot.png', gallery: [], filters: ['web', 'ai'],
      description: 'Chatbot web apps leveraging React, FastAPI, Docker, and Elasticsearch for RAG.',
      tech: ['React', 'FastAPI', 'Docker', 'Elasticsearch'],
      features: ['Agentic AI', 'Retrieval-Augmented Generation (RAG)', 'Dockerized deployment'],
      date: '', client: '', liveUrl: '',
      kind: 'personal', tags: ['Final Project', 'AI'],
      blocks: [
        { type: 'heading', id: 'h1', text: 'Project Overview', icon: 'bi-clipboard-data' },
        { type: 'text', id: 't1', text: 'Chatbot web apps leveraging React, FastAPI, Docker, and Elasticsearch for RAG.' },
      ],
      order: 5,
    },
    {
      slug: 'personnel', title: 'Personnel Management Web App', category: 'Web Development',
      image: '/assets/img/portfolio/kcd.png', gallery: [], filters: ['web'],
      description: 'Built with Laravel for regional education office personnel management.',
      tech: ['Laravel'], features: ['Personnel data management'],
      date: '', client: 'Regional education office', liveUrl: '',
      kind: 'professional', tags: ['Internship', 'Laravel'],
      blocks: [
        { type: 'heading', id: 'h1', text: 'Project Overview', icon: 'bi-clipboard-data' },
        { type: 'text', id: 't1', text: 'Built with Laravel for regional education office personnel management.' },
      ],
      order: 6,
    },
    {
      slug: 'aws', title: 'AWS Cloud Data Analytics', category: 'Cloud / Analytics',
      image: '/assets/img/portfolio/data.png', gallery: [], filters: ['cloud', 'ai'],
      description: 'Data analysis and infrastructure with Amazon QuickSight, Bedrock, EC2, DynamoDB, S3.',
      tech: ['QuickSight', 'Bedrock', 'EC2', 'DynamoDB', 'S3'],
      features: ['Analytics dashboards', 'Cloud infrastructure'],
      date: '', client: '', liveUrl: '',
      kind: 'professional', tags: ['Apprenticeship', 'AWS'],
      blocks: [
        { type: 'heading', id: 'h1', text: 'Project Overview', icon: 'bi-clipboard-data' },
        { type: 'text', id: 't1', text: 'Data analysis and infrastructure with Amazon QuickSight, Bedrock, EC2, DynamoDB, S3.' },
      ],
      order: 7,
    },
  ],
};
