import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatDate } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';

const getEpdsInterpretation = (score) => {
  if (score <= 8) return { label: 'อยู่ในเกณฑ์ปกติ', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  if (score <= 12) return { label: 'ควรติดตาม', color: 'bg-amber-50 text-amber-700 border-amber-200' };
  return { label: 'ต้องการความช่วยเหลือ', color: 'bg-red-50 text-red-700 border-red-200' };
};

export default function EpdsSummary({ mother }) {
  const interp = getEpdsInterpretation(mother.epdsScore);
  const scoreDiff = mother.prevEpdsScore !== null ? mother.epdsScore - mother.prevEpdsScore : null;

  return (
    <Card className="border-border/60">
      <CardContent className="pt-6">
        <h3 className="text-sm font-semibold text-foreground mb-1">ผลคัดกรอง EPDS</h3>
        <p className="text-xs text-muted-foreground mb-4">EPDS Screening Summary — ไม่ใช่การวินิจฉัย</p>

        <div className="flex items-start gap-6">
          {/* Score Circle */}
          <div className={cn(
            'w-20 h-20 rounded-2xl flex flex-col items-center justify-center border-2',
            mother.epdsScore > 12
              ? 'border-red-300 bg-red-50'
              : mother.epdsScore > 8
                ? 'border-amber-300 bg-amber-50'
                : 'border-emerald-300 bg-emerald-50'
          )}>
            <span className="text-2xl font-bold text-foreground">{mother.epdsScore}</span>
            <span className="text-[10px] text-muted-foreground">/30</span>
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={cn('text-xs', interp.color)}>
                {interp.label}
              </Badge>
              {scoreDiff !== null && (
                <span className={cn(
                  'flex items-center gap-1 text-xs font-medium',
                  scoreDiff > 0 ? 'text-red-500' : scoreDiff < 0 ? 'text-emerald-500' : 'text-muted-foreground'
                )}>
                  {scoreDiff > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : scoreDiff < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : null}
                  {scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff} จากครั้งก่อน
                </span>
              )}
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>วันที่คัดกรอง: {formatDate(mother.epdsDate)}</p>
              {mother.prevEpdsScore !== null && (
                <p>คะแนนครั้งก่อน: {mother.prevEpdsScore}</p>
              )}
            </div>
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground mt-4 italic">
          * ผลคัดกรอง EPDS เป็นเครื่องมือประเมินเบื้องต้น ไม่ใช่การวินิจฉัยทางการแพทย์
        </p>
      </CardContent>
    </Card>
  );
}