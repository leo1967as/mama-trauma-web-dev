import CareTimeline from "../../components/afterbloom/CareTimeline";
import { useLang } from "../../lib/i18n";
import { HeroAccent, TabHero, TabSheet } from "../../lib/theme.jsx";

export default function JourneyTab({ onEpds, onNeedHelp, onNavigate }) {
  const { t } = useLang();
  const cj = t.careJourney;

  return (
    <div>
      <TabHero
        eyebrow={cj.heroEyebrow}
        title={<>{cj.heroTitle}<HeroAccent>{cj.heroTitleAccent}</HeroAccent></>}
        subtitle={cj.heroSubtitle}
        theme="sage"
      />
      <TabSheet gap={14}>
        <CareTimeline mode="full" onEpds={onEpds} onNeedHelp={onNeedHelp} onNavigate={onNavigate} />
      </TabSheet>
    </div>
  );
}
