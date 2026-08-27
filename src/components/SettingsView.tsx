import React, { useState, useRef } from 'react';
import {
  PageType,
  AppSettings,
  HabitTemplate,
  MonthData,
  Project,
  PixelSceneConfig,
  SCENE_LOCATIONS,
  FROG_ACTIVITIES,
  FROG_HATS,
  FROG_COMPANIONS,
  FROG_WEATHERS,
} from '../types';
import { exportFullBackup, importFullBackup } from '../utils/storage';
import { Download, Upload, Trash2, Moon, Sun, RefreshCw, Sparkles, Sliders, Volume2, VolumeX } from 'lucide-react';
import { WoodGearDockIcon, CloverIcon, BambooScrollDockIcon, FrogFaceDockIcon, ToriiStatsDockIcon, PixelZenPondIcon } from './FrogIcons';
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
      <div className="ios-glass-card p-5">
        <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#8c7e70] dark:text-[#a89b8d]">Preferences & System</p>
        <h1 className="text-2xl font-black tracking-tight text-[#2d2823] dark:text-[#f4efe8]">Settings</h1>
      </div>

      {/* AI Habit Coach / Insights */}
      <div className="ios-glass-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-black text-sm text-zinc-950 dark:text-white">Croakle Mindful Coach & Insights</h2>
          </div>
          <button
            type="button"
            onClick={generateAIInsights}
            className="px-4 py-2 rounded-full bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-950 dark:text-white font-black text-xs flex items-center gap-1.5 transition border border-zinc-200 dark:border-zinc-700 shadow-2xs ios-tap"
          >
            <RefreshCw size={13} />
            Analyze
          </button>
        </div>

        {aiInsight ? (
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-800/60 p-4 rounded-[20px] border border-zinc-200 dark:border-zinc-700">
            {aiInsight}
          </p>
        ) : (
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Click "Analyze" to generate mindful behavioral summaries, habit stacking ideas, and project balance tips.
          </p>
        )}
      </div>

      {/* Pixel Sanctuary Habitat Preferences */}
      {pixelScene && onUpdatePixelScene && (
        <div className="ios-glass-card p-5 space-y-4">
          <div>
            <h2 className="font-black text-sm text-zinc-950 dark:text-white">Pixel Sanctuary Habitat</h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Customize your retro frog diorama, companions and animation effects.
            </p>
          </div>

          {/* Quick Toggles */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => onUpdatePixelScene({ isAnimated: !pixelScene.isAnimated })}
              className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition ios-tap ${
                pixelScene.isAnimated
                  ? 'bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-600 text-zinc-950 dark:text-white shadow-2xs'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 opacity-70'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>Pixel Animation</span>
              </div>
              <span className={`text-[10.5px] px-2 py-0.5 rounded-full font-black ${
                pixelScene.isAnimated ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
              }`}>
                {pixelScene.isAnimated ? 'ON' : 'OFF'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onUpdatePixelScene({ syncWithMood: !pixelScene.syncWithMood })}
              className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition ios-tap ${
                pixelScene.syncWithMood
                  ? 'bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-600 text-zinc-950 dark:text-white shadow-2xs'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 opacity-70'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>Mood Reaction</span>
              </div>
              <span className={`text-[10.5px] px-2 py-0.5 rounded-full font-black ${
                pixelScene.syncWithMood ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
              }`}>
                {pixelScene.syncWithMood ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Backup & Restore Card */}
      <div className="ios-glass-card p-5 space-y-4">
        <div>
          <h2 className="font-black text-sm text-zinc-950 dark:text-white">Backup & Restore</h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Export and import all habits, mood logs, notes, and time sessions as a JSON file.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="py-3 px-4 rounded-[20px] bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-950 dark:text-white font-black text-xs flex items-center justify-center gap-2 transition border border-zinc-200 dark:border-zinc-800 shadow-2xs ios-tap"
          >
            <Download size={15} /> Export JSON
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="py-3 px-4 rounded-[20px] bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-950 dark:text-white font-black text-xs flex items-center justify-center gap-2 transition border border-zinc-200 dark:border-zinc-800 shadow-2xs ios-tap"
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
          <p className="text-xs font-bold text-zinc-950 dark:text-white p-2.5 rounded-[16px] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-center">
            {importStatus}
          </p>
        )}
      </div>

      {/* Reset Data */}
      <div className="ios-glass-card p-5 space-y-3">
        <h2 className="font-black text-sm text-zinc-950 dark:text-white">Reset Data</h2>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
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
              className="py-2.5 px-4 rounded-[18px] bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs ios-tap hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setResetConfirm(true)}
            className="w-full py-3 rounded-[20px] bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-950 dark:text-white font-black text-xs flex items-center justify-center gap-2 transition border border-zinc-200 dark:border-zinc-800 shadow-2xs ios-tap"
          >
            <Trash2 size={15} /> Reset to Defaults
          </button>
        )}
      </div>
    </div>
  );
};
