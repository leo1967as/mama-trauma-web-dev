import { toDate } from './dateUtils.js';

const priority = {
  epds_q10: 0,
  urgent_safety: 0,
  need_help: 1,
  high_risk_tag: 2,
  high_risk: 2,
  low_composite_trend: 2,
  safety_access: 3,
  follow_up: 3,
};

const read = (data, camel, snake) => data?.[camel] ?? data?.[snake];
const caseStatus = (mother) => read(mother, 'caseStatus', 'case_status');
const caseSource = (mother) => read(mother, 'caseSource', 'case_source');

export function deriveAlerts(mothers) {
  const alerts = [];

  mothers.forEach((mother) => {
    if (caseStatus(mother) === 'resolved') return;

    const alertReason = read(mother, 'alertReason', 'alert_reason');
    const supportLevel = read(mother, 'supportLevel', 'support_level');
    const alertOpenedAt = read(mother, 'alertOpenedAt', 'alert_opened_at');
    const lastCheckIn = read(mother, 'lastCheckIn', 'last_check_in');
    const lastSafetyAccess = read(mother, 'lastSafetyAccess', 'last_safety_access');
    const updatedAt = read(mother, 'updatedAt', 'updated_at');
    const createdAt = read(mother, 'createdAt', 'created_at');
    const epdsDate = read(mother, 'epdsDate', 'epds_date');
    const problemTagClasses = read(mother, 'problemTagClasses', 'problem_tag_classes') ?? [];
    const hasHighRiskTag = Array.isArray(problemTagClasses) && problemTagClasses.includes('high');

    let alert = null;
    if (read(mother, 'q10Flag', 'q10_flag') === true) {
      alert = {
        type: 'epds_q10',
        label: 'EPDS ข้อ 10',
        description: `${mother.name} มีคำตอบข้อ 10 ที่ต้องตรวจสอบ`,
        occurredAt: alertOpenedAt || epdsDate || updatedAt,
      };
    } else if (['urgent_safety_access', 'urgent_safety'].includes(alertReason) || read(mother, 'urgentSafety', 'urgent_safety') === true) {
      alert = {
        type: 'urgent_safety',
        label: 'Help Flow เร่งด่วน',
        description: `${mother.name} เปิดช่องทางช่วยเหลือเร่งด่วน`,
        occurredAt: lastSafetyAccess || alertOpenedAt || updatedAt,
      };
    } else if (read(mother, 'supportRequest', 'support_request') === true) {
      alert = {
        type: 'need_help',
        label: 'ขอความช่วยเหลือ',
        description: `${mother.name} ขอให้ทีมดูแลติดต่อกลับ`,
        occurredAt: lastSafetyAccess || alertOpenedAt || updatedAt,
      };
    } else if (alertReason === 'high_risk_tag' || hasHighRiskTag) {
      alert = {
        type: 'high_risk_tag',
        label: 'แท็กที่ต้องติดตาม',
        description: `${mother.name} เลือกหัวข้อความรู้สึกที่ต้องให้ทีมดูแลตรวจสอบ`,
        occurredAt: alertOpenedAt || lastCheckIn || updatedAt,
      };
    } else if (supportLevel === 'immediate') {
      alert = {
        type: 'high_risk',
        label: 'ต้องตรวจสอบ',
        description: `${mother.name} มี Support Level ที่ต้องติดตาม`,
        occurredAt: alertOpenedAt || lastCheckIn || epdsDate || updatedAt,
      };
    } else if (read(mother, 'lowCompositeTrend', 'low_composite_trend') === true) {
      alert = {
        type: 'low_composite_trend',
        label: 'คะแนนรวมต่ำต่อเนื่อง',
        description: `${mother.name} มีคะแนนรวมเช็คอินต่ำกว่าเกณฑ์ติดต่อกัน 3 วัน`,
        occurredAt: lastCheckIn || updatedAt,
      };
    } else if (read(mother, 'safetyAccessUsed', 'safety_access_used') === true) {
      alert = {
        type: 'safety_access',
        label: 'เปิดเมนูช่วยเหลือ',
        description: `${mother.name} เปิดดูช่องทางช่วยเหลือ`,
        occurredAt: lastSafetyAccess || updatedAt,
      };
    } else if (caseStatus(mother) === 'new' && caseSource(mother) === 'manual') {
      alert = {
        type: 'follow_up',
        label: 'ทีมดูแลเปิดเคสเอง',
        description: `${mother.name} ถูกเปิดเคสโดยทีมดูแลก่อนมี clinical event`,
        occurredAt: read(mother, 'caseStatusUpdatedAt', 'case_status_updated_at') || updatedAt || createdAt,
      };
    } else if (caseStatus(mother) === 'new') {
      alert = {
        type: 'follow_up',
        label: 'เคสใหม่',
        description: `${mother.name} รอการตรวจสอบ`,
        occurredAt: alertOpenedAt || updatedAt || createdAt,
      };
    }

    if (alert) {
      alerts.push({
        ...alert,
        id: `${mother.id}-${alert.type}`,
        motherId: mother.id,
        motherName: mother.name,
        postpartumStage: mother.postpartumStage,
        caseStatus: caseStatus(mother) || 'none',
        caseSource: caseSource(mother) || 'none',
      });
    }
  });

  return alerts.sort((a, b) => {
    const priorityDiff = (priority[a.type] ?? 9) - (priority[b.type] ?? 9);
    if (priorityDiff !== 0) return priorityDiff;
    return (toDate(b.occurredAt)?.getTime() || 0) - (toDate(a.occurredAt)?.getTime() || 0);
  });
}
