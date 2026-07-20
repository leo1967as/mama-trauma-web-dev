import { useState, useEffect } from 'react';
import {
  getMothers,
  getMother,
  getCheckins,
  getEpdsScores,
  getSafetyEvents,
  getDashboardStats,
  subscribeMothers,
  subscribeCaseNotes,
  resolveSupportLevel,
} from '@/lib/firestore';
import { daysSince } from '@/lib/dateUtils';

const read = (data, camel, snake) => data?.[camel] ?? data?.[snake];

function displayName(name) {
  const trimmed = String(name || '').trim();
  if (!trimmed || trimmed.toLowerCase() === 'unknown') return 'คุณแม่ยังไม่ระบุชื่อ';
  return trimmed;
}

function composeLegalName(data) {
  const first = String(read(data, 'legalFirstName', 'legal_first_name') || '').trim();
  const last = String(read(data, 'legalLastName', 'legal_last_name') || '').trim();
  const joined = [first, last].filter(Boolean).join(' ').trim();
  return joined || '';
}

function displayPreferredName(data) {
  return String(read(data, 'preferredName', 'preferred_name') || read(data, 'name', 'mother_name') || '').trim();
}

function displayHn(id, hn) {
  const trimmed = String(hn || '').trim();
  if (trimmed && trimmed.toLowerCase() !== 'unknown') return trimmed;
  return `AB-${String(id || '').slice(0, 6).toUpperCase() || 'PROTO'}`;
}

function avatarPlaceholder(name) {
  const initial = displayName(name).trim().charAt(0) || 'A';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="24" fill="#F6E2E1"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" font-weight="700" fill="#9A4C53">${initial}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function derivePostpartumDay(data) {
  const birthDate = data?.deliveryDate || data?.delivery_date || data?.baby_birth_date;
  const derived = daysSince(birthDate);
  if (derived !== null) return Math.max(1, derived + 1);
  const postpartumDay = read(data, 'postpartumDay', 'postpartum_day');
  if (Number.isFinite(Number(postpartumDay))) {
    return Math.max(1, Number(postpartumDay));
  }
  return null;
}

function derivePostpartumStage(day) {
  if (day === null || day === undefined) return 'ยังไม่คำนวณระยะ';
  if (day <= 3) return 'ช่วงวันแรก';
  if (day <= 7) return 'ช่วงปรับตัวแรก';
  if (day <= 21) return 'จุดเช็คสัปดาห์ที่ 2';
  if (day <= 42) return '6 สัปดาห์แรก';
  if (day <= 90) return 'ช่วงเข้าที่';
  if (day <= 150) return 'ช่วงเดือน 4–5';
  if (day <= 180) return 'ช่วงเดือน 6';
  if (day <= 270) return 'ช่วงเช็คอารมณ์ช่วงปลาย';
  return 'ทบทวนปีแรก';
}

function hasClinicalEvents(checkins = [], epdsScores = [], safetyEvents = []) {
  return checkins.length > 0 || epdsScores.length > 0 || safetyEvents.length > 0;
}

function deriveAssessmentState(data, checkins = [], epdsScores = [], safetyEvents = []) {
  if (read(data, 'assessmentState', 'assessment_state') === 'assessed') return 'assessed';
  return hasClinicalEvents(checkins, epdsScores, safetyEvents) ? 'assessed' : 'unassessed';
}

function profileFieldState(value, emptyLabel) {
  const trimmed = String(value || '').trim();
  return trimmed ? trimmed : emptyLabel;
}

