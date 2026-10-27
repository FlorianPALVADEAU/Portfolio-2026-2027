import { CertificationList } from "@/components/molecules/certification-list";
import { Frame } from "@/features/frame-rail";
import { certifications } from "@/lib/landing";
import { FrameIntro } from "./frame-intro";
import type { GroupFrameProps } from "./frame-props";

/** Frame 6: the credentials, one plate each under the title. */
export function CertificationsFrame({ order, total, messages }: GroupFrameProps) {
  const items = certifications.map((certification) => ({
    ...certification,
    issued: messages.certificationDates[certification.id],
  }));

  return (
    <Frame numeral="06" aria-labelledby="skills-certifications" className="gap-5 md:gap-14">
      <FrameIntro
        order={order}
        total={total}
        titleId="skills-certifications"
        title={messages.certifications}
        lead={messages.certificationsLead}
      />
      <CertificationList
        items={items}
        labels={{ verify: messages.verify, credentialId: messages.credentialId }}
      />
    </Frame>
  );
}
