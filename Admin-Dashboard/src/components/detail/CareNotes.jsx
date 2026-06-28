import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, User } from 'lucide-react';
import { useCaseNotes } from '@/hooks/useFirestoreData';
import { addCaseNote } from '@/lib/firestore';
import { formatDateTime } from '@/lib/dateUtils';

const roleColors = {
  nurse: 'bg-blue-50 text-blue-600 border-blue-200',
  doctor: 'bg-violet-50 text-violet-600 border-violet-200',
  psychologist: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  Nurse: 'bg-blue-50 text-blue-600 border-blue-200',
  Doctor: 'bg-violet-50 text-violet-600 border-violet-200',
  Psychologist: 'bg-emerald-50 text-emerald-600 border-emerald-200',
};

export default function CareNotes({ motherId }) {
  const { notes, loading } = useCaseNotes(motherId);
  const [showAdd, setShowAdd] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setSaving(true);
    try {
      await addCaseNote(motherId, 'Staff', newNote);
      setNewNote('');
      setShowAdd(false);
    } catch (error) {
      console.error('Failed to add note:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-border/60">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center p-4">
            <div className="w-4 h-4 border-2 border-slate-200 border-t-rose-500 rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card id="care-notes" className="border-border/60 scroll-mt-24">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">บันทึกทีมดูแล</h3>
            <p className="text-xs text-muted-foreground">Care Team Notes</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1"
            onClick={() => setShowAdd(!showAdd)}
            disabled={saving}
          >
            <Plus className="w-3.5 h-3.5" />
            เพิ่มบันทึก
          </Button>
        </div>

        {showAdd && (
          <div className="mb-4 space-y-2">
            <Textarea
              placeholder="เพิ่มบันทึกสำหรับคุณแม่..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="text-sm"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)} className="text-xs" disabled={saving}>ยกเลิก</Button>
              <Button size="sm" className="text-xs" onClick={handleAddNote} disabled={saving || !newNote.trim()}>
                {saving ? 'กำลังบันทึก...' : 'บันทึก'}
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="bg-secondary/30 rounded-lg p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-3 h-3 text-primary" />
                </div>
                <span className="text-xs font-medium text-foreground">{note.staffName}</span>
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${roleColors[note.action] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                  {note.action === 'note' ? 'บันทึก' : note.action}
                </Badge>
                <span className="text-[10px] text-muted-foreground ml-auto">
                  {formatDateTime(note.createdAt)}
                </span>
              </div>
              <p className="text-sm text-foreground">{note.note}</p>
            </div>
          ))}
          {notes.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">ยังไม่มีบันทึก</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
