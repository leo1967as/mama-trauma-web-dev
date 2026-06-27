import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, MapPin, Calendar, User, Baby, Heart } from 'lucide-react';
import RiskBadge from '@/components/shared/RiskBadge';
import { getFlagLabel } from '@/lib/mockData';
import { formatDate } from '@/lib/dateUtils';

export default function ProfileSummary({ mother }) {
  const flagColors = {
    high_anxiety: 'bg-red-50 text-red-600 border-red-200',
    poor_sleep: 'bg-amber-50 text-amber-600 border-amber-200',
    low_social_support: 'bg-violet-50 text-violet-600 border-violet-200',
    missed_checkin: 'bg-orange-50 text-orange-600 border-orange-200',
    high_epds: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <Card className="border-border/60">
      <CardContent className="pt-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">ข้อมูลสรุป — Profile Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
          <InfoItem icon={Calendar} label="อายุ" value={`${mother.age} ปี`} />
          <InfoItem icon={Phone} label="เบอร์โทร" value={mother.phone} />
          <InfoItem icon={Calendar} label="วันคลอด" value={formatDate(mother.deliveryDate)} />
          <InfoItem icon={Baby} label="ประเภทการคลอด" value={mother.deliveryType} />
          <InfoItem icon={Calendar} label="วันหลังคลอด" value={`Day ${mother.postpartumDay}`} />
          <InfoItem icon={User} label="ผู้ดูแลหลัก" value={mother.supportPerson} />
          <InfoItem icon={MapPin} label="ที่อยู่" value={mother.location} />
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">ระดับการดูแล</span>
            <RiskBadge level={mother.riskLevel} />
          </div>
        </div>

        {/* Quick Flags */}
        {mother.flags.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Quick Flags</p>
            <div className="flex flex-wrap gap-2">
              {mother.flags.map((flag) => (
                <Badge
                  key={flag}
                  variant="outline"
                  className={`text-xs ${flagColors[flag] || 'bg-gray-50 text-gray-600 border-gray-200'}`}
                >
                  {getFlagLabel(flag)}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}