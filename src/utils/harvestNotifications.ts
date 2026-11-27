import { CropBatch, LanguageMode, LocalNotification } from '../types';

export const HARVEST_ALERT_LEAD_DAYS = 3;

/**
 * Formats a Date object as YYYY-MM-DD in the user's local timezone.
 */
export function formatLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Returns a YYYY-MM-DD local date string offset by `daysOffset` from today.
 */
export function getRelativeDate(daysOffset: number, baseDate: Date = new Date()): string {
  const target = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + daysOffset);
  return formatLocalDate(target);
}

/**
 * Parses a YYYY-MM-DD string into a Date at local midnight (00:00:00).
 * Returns null if the string is invalid.
 */
export function parseLocalDate(dateStr: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const parsed = new Date(year, month, day);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month ||
    parsed.getDate() !== day
  ) {
    return null;
  }
  return parsed;
}

/**
 * Calculates whole calendar days from referenceDate (default today) to estimatedHarvestDate.
 * Positive = days in the future, 0 = today, negative = past.
 */
export function getDaysUntilHarvest(estimatedHarvestDate: string, referenceDate: Date = new Date()): number | null {
  const harvestDate = parseLocalDate(estimatedHarvestDate);
  if (!harvestDate) return null;
  const todayMidnight = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate()
  );
  const diffMs = harvestDate.getTime() - todayMidnight.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function buildHarvestNotificationId(batchId: number, estimatedHarvestDate: string): string {
  return `harvest-3d-${batchId}-${estimatedHarvestDate}`;
}

export function formatAlertCopy(
  batch: CropBatch,
  daysRemaining: number,
  lang: LanguageMode
): { title: string; message: string } {
  if (lang === 'BN') {
    const countdownLabel =
      daysRemaining === 0
        ? 'আজই ফসল কাটার নির্ধারিত তারিখ!'
        : daysRemaining === 1
        ? 'ফসল কাটার আর মাত্র ১ দিন বাকি!'
        : `ফসল কাটার আর মাত্র ${daysRemaining} দিন বাকি!`;
    return {
      title: `ফসল তোলার সতর্কতা: ${batch.crop_name}`,
      message: `${countdownLabel} ব্যাচ #${batch.batch_id} (${batch.quantity_kg.toLocaleString()} কেজি, স্ট্যাটাস: AVAILABLE) আগামী ${batch.estimated_harvest_date} তারিখে কাটার জন্য প্রস্তুত। পরিবহন ও গ্রেডিং নিশ্চিত করুন।`
    };
  }

  const countdownLabel =
    daysRemaining === 0
      ? 'Estimated harvest is today!'
      : daysRemaining === 1
      ? 'Only 1 day until estimated harvest!'
      : `${daysRemaining} days until estimated harvest!`;

  return {
    title: `Harvest Alert: ${batch.crop_name}`,
    message: `${countdownLabel} Batch #${batch.batch_id} (${batch.quantity_kg.toLocaleString()} kg, AVAILABLE) is scheduled for ${batch.estimated_harvest_date}. Prepare harvesting, DAE grading, and logistics.`
  };
}

/**
 * Evaluates all crop batches and synchronizes local notifications for any
 * AVAILABLE crop batch within the 3-day pre-harvest window (0 <= daysRemaining <= 3).
 *
 * Returns the updated full notification list and any newly triggered notifications.
 */
export function syncHarvestNotifications(
  cropBatches: CropBatch[],
  existingNotifications: LocalNotification[],
  lang: LanguageMode,
  referenceDate: Date = new Date()
): { notifications: LocalNotification[]; newlyTriggered: LocalNotification[] } {
  const existingMap = new Map<string, LocalNotification>(
    existingNotifications.map((n) => [n.id, n])
  );

  const nextNotifications: LocalNotification[] = [];
  const newlyTriggered: LocalNotification[] = [];

  for (const batch of cropBatches) {
    if (batch.status !== 'AVAILABLE') continue;
    const daysRemaining = getDaysUntilHarvest(batch.estimated_harvest_date, referenceDate);
    if (daysRemaining === null || daysRemaining < 0 || daysRemaining > HARVEST_ALERT_LEAD_DAYS) {
      continue;
    }

    const id = buildHarvestNotificationId(batch.batch_id, batch.estimated_harvest_date);
    const existing = existingMap.get(id);
    const { title, message } = formatAlertCopy(batch, daysRemaining, lang);

    if (existing) {
      nextNotifications.push({
        ...existing,
        quantity_kg: batch.quantity_kg,
        upazila_district: batch.upazila_district,
        crop_name: batch.crop_name,
        days_remaining: daysRemaining,
        title,
        message
      });
    } else {
      const created: LocalNotification = {
        id,
        type: 'HARVEST_REMINDER',
        farmer_id: batch.farmer_id,
        batch_id: batch.batch_id,
        crop_name: batch.crop_name,
        quantity_kg: batch.quantity_kg,
        upazila_district: batch.upazila_district,
        estimated_harvest_date: batch.estimated_harvest_date,
        days_remaining: daysRemaining,
        title,
        message,
        created_at: new Date().toISOString(),
        read: false,
        dismissed: false
      };
      nextNotifications.push(created);
      newlyTriggered.push(created);
    }
  }

  // Sort earliest harvest first
  nextNotifications.sort((a, b) => a.days_remaining - b.days_remaining);

  return { notifications: nextNotifications, newlyTriggered };
}

export type BrowserNotificationPermission = 'granted' | 'denied' | 'default' | 'unsupported';

export function getBrowserNotificationPermission(): BrowserNotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

export async function requestBrowserNotificationPermission(): Promise<BrowserNotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch {
    return Notification.permission || 'denied';
  }
}

export function sendBrowserNotification(title: string, body: string, tag: string): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  if (Notification.permission !== 'granted') {
    return false;
  }
  try {
    new Notification(title, {
      body,
      tag
    });
    return true;
  } catch {
    return false;
  }
}
