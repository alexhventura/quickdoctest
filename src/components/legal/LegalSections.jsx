import { memo } from 'react';

function LegalSections({ sections }) {
  return sections.map((section, idx) => (
    <div key={section.heading || idx}>
      {section.heading && <h2>{section.heading}</h2>}
      {section.paragraphs?.map((text) => (
        <p key={text}>{text}</p>
      ))}
      {section.list?.length > 0 && (
        <ul>
          {section.list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  ));
}

export default memo(LegalSections);
