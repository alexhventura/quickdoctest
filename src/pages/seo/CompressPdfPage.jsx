import SeoLandingLayout from '@/pages/seo/SeoLandingLayout';

const faqItems = [
  {
    question: 'How can I compress PDF files without losing quality?',
    answer:
      'Use a smart compression engine that optimizes images, embedded fonts, and metadata while preserving readability.',
  },
  {
    question: 'Is online PDF compression secure?',
    answer:
      'Choose tools that use HTTPS, process files with strict security rules, and avoid keeping documents longer than necessary.',
  },
];

export default function CompressPdfPage() {
  return (
    <SeoLandingLayout
      title="Compress PDF Online | QuickDocTest"
      description="Compress PDF files quickly with professional quality, fast processing, and secure upload workflows."
      h1="Compress PDF Files Online"
      intro="Reduce PDF file size for email, web upload, and document workflows while preserving visual quality."
      bullets={[
        'Smart size reduction for faster sharing',
        'Balanced quality-to-size optimization',
        'Secure and reliable online processing',
      ]}
      faqItems={faqItems}
    />
  );
}
