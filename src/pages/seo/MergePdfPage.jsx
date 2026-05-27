import SeoLandingLayout from '@/pages/seo/SeoLandingLayout';

const faqItems = [
  {
    question: 'How do I merge multiple PDFs into one file?',
    answer:
      'Upload your files in order, review the sequence, and generate a single combined document ready to download.',
  },
  {
    question: 'Can I reorder pages before merging PDFs?',
    answer:
      'Yes, a modern merge workflow should let you rearrange pages and files before creating the final PDF.',
  },
];

export default function MergePdfPage() {
  return (
    <SeoLandingLayout
      title="Merge PDF Online | QuickDocTest"
      description="Combine multiple PDF documents into one file with a fast, intuitive, and reliable merge workflow."
      h1="Merge PDF Documents Online"
      intro="Join multiple PDF files into a single organized document for contracts, reports, and submissions."
      bullets={[
        'Combine multiple files in seconds',
        'Keep page order clean and organized',
        'Optimized for desktop and mobile use',
      ]}
      faqItems={faqItems}
    />
  );
}
