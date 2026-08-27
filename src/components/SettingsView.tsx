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
import { Download, Upload, Trash2, Moon, Sun, RefreshCw, Volume2, VolumeX, Check, Sparkles } from 'lucide-react';
import { WoodGearDockIcon, ToriiStatsDockIcon, FrogMoodRad } from './FrogIcons';
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
  const [frogNameInput, setFrogNameInput] = useState(pixelScene?.frogName || 'Croakle');
  const [userNameInput, setUserNameInput] = useState(settings.userName || '');
  const [nameSaved, setNameSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveNames = () => {
    const trimmedFrog = frogNameInput.trim();
    if (trimmedFrog && onUpdatePixelScene) {
      onUpdatePixelScene({ frogName: trimmedFrog });
    }
    onUpdateSettings({
      ...settings,
      frogName: trimmedFrog || 'Croakle',
      userName: userNameInput.trim(),
    });
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2000);
  };

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
    <div className="space-y-3.5 pb-24">
      {/* Top Navigation */}
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
      <div className="ios-glass-card p-3.5 sm:p-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black tracking-tight text-zinc-950 dark:text-white">Settings</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Preferences & Profile</p>
        </div>
      </div>

      {/* Profile & Pet Customization */}
      <div className="ios-glass-card p-3.5 sm:p-4 space-y-3">
        <div className="flex items-center gap-2">
          <FrogMoodRad size={20} />
          <h2 className="text-xs font-black text-zinc-950 dark:text-white uppercase tracking-wider">Profile & Pet</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">
              Frog Name
            </label>
            <input
              type="text"
              value={frogNameInput}
              onChange={(e) => setFrogNameInput(e.target.value)}
              placeholder="Croakle"
              maxLength={24}
              className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-zinc-950/20 dark:focus:ring-white/20"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">
              User Name (Optional)
            </label>
            <input
              type="text"
              value={userNameInput}
              onChange={(e) => setUserNameInput(e.target.value)}
              placeholder="Your name"
              maxLength={24}
              className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-zinc-950/20 dark:focus:ring-white/20"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveNames}
          className="w-full py-2 px-3 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-black flex items-center justify-center gap-1.5 transition active:scale-[0.98]"
        >
          {nameSaved ? <Check size={14} className="text-emerald-400 dark:text-emerald-600" /> : null}
          <span>{nameSaved ? 'Saved!' : 'Save Profile'}</span>
        </button>
      </div>

      {/* Preferences & Toggles */}
      <div className="ios-glass-card p-3.5 sm:p-4 space-y-3">
        <h2 className="text-xs font-black text-zinc-950 dark:text-white uppercase tracking-wider">Preferences</h2>

        <div className="grid grid-cols-2 gap-2">
          {/* Sound */}
          <button
            type="button"
            onClick={() => onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
            className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-zinc-800/40 text-xs font-bold flex items-center justify-between transition"
          >
            <span>Sound Effects</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
              settings.soundEnabled ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500'
            }`}>
              {settings.soundEnabled ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Haptic */}
          <button
            type="button"
            onClick={() => onUpdateSettings({ ...settings, hapticEnabled: !settings.hapticEnabled })}
            className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-zinc-800/40 text-xs font-bold flex items-center justify-between transition"
          >
            <span>Haptics</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
              settings.hapticEnabled ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500'
            }`}>
              {settings.hapticEnabled ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Animation */}
          {pixelScene && onUpdatePixelScene && (
            <button
              type="button"
              onClick={() => onUpdatePixelScene({ isAnimated: !pixelScene.isAnimated })}
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-zinc-800/40 text-xs font-bold flex items-center justify-between transition"
            >
              <span>Animations</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                pixelScene.isAnimated ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500'
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
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-zinc-800/40 text-xs font-bold flex items-center justify-between transition"
            >
              <span>Mood Sync</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                pixelScene.syncWithMood ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500'
              }`}>
                {pixelScene.syncWithMood ? 'ON' : 'OFF'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Habit Insights */}
      <div className="ios-glass-card p-3.5 sm:p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black text-zinc-950 dark:text-white uppercase tracking-wider">Mindful Coach</h2>
          <button
            type="button"
            onClick={generateAIInsights}
            className="px-2.5 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold text-[11px] flex items-center gap-1 transition"
          >
            <RefreshCw size={11} />
            Analyze
          </button>
        </div>

        {aiInsight && (
          <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-800/60 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700">
            {aiInsight}
          </p>
        )}
      </div>

      {/* Data Management */}
      <div className="ios-glass-card p-3.5 sm:p-4 space-y-2.5">
        <h2 className="text-xs font-black text-zinc-950 dark:text-white uppercase tracking-wider">Data & Backup</h2>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="py-2.5 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition border border-zinc-200 dark:border-zinc-700"
          >
            <Download size={13} /> Export JSON
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="py-2.5 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition border border-zinc-200 dark:border-zinc-700"
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
          <p className="text-[11px] font-bold text-zinc-900 dark:text-white p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-center">
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
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Trash2 size={13} /> Confirm Reset
              </button>
              <button
                type="button"
                onClick={() => setResetConfirm(false)}
                className="py-2 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs hover:bg-zinc-200 transition"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setResetConfirm(true)}
              className="w-full py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <Trash2 size={13} /> Reset to Defaults
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
