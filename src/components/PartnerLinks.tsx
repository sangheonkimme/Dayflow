import { getPartnerLinks, type PartnerSurface } from "@/data/partners";
import styles from "./PartnerLinks.module.css";

// 제휴 링크 카드 — 대출·연봉 등 금융 도구 페이지 하단에 마운트.
// 광고 표기("AD" 배지)와 제휴 수수료 고지는 표시광고법상 생략 불가.

export function PartnerLinks({
  surface,
  title,
  className,
}: {
  surface: PartnerSurface;
  title: string;
  className?: string;
}) {
  const links = getPartnerLinks(surface);
  if (links.length === 0) return null;

  return (
    <section
      className={className ? `${styles.wrap} ${className}` : styles.wrap}
      aria-label="제휴 서비스 추천"
    >
      <div className={styles.head}>
        <h3 className={styles.headTitle}>{title}</h3>
        <span className={styles.adBadge}>AD</span>
      </div>

      <div className={styles.list}>
        {links.map((link) => (
          <a
            key={link.id}
            className={styles.item}
            href={link.href}
            target="_blank"
            rel="sponsored noopener noreferrer"
            data-partner-id={link.id}
          >
            <span className={styles.itemBody}>
              <span className={styles.itemPartner}>{link.partner}</span>
              <span className={styles.itemTitle}>{link.title}</span>
              <span className={styles.itemDesc}>{link.desc}</span>
            </span>
            <span className={styles.itemCta}>{link.cta}</span>
          </a>
        ))}
      </div>

      <p className={styles.disclosure}>
        위 링크를 통해 서비스에 가입하면 Dayflow가 제휴 수수료를 받을 수 있어요.
        추천 내용은 수수료와 무관하게 작성돼요.
      </p>
    </section>
  );
}