function normalizeMother(data, checkins = [], epdsScores = [], safetyEvents = []) {
  const postpartumDay = derivePostpartumDay(data);
  const legalName = composeLegalName(data);
  const preferredName = displayPreferredName(data);
  const name = displayName(legalName || preferredName);
  const latestCheckIn = checkins[0] || null;
  const assessed = deriveAssessmentState(data, checkins, epdsScores, safetyEvents);
  const supportLevel = assessed === 'unassessed' ? 'unassessed' : resolveSupportLevel(data);
  const {
    supportRequest, support_request,
    caseStatus, case_status, caseSource, case_source,
    hospitalContactInitiated, hospital_contact_initiated,
    assignedStaff, assigned_staff, nextFollowUp, next_follow_up,
    needsAttentionReason, alertReason, alert_reason, alertOpenedAt, alert_opened_at,
    ...viewData
  } = data || {};
  return {
    ...viewData,
    name,
    legalName,
    preferredName,
    hn: displayHn(data?.id, data?.hn),
    avatar: data?.avatar || avatarPlaceholder(name),
    phone: data?.phone || data?.phoneNumber || data?.contactPhone || '',
    supportPerson: data?.supportPerson || data?.primaryCaregiver || data?.caregiverName || '',
    location: data?.location || data?.address || '',
    deliveryType: data?.deliveryType || data?.birthType || '',
    deliveryDate: data?.deliveryDate || data?.delivery_date || data?.baby_birth_date || null,
    postpartumDay,
    postpartumStage: derivePostpartumStage(postpartumDay),
    rawPostpartumStage: read(data, 'postpartumStage', 'postpartum_stage') || '',
    status: data?.status || 'active',
    assessmentState: assessed,
    supportLevel,
    lastSafetyAccess: read(data, 'lastSafetyAccess', 'last_safety_access') || null,
    q10Flag: read(data, 'q10Flag', 'q10_flag') === true,
    urgentSafety: read(data, 'urgentSafety', 'urgent_safety') === true,
    safetyAccessUsed: read(data, 'safetyAccessUsed', 'safety_access_used') === true,
    lowCompositeTrend: read(data, 'lowCompositeTrend', 'low_composite_trend') === true,
    lastCheckIn: read(data, 'lastCheckIn', 'last_check_in') || null,
    updatedAt: read(data, 'updatedAt', 'updated_at') || null,
    epdsDate: read(data, 'epdsDate', 'epds_date') || null,
    latestCheckIn,
    checkins,
    epdsScores,
    safetyEvents,
    display: {
      phone: profileFieldState(data?.phone || data?.phoneNumber || data?.contactPhone, 'ยังไม่เก็บจากคุณแม่'),
      supportPerson: profileFieldState(data?.supportPerson || data?.primaryCaregiver || data?.caregiverName, 'รอทีมดูแลกรอก'),
      location: profileFieldState(data?.location || data?.address, 'รอทีมดูแลกรอก'),
      deliveryType: profileFieldState(data?.deliveryType || data?.birthType, 'รอทีมดูแลกรอก'),
      deliveryDate: data?.deliveryDate || data?.delivery_date || data?.baby_birth_date ? null : 'ยังไม่เก็บจากคุณแม่',
      age: data?.age ? `${data.age} ปี` : 'รอทีมดูแลกรอก',
      postpartumDay: postpartumDay === null ? 'ยังไม่เก็บวันคลอด' : `Day ${postpartumDay}`,
      postpartumStage: postpartumDay === null ? 'ยังไม่คำนวณระยะ' : derivePostpartumStage(postpartumDay),
    },
  };
}

export function useMothers(filters = {}) {
  const [mothers, setMothers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeMothers((data) => {
      // Apply client-side filters
      let filtered = data.map((mother) => normalizeMother(mother));
      if (filters.supportLevel) {
        filtered = filtered.filter((m) => m.supportLevel === filters.supportLevel);
      }
      if (filters.status) {
        filtered = filtered.filter((m) => m.status === filters.status);
      }
      setMothers(filtered);
      setLoading(false);
      setError(null);
    });
    return unsubscribe;
  }, [filters.supportLevel, filters.status]);

  return { mothers, loading, error };
}

