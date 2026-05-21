export const terms = {
  title: 'QuickDocTest Terms of Use',
  metaTitle: 'Terms of Use | QuickDocTest',
  updatedLabel: 'Last updated:',
  intro: [
    'QuickDocTest is an online platform designed to assess typing proficiency and skills related to text entry in a digital environment.',
    'By using the system, the user declares agreement with these Terms of Use.',
  ],
  sections: [
    {
      heading: 'Purpose',
      paragraphs: [
        'QuickDocTest aims to measure performance indicators related to typing, including speed, accuracy, consistency, and operational efficiency.',
        'Results are informational and evaluative in nature and do not constitute regulated professional certification, legal qualification, or official accreditation.',
      ],
    },
    {
      heading: 'User Responsibilities',
      paragraphs: ['The user agrees to:'],
      list: [
        'Provide truthful information;',
        'Not use automation software;',
        'Not use auto-fill tools;',
        'Not artificially manipulate results;',
        'Use the platform ethically.',
      ],
    },
    {
      heading: 'Intellectual Property',
      paragraphs: [
        'All QuickDocTest content, including brand, logos, interface, algorithms, reports, and certificates, is protected by applicable intellectual property laws.',
      ],
    },
    {
      heading: 'Availability',
      paragraphs: [
        'The service is provided subject to technical availability, without guarantee of uninterrupted operation.',
      ],
    },
    {
      heading: 'Changes',
      paragraphs: [
        'These Terms may be updated periodically.',
        'Continued use of the platform implies agreement with any changes.',
      ],
    },
  ],
};

export const privacy = {
  title: 'Privacy Policy',
  metaTitle: 'Privacy Policy | QuickDocTest',
  updatedLabel: 'Last updated:',
  intro:
    'QuickDocTest respects user privacy and adopts technical and organizational measures to protect processed information.',
  sections: [
    {
      heading: 'Data Collected',
      paragraphs: ['The following may be collected:'],
      list: [
        'Name;',
        'Email address;',
        'Selected language;',
        'Test results;',
        'Performance statistics;',
        'Browser technical information;',
        'IP address for security and fraud prevention.',
      ],
    },
    {
      heading: 'Purpose of Collection',
      paragraphs: ['Data is used for:'],
      list: [
        'generating results;',
        'issuing certificates;',
        'authenticity validation;',
        'continuous platform improvement;',
        'preventing misuse.',
      ],
    },
    {
      heading: 'Sharing',
      paragraphs: [
        'QuickDocTest does not sell personal data.',
        'Information may only be shared when:',
      ],
      list: [
        'required by law;',
        'necessary for hosting or technical operation of the system;',
        'authorized by the user.',
      ],
    },
    {
      heading: 'Security',
      paragraphs: ['Reasonable protection measures are applied to reduce risks of:'],
      list: ['unauthorized access;', 'improper alteration;', 'information loss.'],
    },
    {
      heading: 'Retention',
      paragraphs: [
        'Data may be retained as long as necessary for platform operation and future validation of issued certificates.',
      ],
    },
    {
      heading: 'User Rights',
      paragraphs: ['Users may request:'],
      list: [
        'access to their data;',
        'correction;',
        'deletion when applicable;',
        'clarification about information processing.',
      ],
    },
  ],
};

export const instructions = {
  title: 'How QuickDocTest Works',
  subtitle: 'Understand how your typing proficiency is assessed.',
  metaTitle: 'How It Works | QuickDocTest',
  intro: [
    'QuickDocTest uses internationally recognized metrics to assess typing performance objectively and consistently.',
    'During the test, a text is presented to the participant, who must reproduce it as accurately as possible within the allotted time.',
  ],
  metricsHeading: 'Metrics assessed',
  metrics: [
    {
      title: 'Net Speed (Net WPM)',
      body: 'Number of words effectively typed per minute considering errors made. Represents the participant’s real productivity.',
    },
    {
      title: 'Gross Speed (Gross WPM)',
      body: 'Total number of words typed per minute without deducting errors. Represents absolute typing speed.',
    },
    {
      title: 'Accuracy',
      body: 'Percentage of correctly typed characters. Higher accuracy means higher typing quality.',
    },
    {
      title: 'CPM (Characters Per Minute)',
      body: 'Number of characters typed per minute. Widely used in international assessments.',
    },
    {
      title: 'Consistency',
      body: 'Measures performance stability throughout the test. Lower variation means higher consistency.',
    },
    {
      title: 'Latency',
      body: 'Average time between keystrokes. Lower values indicate greater operational fluency.',
    },
    {
      title: 'Error Rate',
      body: 'Number of incorrect characters entered during the test.',
    },
    {
      title: 'Completion',
      body: 'Percentage of text completed within the available time.',
    },
    {
      title: 'Overall Performance',
      body: 'Composite indicator considering speed, accuracy, consistency, and fluency.',
    },
  ],
  levelsHeading: 'Proficiency classification',
  tableLevel: 'Level',
  tableDescription: 'Description',
  levels: [
    { level: 'Beginner', range: 'up to 25 WPM' },
    { level: 'Basic', range: '26 to 40 WPM' },
    { level: 'Intermediate', range: '41 to 60 WPM' },
    { level: 'Advanced', range: '61 to 80 WPM' },
    { level: 'Professional', range: '81 to 100 WPM' },
    { level: 'Expert', range: 'above 100 WPM' },
  ],
  note: 'The ranges above are indicative and may vary according to language, text used, and assessment methodology.',
};
