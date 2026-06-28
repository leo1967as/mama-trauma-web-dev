import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Eye, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMothers } from '@/hooks/useFirestoreData';
import RiskBadge from '@/components/shared/RiskBadge';
import TrendIndicator from '@/components/shared/TrendIndicator';
import { formatDateTime } from '@/lib/dateUtils';

export default function RecentMothersTable() {
  const navigate = useNavigate();
  const { mothers, loading } = useMothers();
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');

  const filtered = mothers.filter((m) => {
    const matchSearch = !search || [m.name, m.hn, m.phone].some((value) => String(value || '').includes(search));
    const matchRisk = riskFilter === 'all' || m.riskLevel === riskFilter;
    const matchStage = stageFilter === 'all' || m.postpartumStage === stageFilter;
    return matchSearch && matchRisk && matchStage;
  });

  // Sort: high risk first, then attention, then others
  const sorted = [...filtered].sort((a, b) => {
    const order = { high: 0, attention: 1, unassessed: 2, low: 3, inactive: 4 };
    return (order[a.riskLevel] ?? 4) - (order[b.riskLevel] ?? 4);
  });

  const stages = [...new Set(mothers.map((m) => m.postpartumStage))];

  if (loading) {
    return (
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-center p-8">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-rose-500 rounded-full animate-spin" />
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold">รายชื่อคุณแม่</CardTitle>
            <p className="text-xs text-muted-foreground">เรียงตามลำดับความเร่งด่วน</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/mothers')} className="text-xs">
            ดูทั้งหมด
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ค้นหาชื่อ / HN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-[160px] h-9 text-sm">
              <SelectValue placeholder="ระดับการดูแล" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกระดับ</SelectItem>
              <SelectItem value="unassessed">ยังไม่ประเมิน</SelectItem>
              <SelectItem value="high">เร่งด่วน</SelectItem>
              <SelectItem value="attention">ต้องการความใส่ใจ</SelectItem>
              <SelectItem value="low">ดูแลน้อย</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-[160px] h-9 text-sm">
              <SelectValue placeholder="ระยะหลังคลอด" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกระยะ</SelectItem>
              {stages.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-border/60">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/50 border-b border-border/60">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">ชื่อ</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">HN</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">ระยะหลังคลอด</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">เช็คอินล่าสุด</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">ระดับการดูแล</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">แนวโน้ม 7 วัน</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">หมายเหตุ</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((m) => (
                <tr
                  key={m.id}
                  className="border-b border-border/40 hover:bg-secondary/30 transition-colors cursor-pointer"
                  onClick={() => navigate(`/mothers/${m.id}`)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={m.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <span className="font-medium text-foreground">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{m.hn}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.postpartumStage}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {formatDateTime(m.lastCheckIn)}
                  </td>
                  <td className="px-4 py-3">
                    <RiskBadge level={m.riskLevel} />
                  </td>
                  <td className="px-4 py-3">
                    <TrendIndicator trend={m.trend} />
                  </td>
                  <td className="px-4 py-3">
                    {m.needsAttentionReason && (
                      <div className="flex items-center gap-1.5 text-xs text-amber-600">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate max-w-[140px]">{m.needsAttentionReason}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-primary hover:text-primary/80 gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/mothers/${m.id}`);
                      }}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      ดูข้อมูล
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
