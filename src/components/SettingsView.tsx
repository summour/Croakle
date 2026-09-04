import React, { useState, useRef } from 'react';
import {
  PageType,
  AppSettings,
  HabitTemplate,
  MonthData,
  Project,
  PixelSceneConfig,
} from '../types';
import { exportFullBackup, importFullBackup } from '../utils/storage';
import { Download, Upload, Trash2, Moon, Sun, RefreshCw, Volume2, VolumeX, Sparkles, BarChart3, Settings } from 'lucide-react';
import { SubNavTabs } from './SubNavTabs';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  habits: HabitTemplate[];
  monthData: MonthData;
  projects: Project[];
  pixelScene?: PixelSceneConfig;
  onUpdatePixelScene?: (patch: Partial<PixelSceneConfig>) => void;
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
  pixelScene,
  onUpdatePixelScene,
  onDataImported,
  onResetData,
  onNavigate,
}) => {
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
        setImportStatus('Error: Invalid backup file.');
      }
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const generateAIInsights = () => {
    const completedDays = monthData.habits.reduce(
      (acc, h) => acc + h.days.reduce((dAcc, d) => dAcc + (d ? 1 : 0), 0),
      0
    );

    let advice = '';
    if (completedDays > 20) {
      advice = `Outstanding consistency! You have logged ${completedDays} habit check-ins this month. Keep your daily momentum steady.`;
    } else if (completedDays > 5) {
      advice = `Great start with ${completedDays} completions. Try habit stacking by pairing your priority habit with your morning routine.`;
    } else {
      advice = `Pick one high-priority habit today and aim for a 3-day streak to build steady momentum.`;
    }

    setAiInsight(advice);
  };

  return (
    <div className="space-y-3 pb-24 font-mono">
      {/* Header */}
      <div className="card p-3.5 sm:p-4 flex items-center justify-between bg-white dark:bg-[#1D1B18]">
        <div>
          <h1 className="text-xl font-bold font-oswald tracking-tight uppercase text-[#1D1B18] dark:text-[#F8F7F4]">Settings</h1>
          <p className="text-xs text-[#1D1B18]/60 dark:text-[#F8F7F4]/60 uppercase">Preferences & Data</p>
        </div>
      </div>

      {/* Preferences & Toggles */}
      <div className="card p-3.5 sm:p-4 space-y-3 bg-white dark:bg-[#1D1B18]">
        <h2 className="text-xs font-bold font-oswald text-[#1D1B18] dark:text-[#F8F7F4] uppercase tracking-wider">Preferences</h2>

        <div className="grid grid-cols-2 gap-2">
          {/* Sound */}
          <button
            type="button"
            onClick={() => onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
            className="p-2.5 border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] text-xs font-bold flex items-center justify-between transition cursor-pointer hover:bg-[#F8F7F4] dark:hover:bg-[#252320]"
          >
            <span className="text-[11px] uppercase">Sound</span>
            <span className={`text-[9px] px-1.5 py-0.5 border border-[#1D1B18] dark:border-[#F8F7F4] font-bold uppercase ${
              settings.soundEnabled ? 'bg-[#1D1B18] dark:bg-[#F8F7F4] text-[#F8F7F4] dark:text-[#1D1B18]' : 'bg-transparent text-[#1D1B18]/50 dark:text-[#F8F7F4]/50'
            }`}>
              {settings.soundEnabled ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Haptic */}
          <button
            type="button"
            onClick={() => onUpdateSettings({ ...settings, hapticEnabled: !settings.hapticEnabled })}
            className="p-2.5 border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] text-xs font-bold flex items-center justify-between transition cursor-pointer hover:bg-[#F8F7F4] dark:hover:bg-[#252320]"
          >
            <span className="text-[11px] uppercase">Haptics</span>
            <span className={`text-[9px] px-1.5 py-0.5 border border-[#1D1B18] dark:border-[#F8F7F4] font-bold uppercase ${
              settings.hapticEnabled ? 'bg-[#1D1B18] dark:bg-[#F8F7F4] text-[#F8F7F4] dark:text-[#1D1B18]' : 'bg-transparent text-[#1D1B18]/50 dark:text-[#F8F7F4]/50'
            }`}>
              {settings.hapticEnabled ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Animation */}
          {pixelScene && onUpdatePixelScene && (
            <button
              type="button"
              onClick={() => onUpdatePixelScene({ isAnimated: !pixelScene.isAnimated })}
              className="p-2.5 border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] text-xs font-bold flex items-center justify-between transition cursor-pointer hover:bg-[#F8F7F4] dark:hover:bg-[#252320]"
            >
              <span className="text-[11px] uppercase">Animate</span>
              <span className={`text-[9px] px-1.5 py-0.5 border border-[#1D1B18] dark:border-[#F8F7F4] font-bold uppercase ${
                pixelScene.isAnimated ? 'bg-[#1D1B18] dark:bg-[#F8F7F4] text-[#F8F7F4] dark:text-[#1D1B18]' : 'bg-transparent text-[#1D1B18]/50 dark:text-[#F8F7F4]/50'
              }`}>
                {pixelScene.isAnimated ? 'ON' : 'OFF'}
              </span>
            </button>
          )}

          {/* Mood Reaction */}
          {pixelScene && onUpdatePixelScene && (
            <button
              type="button"
              onClick={() => onUpdatePixelScene({ syncWithMood: !pixelScene.syncWithMood })}
              className="p-2.5 border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] text-xs font-bold flex items-center justify-between transition cursor-pointer hover:bg-[#F8F7F4] dark:hover:bg-[#252320]"
            >
              <span className="text-[11px] uppercase">Mood Sync</span>
              <span className={`text-[9px] px-1.5 py-0.5 border border-[#1D1B18] dark:border-[#F8F7F4] font-bold uppercase ${
                pixelScene.syncWithMood ? 'bg-[#1D1B18] dark:bg-[#F8F7F4] text-[#F8F7F4] dark:text-[#1D1B18]' : 'bg-transparent text-[#1D1B18]/50 dark:text-[#F8F7F4]/50'
              }`}>
                {pixelScene.syncWithMood ? 'ON' : 'OFF'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Habit Insights */}
      <div className="card p-3.5 sm:p-4 space-y-2.5 bg-white dark:bg-[#1D1B18]">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold font-oswald text-[#1D1B18] dark:text-[#F8F7F4] uppercase tracking-wider">Coach Insights</h2>
          <button
            type="button"
            onClick={generateAIInsights}
            className="px-2.5 py-1 border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] hover:bg-[#F8F7F4] dark:hover:bg-[#252320] text-[#1D1B18] dark:text-[#F8F7F4] font-bold text-[10px] uppercase flex items-center gap-1 transition cursor-pointer"
          >
            <RefreshCw size={10} />
            Analyze
          </button>
        </div>

        {aiInsight && (
          <p className="text-xs text-[#1D1B18] dark:text-[#F8F7F4] leading-relaxed bg-[#F8F7F4] dark:bg-[#252320] p-2.5 border border-[#1D1B18] dark:border-[#F8F7F4]">
            {aiInsight}
          </p>
        )}
      </div>

      {/* Data Management */}
      <div className="card p-3.5 sm:p-4 space-y-2.5 bg-white dark:bg-[#1D1B18]">
        <h2 className="text-xs font-bold font-oswald text-[#1D1B18] dark:text-[#F8F7F4] uppercase tracking-wider">Data & Backup</h2>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="py-2 px-3 border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] hover:bg-[#F8F7F4] dark:hover:bg-[#252320] text-[#1D1B18] dark:text-[#F8F7F4] font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer uppercase"
          >
            <Download size={13} /> Export JSON
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="py-2 px-3 border border-[#1D1B18] dark:border-[#F8F7F4] bg-white dark:bg-[#1D1B18] hover:bg-[#F8F7F4] dark:hover:bg-[#252320] text-[#1D1B18] dark:text-[#F8F7F4] font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer uppercase"
          >
            <Upload size={13} /> Import JSON
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
          <p className="text-[10px] font-bold text-[#1D1B18] dark:text-[#F8F7F4] p-2 bg-[#F8F7F4] dark:bg-[#252320] border border-[#1D1B18] dark:border-[#F8F7F4] text-center uppercase">
            {importStatus}
          </p>
        )}

        {/* Reset */}
        <div className="pt-1">
          {resetConfirm ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onResetData();
                  setResetConfirm(false);
                }}
                className="flex-1 py-1.5 border border-[#E63946] bg-[#E63946] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer uppercase"
              >
                <Trash2 size={13} /> Confirm Reset
              </button>
              <button
                type="button"
                onClick={() => setResetConfirm(false)}
                className="py-1.5 px-3 border border-[#1D1B18] dark:border-[#F8F7F4] text-[#1D1B18] dark:text-[#F8F7F4] font-bold text-xs hover:bg-[#F8F7F4] dark:hover:bg-[#252320] transition cursor-pointer uppercase"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setResetConfirm(true)}
              className="w-full py-1.5 border border-[#E63946] text-[#E63946] hover:bg-[#E63946]/10 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer uppercase"
            >
              <Trash2 size={13} /> Reset to Defaults
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
