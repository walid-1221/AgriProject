import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  BellRing,
  Calendar,
  Check,
  CheckCheck,
  Clock,
  RefreshCw,
  Sprout,
  Volume2,
  VolumeX,
  X
} from 'lucide-react';
import { CropBatch, LanguageMode, LocalNotification } from '../types';
import {
  BrowserNotificationPermission,
  getDaysUntilHarvest,
  HARVEST_ALERT_LEAD_DAYS
} from '../utils/harvestNotifications';

interface HarvestNotificationCenterProps {
  farmerId: number;
  lang: LanguageMode;
  notifications: LocalNotification[];
  cropBatches: CropBatch[];
  browserPermission: BrowserNotificationPermission;
  browserAlertsEnabled: boolean;
  onEnableBrowserAlerts: () => void;
  onToggleBrowserAlerts: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDismiss: (id: string) => void;
  onRestoreDismissed: () => void;
  onRunManualCheck: () => void;
}

export const HarvestNotificationCenter: React.FC<HarvestNotificationCenterProps> = ({
  farmerId,
  lang,
  notifications,
  cropBatches,
  browserPermission,
  browserAlertsEnabled,
  onEnableBrowserAlerts,
  onToggleBrowserAlerts,
  onMarkRead,
  onMarkAllRead,
  onDismiss,
  onRestoreDismissed,
  onRunManualCheck
}) => {
  const [showDismissed, setShowDismissed] = useState(false);
  const isBn = lang === 'BN';

  const farmerNotifications = notifications.filter((n) => n.farmer_id === farmerId);
  const activeAlerts = farmerNotifications.filter((n) => !n.dismissed);
  const dismissedAlerts = farmerNotifications.filter((n) => n.dismissed);
  const unreadCount = activeAlerts.filter((n) => !n.read).length;

  // Upcoming AVAILABLE batches beyond the 3-day alert threshold
  const upcomingBatches = cropBatches
    .filter((b) => b.farmer_id === farmerId && b.status === 'AVAILABLE')
    .map((b) => ({
      batch: b,
      daysUntil: getDaysUntilHarvest(b.estimated_harvest_date)
    }))
    .filter((item): item is { batch: CropBatch; daysUntil: number } =>
      item.daysUntil !== null && item.daysUntil > HARVEST_ALERT_LEAD_DAYS
    )
    .sort((a, b) => a.daysUntil - b.daysUntil);

  const getCountdownBadge = (daysRemaining: number) => {
    if (daysRemaining === 0) {
      return {
        label: isBn ? 'আজই ফসল তোলা' : 'Harvest Today',
        classes: 'bg-red-100 text-red-700 border-red-200'
      };
    }
    if (daysRemaining === 1) {
      return {
        label: isBn ? '১ দিন বাকি' : '1 Day Left',
        classes: 'bg-orange-100 text-orange-800 border-orange-200'
      };
    }
    return {
      label: isBn ? `${daysRemaining} দিন বাকি` : `${daysRemaining} Days Left`,
      classes: 'bg-amber-100 text-amber-800 border-amber-300'
    };
  };

  return (
    <section
      id="harvest-notifications-panel"
      className="bg-white rounded-3xl border-2 border-[#1A2A1A]/5 p-6 md:p-7 shadow-sm space-y-5 text-[#1A2A1A]"
    >
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex items-start gap-3">
          <div
            className={`p-3 rounded-2xl border shrink-0 ${
              activeAlerts.length > 0
                ? 'bg-amber-50 border-amber-200 text-amber-600'
                : 'bg-[#2D4F1E]/10 border-[#2D4F1E]/15 text-[#2D4F1E]'
            }`}
          >
            {unreadCount > 0 ? (
              <BellRing className="w-5 h-5 animate-bounce" />
            ) : (
              <Bell className="w-5 h-5" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base md:text-lg font-extrabold text-[#1A2A1A]">
                {isBn
                  ? 'ফসল তোলার ৩ দিন পূর্বের লোকাল সতর্কতা'
                  : '3-Day Pre-Harvest Local Notification Center'}
              </h3>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#F97316] text-white">
                  {unreadCount} {isBn ? 'টি নতুন' : 'Unread'}
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide">
                AVAILABLE {isBn ? 'ব্যাচ মনিটর' : 'Batches Only'}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              {isBn
                ? 'AVAILABLE স্ট্যাটাসযুক্ত প্রতিটি ফসল ব্যাচের আনুমানিক কাটার তারিখের ৩ দিন আগে স্বয়ংক্রিয় লোকাল সতর্কতা পাঠানো হয়।'
                : 'Automatically alerts you locally 3 days before the estimated harvest date for any crop batch with AVAILABLE status.'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {browserPermission === 'granted' ? (
            <button
              type="button"
              id="toggle-browser-notifications-btn"
              onClick={onToggleBrowserAlerts}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                browserAlertsEnabled
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {browserAlertsEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-gray-500" />
              )}
              <span>
                {browserAlertsEnabled
                  ? isBn
                    ? 'ব্রাউজার অ্যালার্ট চালু'
                    : 'Browser Alerts On'
                  : isBn
                  ? 'ব্রাউজার অ্যালার্ট বন্ধ'
                  : 'Browser Alerts Paused'}
              </span>
            </button>
          ) : browserPermission === 'default' ? (
            <button
              type="button"
              id="enable-browser-notifications-btn"
              onClick={onEnableBrowserAlerts}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#2D4F1E]/10 hover:bg-[#2D4F1E]/20 text-[#2D4F1E] border border-[#2D4F1E]/20 transition-all cursor-pointer"
            >
              <BellRing className="w-3.5 h-3.5" />
              <span>{isBn ? 'ব্রাউজার নোটিফিকেশন চালু করুন' : 'Enable Browser Alerts'}</span>
            </button>
          ) : browserPermission === 'denied' ? (
            <span className="px-3 py-2 rounded-xl text-[11px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">
              {isBn ? 'ব্রাউজার অ্যালার্ট ব্লক করা' : 'Browser Alerts Blocked (In-App Active)'}
            </span>
          ) : null}

          <button
            type="button"
            id="check-harvest-alerts-btn"
            onClick={onRunManualCheck}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#F4F1EA] hover:bg-[#e9e3d7] text-[#1A2A1A] border border-[#1A2A1A]/10 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#2D4F1E]" />
            <span>{isBn ? 'এখনই চেক করুন' : 'Check Batches'}</span>
          </button>

          {unreadCount > 0 && (
            <button
              type="button"
              id="mark-all-harvest-read-btn"
              onClick={onMarkAllRead}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#2D4F1E] hover:bg-[#2D4F1E]/90 text-white transition-all cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>{isBn ? 'সব পঠিত' : 'Mark All Read'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Alerts List */}
      <AnimatePresence mode="popLayout">
        {activeAlerts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeAlerts.map((alert) => {
              const badge = getCountdownBadge(alert.days_remaining);
              return (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className={`rounded-2xl border-2 p-4 space-y-3 transition-all ${
                    alert.read
                      ? 'bg-[#F4F1EA]/35 border-[#1A2A1A]/10'
                      : 'bg-amber-50/75 border-amber-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${badge.classes}`}
                      >
                        <Clock className="w-3 h-3" />
                        {badge.label}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white text-gray-600 border border-gray-200">
                        #{alert.batch_id}
                      </span>
                      {!alert.read && (
                        <span className="w-2 h-2 rounded-full bg-[#F97316]" title="Unread" />
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {!alert.read && (
                        <button
                          type="button"
                          onClick={() => onMarkRead(alert.id)}
                          title={isBn ? 'পঠিত হিসেবে চিহ্নিত করুন' : 'Mark as read'}
                          className="p-1.5 rounded-lg bg-white hover:bg-emerald-50 text-emerald-700 border border-gray-200 transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onDismiss(alert.id)}
                        title={isBn ? 'বাতিল করুন' : 'Dismiss alert'}
                        className="p-1.5 rounded-lg bg-white hover:bg-red-50 text-gray-500 hover:text-red-600 border border-gray-200 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-extrabold text-[#1A2A1A] flex items-center gap-1.5">
                      <Sprout className="w-4 h-4 text-[#2D4F1E] shrink-0" />
                      <span>{alert.title}</span>
                    </h4>
                    <p className="text-xs text-gray-700 leading-relaxed font-medium">
                      {alert.message}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-black/5 text-[11px] font-semibold text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#F97316]" />
                      {isBn ? 'ফসল কাটার তারিখ:' : 'Est. Harvest:'}{' '}
                      <strong className="text-[#1A2A1A] font-mono">
                        {alert.estimated_harvest_date}
                      </strong>
                    </span>
                    <span className="text-emerald-700 font-bold">
                      {alert.quantity_kg.toLocaleString()} kg • AVAILABLE
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#F4F1EA]/40 border border-[#1A2A1A]/10 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-[#2D4F1E]">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-[#1A2A1A]">
                  {isBn
                    ? 'আগামী ৩ দিনের মধ্যে কোনো AVAILABLE ফসল কাটার সতর্কতা নেই'
                    : 'No AVAILABLE crop batches due for harvest within the next 3 days'}
                </p>
                <p className="text-gray-500 font-medium mt-0.5">
                  {isBn
                    ? 'নতুন ফসল তালিকাভুক্ত করার সময় কাটার তারিখ ৩ দিন বা তার কম দিলে এখানে স্বয়ংক্রিয় সতর্কতা দেখা যাবে।'
                    : 'Post or schedule an AVAILABLE batch within 3 days of harvest to trigger an instant local alert.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Upcoming Batches Monitor & Dismissed Toggle */}
      {(upcomingBatches.length > 0 || dismissedAlerts.length > 0) && (
        <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px]">
          {upcomingBatches.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2 text-gray-600">
              <span className="font-bold text-[#2D4F1E] uppercase tracking-wide">
                {isBn ? 'পরবর্তী শিডিউল:' : 'Scheduled Watchlist:'}
              </span>
              {upcomingBatches.slice(0, 3).map(({ batch, daysUntil }) => (
                <span
                  key={batch.batch_id}
                  className="px-2.5 py-1 rounded-full bg-[#F4F1EA] border border-[#1A2A1A]/10 font-medium text-[#1A2A1A]"
                >
                  {batch.crop_name} •{' '}
                  <strong className="font-mono">{batch.estimated_harvest_date}</strong> (
                  {isBn
                    ? `${daysUntil - HARVEST_ALERT_LEAD_DAYS} দিন পর অ্যালার্ট`
                    : `alert in ${daysUntil - HARVEST_ALERT_LEAD_DAYS}d`}
                  )
                </span>
              ))}
            </div>
          ) : (
            <span />
          )}

          {dismissedAlerts.length > 0 && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowDismissed((prev) => !prev)}
                className="text-gray-500 hover:text-[#1A2A1A] font-bold underline cursor-pointer"
              >
                {showDismissed
                  ? isBn
                    ? 'বাতিল সতর্কতা লুকান'
                    : 'Hide Dismissed'
                  : isBn
                  ? `বাতিল সতর্কতা দেখুন (${dismissedAlerts.length})`
                  : `Dismissed (${dismissedAlerts.length})`}
              </button>
              {showDismissed && (
                <button
                  type="button"
                  onClick={onRestoreDismissed}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold cursor-pointer"
                >
                  {isBn ? 'পুনরুদ্ধার' : 'Restore All'}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {showDismissed && dismissedAlerts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {dismissedAlerts.map((alert) => (
            <div
              key={alert.id}
              className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-3 flex items-center justify-between gap-2 text-xs text-gray-600"
            >
              <div>
                <p className="font-bold text-gray-800">
                  {alert.crop_name} (#{alert.batch_id})
                </p>
                <p className="text-[11px]">
                  {alert.estimated_harvest_date} • {alert.days_remaining}d left
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase text-gray-400">
                {isBn ? 'বাতিল' : 'Dismissed'}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
