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
import { Download, Upload, Trash2, Moon, Sun, RefreshCw, Volume2, VolumeX, Sparkles, BarChart3, Settings, Check, AlertCircle } from 'lucide-react';

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
    <div className="space-y-4 pb-28 font-mono">
      {/* Header */}
      <div className="rounded-2xl border-[2.5px] border-[#1F1B1A] p-4 flex items-center justify-between bg-[#FED843] text-[#1F1B1A] shadow-[4px_4px_0px_#1F1B1A]">
        <div>
          <h1 className="text-xl font-bold font-oswald tracking-tight uppercase text-[#1F1B1A]">Settings</h1>
          <p className="text-xs text-[#1F1B1A]/70 uppercase">Preferences & Data</p>
        </div>
      </div>

      {/* Preferences & Toggles */}
      <div className="rounded-2xl border-[2.5px] border-[#1F1B1A] p-4 space-y-3.5 bg-[#FED843] text-[#1F1B1A] shadow-[4px_4px_0px_#1F1B1A]">
        <h2 className="text-xs font-bold font-oswald text-[#1F1B1A] uppercase tracking-wider">Preferences</h2>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Sound */}
          <button
            type="button"
            onClick={() => onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
            className="p-3 rounded-xl border-[2px] border-[#1F1B1A] bg-white text-xs font-bold flex items-center justify-between transition cursor-pointer hover:bg-white/90 shadow-[2px_2px_0px_#1F1B1A] active:translate-x-0.5 active:translate-y-0.5"
          >
            <span className="text-[11px] uppercase text-[#1F1B1A]">Sound</span>
            <span className={`text-[9px] px-2 py-0.5 rounded-lg border border-[#1F1B1A] font-bold uppercase shadow-[1px_1px_0px_#1F1B1A] ${
              settings.soundEnabled ? 'bg-[#FEF08A] text-[#1F1B1A]' : 'bg-transparent text-[#1F1B1A]/50'
            }`}>
              {settings.soundEnabled ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Haptic */}
          <button
            type="button"
            onClick={() => onUpdateSettings({ ...settings, hapticEnabled: !settings.hapticEnabled })}
            className="p-3 rounded-xl border-[2px] border-[#1F1B1A] bg-white text-xs font-bold flex items-center justify-between transition cursor-pointer hover:bg-white/90 shadow-[2px_2px_0px_#1F1B1A] active:translate-x-0.5 active:translate-y-0.5"
          >
            <span className="text-[11px] uppercase text-[#1F1B1A]">Haptics</span>
            <span className={`text-[9px] px-2 py-0.5 rounded-lg border border-[#1F1B1A] font-bold uppercase shadow-[1px_1px_0px_#1F1B1A] ${
              settings.hapticEnabled ? 'bg-[#FEF08A] text-[#1F1B1A]' : 'bg-transparent text-[#1F1B1A]/50'
            }`}>
              {settings.hapticEnabled ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Animation */}
          {pixelScene && onUpdatePixelScene && (
            <button
              type="button"
              onClick={() => onUpdatePixelScene({ isAnimated: !pixelScene.isAnimated })}
              className="p-3 rounded-xl border-[2px] border-[#1F1B1A] bg-white text-xs font-bold flex items-center justify-between transition cursor-pointer hover:bg-white/90 shadow-[2px_2px_0px_#1F1B1A] active:translate-x-0.5 active:translate-y-0.5"
            >
              <span className="text-[11px] uppercase text-[#1F1B1A]">Animate</span>
              <span className={`text-[9px] px-2 py-0.5 rounded-lg border border-[#1F1B1A] font-bold uppercase shadow-[1px_1px_0px_#1F1B1A] ${
                pixelScene.isAnimated ? 'bg-[#FEF08A] text-[#1F1B1A]' : 'bg-transparent text-[#1F1B1A]/50'
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
              className="p-3 rounded-xl border-[2px] border-[#1F1B1A] bg-white text-xs font-bold flex items-center justify-between transition cursor-pointer hover:bg-white/90 shadow-[2px_2px_0px_#1F1B1A] active:translate-x-0.5 active:translate-y-0.5"
            >
              <span className="text-[11px] uppercase text-[#1F1B1A]">Mood Sync</span>
              <span className={`text-[9px] px-2 py-0.5 rounded-lg border border-[#1F1B1A] font-bold uppercase shadow-[1px_1px_0px_#1F1B1A] ${
                pixelScene.syncWithMood ? 'bg-[#FEF08A] text-[#1F1B1A]' : 'bg-transparent text-[#1F1B1A]/50'
              }`}>
                {pixelScene.syncWithMood ? 'ON' : 'OFF'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Habit Insights */}
      <div className="rounded-2xl border-[2.5px] border-[#1F1B1A] p-4 space-y-3 bg-[#FED843] text-[#1F1B1A] shadow-[4px_4px_0px_#1F1B1A]">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold font-oswald text-[#1F1B1A] uppercase tracking-wider">Coach Insights</h2>
          <button
            type="button"
            onClick={generateAIInsights}
            className="px-3 py-1.5 rounded-xl border-[2px] border-[#1F1B1A] bg-white text-[#1F1B1A] font-bold text-[10px] uppercase flex items-center gap-1.5 transition cursor-pointer shadow-[2px_2px_0px_#1F1B1A] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5"
          >
            <RefreshCw size={11} />
            Analyze
          </button>
        </div>

        {aiInsight && (
          <p className="text-xs text-[#1F1B1A] leading-relaxed bg-white p-3 rounded-xl border-[2px] border-[#1F1B1A] shadow-[2px_2px_0px_#1F1B1A]">
            {aiInsight}
          </p>
        )}
      </div>

      {/* Data Management */}
      <div className="rounded-2xl border-[2.5px] border-[#1F1B1A] p-4 space-y-3 bg-[#FED843] text-[#1F1B1A] shadow-[4px_4px_0px_#1F1B1A]">
        <h2 className="text-xs font-bold font-oswald text-[#1F1B1A] uppercase tracking-wider">Data & Backup</h2>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleExport}
            className="py-2.5 px-3 rounded-xl border-[2px] border-[#1F1B1A] bg-white hover:bg-white/80 text-[#1F1B1A] font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer uppercase shadow-[2px_2px_0px_#1F1B1A] active:translate-x-0.5 active:translate-y-0.5"
          >
            <Download size={14} /> Export JSON
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="py-2.5 px-3 rounded-xl border-[2px] border-[#1F1B1A] bg-white hover:bg-white/80 text-[#1F1B1A] font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer uppercase shadow-[2px_2px_0px_#1F1B1A] active:translate-x-0.5 active:translate-y-0.5"
          >
            <Upload size={14} /> Import JSON
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
          <div className="w-full py-2.5 px-3 rounded-xl border-[2px] border-[#1F1B1A] bg-white text-[#1F1B1A] font-bold text-xs flex items-center justify-center gap-2 uppercase shadow-[2px_2px_0px_#1F1B1A]">
            {importStatus.startsWith('Error') ? (
              <AlertCircle size={14} className="shrink-0 text-[#E02921]" />
            ) : (
              <Check size={14} className="shrink-0 text-[#1F1B1A]" />
            )}
            <span>{importStatus}</span>
          </div>
        )}

        {/* Reset */}
        <div className="pt-2">
          {resetConfirm ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onResetData();
                  setResetConfirm(false);
                }}
                className="flex-1 py-2 rounded-xl border-[2px] border-[#1F1B1A] bg-[#E02921] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer uppercase shadow-[2px_2px_0px_#1F1B1A] active:translate-x-0.5 active:translate-y-0.5"
              >
                <Trash2 size={14} /> Confirm Reset
              </button>
              <button
                type="button"
                onClick={() => setResetConfirm(false)}
                className="py-2 px-4 rounded-xl border-[2px] border-[#1F1B1A] bg-white text-[#1F1B1A] font-bold text-xs hover:bg-white/80 transition cursor-pointer uppercase shadow-[2px_2px_0px_#1F1B1A] active:translate-x-0.5 active:translate-y-0.5"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setResetConfirm(true)}
              className="w-full py-2 rounded-xl border-[2px] border-[#E02921] text-[#E02921] hover:bg-[#E02921] hover:text-white bg-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer uppercase shadow-[2px_2px_0px_#1F1B1A] active:translate-x-0.5 active:translate-y-0.5"
            >
              <Trash2 size={14} /> Reset to Defaults
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
