interface ServiceCardProps {
  num: string;
  title: string;
  description: string;
}

export function ServiceCard({ num, title, description }: ServiceCardProps) {
  return (
    <article className="card card--rise" data-aos="fade-up">
      <span className="card__num" aria-hidden="true">
        {num}
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}