export function useMother(id) {
  const [mother, setMother] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    Promise.all([
      getMother(id),
      getCheckins(id, 14),
      getEpdsScores(id),
      getSafetyEvents(id),
    ])
      .then(([data, checkins, epdsScores, safetyEvents]) => {
        if (!data) {
          setMother(null);
          setError(null);
          setLoading(false);
          return;
        }

        const normalizedCheckins = checkins.map((entry) => ({
          ...entry,
          composite: read(entry, 'composite', 'composite_score'),
          moodScore: read(entry, 'moodScore', 'mood_score'),
          sleepScore: read(entry, 'sleepScore', 'sleep_score'),
          energyScore: read(entry, 'energyScore', 'energy_score'),
          worryScore: read(entry, 'worryScore', 'worry_score'),
        }));
        const normalizedEpds = epdsScores.map((entry) => ({
          ...entry,
          q10Flag: read(entry, 'q10Flag', 'q10_flag') === true,
          totalScore: read(entry, 'totalScore', 'total_score'),
          screeningDate: read(entry, 'screeningDate', 'screening_date'),
          createdAt: read(entry, 'createdAt', 'created_at'),
          supportLevel: read(entry, 'supportLevel', 'support_level'),
        }));
        const latestEpds = normalizedEpds[0] || null;
        const previousEpds = normalizedEpds[1] || null;
        const supportToTrend = { steady: 1, gentle: 1.5, extra: 2, immediate: 3 };
        const recentComposites = normalizedCheckins.slice(0, 3).map((c) => c.composite);
        const lowCompositeTrend = recentComposites.length === 3
          && recentComposites.every((c) => typeof c === 'number' && c < 2.5);
        const derivedFlags = [
          ...(Array.isArray(data.flags) ? data.flags : []),
          ...(read(data, 'q10Flag', 'q10_flag') || read(latestEpds, 'q10Flag', 'q10_flag') ? ['epds_q10'] : []),
          ...(resolveSupportLevel(data) === 'immediate' ? ['high_epds'] : []),
        ];

        const normalized = normalizeMother({ ...data, id }, normalizedCheckins, normalizedEpds, safetyEvents);
        setMother({
          ...normalized,
          flags: [...new Set(derivedFlags)],
          epdsScore: latestEpds?.totalScore ?? read(data, 'epdsScore', 'epds_score') ?? null,
          prevEpdsScore: previousEpds?.totalScore ?? read(data, 'prevEpdsScore', 'prev_epds_score') ?? null,
          epdsDate: latestEpds?.screeningDate ?? latestEpds?.createdAt ?? read(data, 'epdsDate', 'epds_date') ?? null,
          q10Flag: read(latestEpds, 'q10Flag', 'q10_flag') ?? read(data, 'q10Flag', 'q10_flag') ?? false,
          lowCompositeTrend: read(data, 'lowCompositeTrend', 'low_composite_trend') ?? lowCompositeTrend,
          trend: normalizedCheckins
            .slice(0, 7)
            .reverse()
            .map((entry) => supportToTrend[resolveSupportLevel(entry)] ?? 1),
        });
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  return { mother, loading, error };
}

export function useCheckins(motherId, limit = 14) {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!motherId) {
      setLoading(false);
      return;
    }
    getCheckins(motherId, limit)
      .then((data) => {
        setCheckins(data);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [motherId, limit]);

  return { checkins, loading, error };
}

export function useEpdsScores(motherId) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!motherId) {
      setLoading(false);
      return;
    }
    getEpdsScores(motherId)
      .then((data) => {
        setScores(data);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [motherId]);

  return { scores, loading, error };
}

export function useCaseNotes(motherId) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!motherId) {
      setLoading(false);
      return;
    }
    const unsubscribe = subscribeCaseNotes(motherId, (data) => {
        setNotes(data);
        setError(null);
        setLoading(false);
      });
    return unsubscribe;
  }, [motherId]);

  return { notes, loading, error };
}

export function useDashboardStats() {
  const [stats, setStats] = useState({
    totalMothers: 0,
    checkedIn: 0,
    atRisk: 0,
    highRisk: 0,
    needHelp: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDashboardStats()
      .then((data) => {
        setStats(data);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { stats, loading, error };
}
