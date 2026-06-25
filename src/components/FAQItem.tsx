interface FAQItemProps {
  question: string;
  answer: string;
}

export function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <details className="faq__item" data-reveal>
      <summary>{question}</summary>
      <p>{answer}</p>
    </details>
  );
}
