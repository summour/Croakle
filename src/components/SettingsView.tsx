import React, { useState, useRef } from 'react';
import { PageType, AppSettings, HabitTemplate, MonthData, Project } from '../types';
import { exportFullBackup, importFullBackup } from '../utils/storage';
import { Download, Upload, Trash2, Moon, Sun, RefreshCw } from 'lucide-react';
import { WoodGearDockIcon, CloverIcon, BambooScrollDockIcon, FrogFaceDockIcon, ToriiStatsDockIcon } from './FrogIcons';
import { SubNavTabs } from './SubNavTabs';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  habits: HabitTemplate[];
  monthData: MonthData;
  projects: Project[];
  onDataImported: () => void;
  onResetData: () => void;
  onNavigate?: (page: PageType) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  habits,
  monthData,
  projects,
  onDataImported,
  onResetData,
  onNavigate,
}) => {
  const [copiedBackup, setCopiedBackup] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const json = exportFullBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `croakle-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const success = importFullBackup(text);
      if (success) {
        setImportStatus('Backup restored successfully!');
        onDataImported();
      } else {
        setImportStatus('Error: Invalid backup file format.');
      }
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const generateAIInsights = () => {
    // Generate helpful and thoughtful behavioral feedback
    const activeHabits = habits.length;
    const completedDays = monthData.habits.reduce(
      (acc, h) => acc + h.days.reduce((dAcc, d) => dAcc + (d ? 1 : 0), 0),
      0
    );
    const activeProj = projects.filter((p) => !p.completed).length;

    let advice = '';
    if (completedDays > 20) {
      advice = `Outstanding consistency! You've logged ${completedDays} habit completions this month. Your high priority habits are showing steady momentum. Keep setting protected time blocks for ${habits[0]?.name || 'your focus habits'}.`;
    } else if (completedDays > 5) {
      advice = `Great start! You've built a baseline with ${completedDays} checks. To increase momentum, try habit stacking: anchor '${habits[0]?.name || 'your core habit'}' directly to a daily fixed event like morning tea.`;
    } else {
      advice = `Every journey begins with a single checkmark. Pick just ONE high-priority habit today ('${habits[0]?.name || 'a simple habit'}') and aim for a 3-day micro streak.`;
    }

    setAiInsight(advice);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Top Segmented Sub-Navigation for Analytics/Settings */}
      {onNavigate && (
        <SubNavTabs
          activePage="settings"
          onNavigate={onNavigate}
          tabs={[
            { id: 'analysis', label: 'Analytics', icon: <ToriiStatsDockIcon size={15} /> },
            { id: 'settings', label: 'Settings', icon: <WoodGearDockIcon size={15} /> },
          ]}
        />
      )}

      {/* Header */}
      <div className="ios-glass-card p-5 flex items-center justify-between">
        <div>
          <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#8c7e70] dark:text-[#a89b8d]">Preferences & System</p>
          <h1 className="text-2xl font-black tracking-tight text-[#2d2823] dark:text-[#f4efe8]">Settings</h1>
        </div>
        <div className="w-10 h-10 rounded-[16px] bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center p-2 shadow-2xs">
          <WoodGearDockIcon size={22} className="text-[#8c7e70]" />
        </div>
      </div>

      {/* AI Habit Coach / Insights */}
      <div className="bg-[#1c1916]/90 dark:bg-black/70 text-[#fbf8f5] rounded-[32px] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.18)] border border-white/10 space-y-4 backdrop-blur-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CloverIcon size={20} className="text-[#8fc493]" />
            <h2 className="font-black text-base tracking-tight">Croakle Mindful Coach & Insights</h2>
          </div>
          <button
            type="button"
            onClick={generateAIInsights}
            className="px-4 py-2 rounded-full bg-white text-[#1c1916] hover:bg-white/90 font-black text-xs flex items-center gap-1.5 transition shadow-xs ios-tap"
          >
            <RefreshCw size={13} />
            Analyze
          </button>
        </div>

        {aiInsight ? (
          <p className="text-sm text-[#e0d6cb] leading-relaxed bg-white/10 p-4 rounded-[20px] border border-white/10 backdrop-blur-md">
            {aiInsight}
          </p>
        ) : (
          <p className="text-xs text-[#a89b8d]">
            Click "Analyze" to generate mindful behavioral summaries, habit stacking ideas, and project balance tips.
          </p>
        )}
      </div>

      {/* Appearance Theme */}
      <div className="ios-glass-card p-5 space-y-3">
        <h2 className="font-black text-sm text-[#2d2823] dark:text-[#f4efe8]">Appearance Theme</h2>
        <div className="grid grid-cols-3 gap-2">
          {(['light', 'dark', 'dim'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onUpdateSettings({ ...settings, theme: t })}
              className={`py-3 rounded-[20px] border text-xs font-black capitalize flex items-center justify-center gap-2 transition ios-tap ${
                settings.theme === t
                  ? 'border-[#5f7a61] bg-[#5f7a61] text-white shadow-[0_4px_16px_rgba(95,122,97,0.3)]'
                  : 'border-black/[0.06] dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.04] text-[#4a4036] dark:text-[#d4c8bc]'
              }`}
            >
              {t === 'light' ? <Sun size={15} /> : <Moon size={15} />}
              {t === 'light' ? 'Warm Light' : t === 'dark' ? 'Night Dark' : 'Soft Dim'}
            </button>
          ))}
        </div>
      </div>

      {/* Backup & Restore Card */}
      <div className="ios-glass-card p-5 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[14px] bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center shadow-2xs">
            <BambooScrollDockIcon size={18} className="text-[#849b5c]" />
          </div>
          <div>
            <h2 className="font-black text-sm text-[#2d2823] dark:text-[#f4efe8]">Backup & Restore</h2>
            <p className="text-xs text-[#8c7e70] dark:text-[#a89b8d]">
              Export and import all habits, mood logs, notes, and time sessions as a JSON file.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="py-3 px-4 rounded-[20px] bg-white/80 dark:bg-white/[0.08] hover:bg-white dark:hover:bg-white/[0.14] text-[#4a4036] dark:text-[#e0d6cb] font-black text-xs flex items-center justify-center gap-2 transition border border-black/[0.06] dark:border-white/[0.1] shadow-2xs ios-tap"
          >
            <Download size={15} /> Export JSON
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="py-3 px-4 rounded-[20px] bg-white/80 dark:bg-white/[0.08] hover:bg-white dark:hover:bg-white/[0.14] text-[#4a4036] dark:text-[#e0d6cb] font-black text-xs flex items-center justify-center gap-2 transition border border-black/[0.06] dark:border-white/[0.1] shadow-2xs ios-tap"
          >
            <Upload size={15} /> Import JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {importStatus && (
          <p className="text-xs font-bold text-[#5f7a61] dark:text-[#8fc493] p-2.5 rounded-[16px] bg-[#5f7a61]/10 dark:bg-[#5f7a61]/20 border border-[#5f7a61]/30 text-center">
            {importStatus}
          </p>
        )}
      </div>

      {/* Reset Data */}
      <div className="ios-glass-card p-5 space-y-3">
        <h2 className="font-black text-sm text-[#b86f52]">Reset Data</h2>
        <p className="text-xs text-[#8c7e70] dark:text-[#a89b8d]">
          Restore all habit and journal data to default demo presets.
        </p>
        {resetConfirm ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onResetData();
                setResetConfirm(false);
              }}
              className="flex-1 py-2.5 rounded-[18px] bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xs transition ios-tap"
            >
              <Trash2 size={15} /> Yes, Reset Everything
            </button>
            <button
              type="button"
              onClick={() => setResetConfirm(false)}
              className="py-2.5 px-4 rounded-[18px] bg-black/[0.05] dark:bg-white/[0.08] text-[#4a4036] dark:text-[#e0d6cb] font-bold text-xs ios-tap"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setResetConfirm(true)}
            className="w-full py-2.5 rounded-[18px] bg-[#b86f52]/10 hover:bg-[#b86f52]/20 text-[#b86f52] font-black text-xs flex items-center justify-center gap-2 transition border border-[#b86f52]/20 ios-tap"
          >
            <Trash2 size={15} /> Reset to Defaults
          </button>
        )}
      </div>
    </div>
  );
};
