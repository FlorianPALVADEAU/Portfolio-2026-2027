import { Link } from "@/components/atoms/link";
import type { Messages } from "@/lib/i18n";
import { assetCredits, pictureCredits } from "@/lib/landing";

type CreditsContentProps = {
  credits: Messages["footer"]["credits"];
};

/** The sources and licences of the pictures and assets, listed inside the credits dialog. */
export function CreditsContent({ credits }: CreditsContentProps) {
  return (
    <div className="flex flex-col gap-8 text-sm">
      <section aria-labelledby="credits-photos" className="flex flex-col gap-3">
        <h3 id="credits-photos" className="font-medium">
          {credits.photos}
        </h3>
        <ul className="flex flex-col gap-3">
          {pictureCredits.map(({ id, title, author, licence, licenceUrl, sourceUrl }) => (
            <li key={id}>
              <Link href={sourceUrl} external>
                {`“${title}”`}
              </Link>
              {` ${author}, `}
              <Link href={licenceUrl} external>
                {licence}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="credits-assets" className="flex flex-col gap-3">
        <h3 id="credits-assets" className="font-medium">
          {credits.assets}
        </h3>
        <ul className="flex flex-col gap-3">
          {assetCredits.map(({ id, name, author, licence, licenceUrl, sourceUrl }) => (
            <li key={id}>
              <span className="text-muted-foreground">{`${credits.uses[id]}: `}</span>
              <Link href={sourceUrl} external>
                {name}
              </Link>
              {` ${author}, `}
              <Link href={licenceUrl} external>
                {licence}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
