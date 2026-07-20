import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Eye, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMothers } from '@/hooks/useFirestoreData';
import SupportBadge from '@/components/shared/SupportBadge';
import TrendIndicator from '@/components/shared/TrendIndicator';
import { formatDate, formatDateTime } from '@/lib/dateUtils';

export default function MotherList() {
  const navigate = useNavigate();
  const { mothers, loading } = useMothers();
  const [search, setSearch] = useState('');
  const [supportFilter, setSupportFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');

  const filtered = mothers.filter((m) => {
    const term = search.trim().toLowerCase();
    const matchSearch = !term || [m.name, m.hn, m.phone].some((value) => String(value || '').toLowerCase().includes(term));
    const matchSupport = supportFilter === 'all' || m.supportLevel === supportFilter;
    const matchStage = stageFilter === 'all' || m.postpartumStage === stageFilter;
    return matchSearch && matchSupport && matchStage;
  });

  const sorted = [...filtered].sort((a, b) => {
    const priority = (mother) => mother.q10Flag ? 0 : mother.supportLevel === 'immediate' ? 1 : mother.supportLevel === 'extra' ? 2 : mother.supportLevel === 'gentle' ? 3 : 4;
    return priority(a) - priority(b);
  });

  const stages = [...new Set(mothers.map((m) => m.postpartumStage))];

  const exportCsv = () => {
    const rows = [
      ['Name', 'HN', 'Phone', 'Postpartum stage', 'Support level'],
      ...sorted.map((mother) => [mother.name, mother.hn, mother.phone, mother.postpartumStage, mother.supportLevel]),
    ];
    const csv = rows.map((row) => row.map((value) => `"${String(value || '').replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `afterbloom-mothers-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-slate-200 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">รายชื่อคุณแม่</h1>
          <p className="text-sm text-muted-foreground mt-1">รายชื่อคุณแม่ — ข้อมูลสรุปแบบอ่านอย่างเดียว</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={exportCsv}>
          <Download className="w-3.5 h-3.5" />
          ส่งออก
        </Button>
      </div>

      <Card className="border-border/60">
        <CardContent className="pt-6">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาชื่อ / HN / เบอร์โทร..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
            <Select value={supportFilter} onValueChange={setSupportFilter}>
              <SelectTrigger className="w-[160px] h-9 text-sm">
                <SelectValue placeholder="ระดับการดูแล" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกระดับ</SelectItem>
                <SelectItem value="unassessed">ยังไม่ประเมิน</SelectItem>
                <SelectItem value="immediate">เร่งด่วน</SelectItem>
                <SelectItem value="extra">ต้องการความใส่ใจเพิ่ม</SelectItem>
                <SelectItem value="gentle">ดูแลเบาๆ</SelectItem>
                <SelectItem value="steady">มั่นคงดี</SelectItem>
                <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
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
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">เบอร์โทร</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">ระยะ</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">วันคลอด</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">เช็คอินล่าสุด</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">ระดับ</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">แนวโน้ม</th>
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
                        <span className="font-medium text-foreground whitespace-nowrap">{m.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{m.hn}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{m.display?.phone || m.phone}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{m.display?.postpartumStage || m.postpartumStage}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                        {m.display?.deliveryDate || formatDate(m.deliveryDate, 'ยังไม่เก็บจากคุณแม่')}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {formatDateTime(m.lastCheckIn)}
                    </td>
                    <td className="px-4 py-3">
                      <SupportBadge level={m.supportLevel} />
                    </td>
                    <td className="px-4 py-3">
                      <TrendIndicator trend={m.trend} />
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

          <p className="text-xs text-muted-foreground mt-3">แสดง {sorted.length} จาก {mothers.length} รายการ</p>
        </CardContent>
      </Card>
    </div>
  );
}
