import SeoLandingLayout from '@/pages/seo/SeoLandingLayout';

const faqItems = [
  {
    question: 'How can I extract text from a PDF document?',
    answer:
      'Use a PDF text extractor that reads document layers and exports clean, copyable text for editing or analysis.',
  },
  {
    question: 'Does PDF text extraction work with scanned PDFs?',
    answer:
      'Scanned PDFs usually require OCR to convert images into selectable text before extraction.',
  },
];

export default function ExtractPdfTextPage() {
  return (
    <SeoLandingLayout
      title="Extract PDF Text Online | QuickDocTest"
      description="Extract text from PDF files quickly to reuse content in documents, reports, and workflows."
      h1="Extract Text from PDF Online"
      intro="Convert PDF content into reusable text for editing, indexing, and document automation."
      bullets={[
        'Fast extraction for common PDF files',
        'Clean output for copy, search, and edit',
        'SEO-ready workflow for document discoverability',
      ]}
      faqItems={faqItems}
    />
  );
}
