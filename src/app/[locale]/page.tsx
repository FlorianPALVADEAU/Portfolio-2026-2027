import { notFound } from "next/navigation";
import { BookingFacade } from "@/components/organisms/booking-facade";
import { ContactForm } from "@/components/organisms/contact-form";
import { GithubActivity } from "@/components/organisms/github-activity";
import { PersonSchema } from "@/components/organisms/person-schema";
import { Home } from "@/components/templates/home";
import { getMessages, isLocale } from "@/lib/i18n";
import { CONTACT_ACTION, submitContact } from "@/server/infrastructure/contact";
import { loadProject, projectSlugs } from "@/server/infrastructure/content";
import { cvHref } from "@/server/infrastructure/cv";
import { githubActivity } from "@/server/infrastructure/github";
import { photoUrls } from "@/server/infrastructure/photos";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = await getMessages(locale);
  const projects = await Promise.all(projectSlugs.map((slug) => loadProject(slug, locale)));
  if (projects.length === 0) throw new Error("The landing page needs at least one project");

  return (
    <>
      <PersonSchema locale={locale} jobTitle={messages.home.role} />
      <Home
        locale={locale}
        messages={messages.home}
        cvHref={await cvHref(locale)}
        heroPhotos={await photoUrls("hero")}
        projects={projects}
        contact={
          <>
            <GithubActivity
              locale={locale}
              messages={messages.home.contact.github}
              activity={await githubActivity()}
            />
            <ContactForm
              messages={messages.home.contact.form}
              action={submitContact}
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              challengeAction={CONTACT_ACTION}
            />
            <BookingFacade
              messages={messages.home.contact.booking}
              url={process.env.NEXT_PUBLIC_CALENDLY_URL}
            />
          </>
        }
      />
    </>
  );
}
