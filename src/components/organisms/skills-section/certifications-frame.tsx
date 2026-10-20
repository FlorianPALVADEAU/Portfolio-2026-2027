import { CertificationList } from "@/components/molecules/certification-list";
import { Frame } from "@/features/frame-rail";
import { certifications } from "@/lib/landing";
import { FrameIntro } from "./frame-intro";
import type { GroupFrameProps } from "./frame-props";

/** Frame 5: the credentials, as one card each under the title. */
export function CertificationsFrame({ order, total, messages }: GroupFrameProps) {
  return (
    <Frame aria-labelledby="skills-certifications" className="gap-8 md:gap-14">
      <FrameIntro
        order={order}
        total={total}
        titleId="skills-certifications"
        title={messages.certifications}
        lead={messages.certificationsLead}
      />
      <CertificationList items={certifications} />
    </Frame>
  );
}
