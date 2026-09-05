import React, { useState } from 'react';
import { User } from 'firebase/auth';
import {
  Cloud,
  CloudOff,
  RefreshCw,
  LogIn,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Globe,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Database,
  Eye,
  FileJson,
} from 'lucide-react';
import { SyncStatus } from '../hooks/useFirebaseAuth';
import {
  firebaseProjectId,
  firestoreDatabaseId,
  fetchServerAppState,
  UserAppStatePayload,
} from '../lib/firebase';

interface FirebaseSyncSectionProps {
  user: User | null;
  authLoading: boolean;
  syncStatus: SyncStatus;
  lastSyncedAt: Date | null;
  errorMessage: string | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onSyncNow: () => void;
}

export const FirebaseSyncSection: React.FC<FirebaseSyncSectionProps> = ({
  user,
  authLoading,
  syncStatus,
  lastSyncedAt,
  errorMessage,
  onSignIn,
  onSignOut,
  onSyncNow,
}) => {
  const [copied, setCopied] = useState(false);
  const [showDomainGuide, setShowDomainGuide] = useState(false);
  const [showDataInspector, setShowDataInspector] = useState(false);
  const [inspectingData, setInspectingData] = useState(false);
  const [serverData, setServerData] = useState<UserAppStatePayload | null>(null);
  const [inspectError, setInspectError] = useState<string | null>(null);
  const [showJson, setShowJson] = useState(false);

  const targetDomain = 'summour.github.io';
  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : targetDomain;
  const isUnauthorized =
    errorMessage?.toLowerCase().includes('unauthorized domain') ||
    errorMessage?.toLowerCase().includes('unauthorized-domain');

  const handleCopyDomain = (domainToCopy: string) => {
    navigator.clipboard.writeText(domainToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInspectCloudData = async () => {
    if (!user) return;
    setInspectingData(true);
    setInspectError(null);
    setShowDataInspector(true);
    try {
      const data = await fetchServerAppState(user.uid);
      setServerData(data);
    } catch (err: any) {
      setInspectError(err?.message || 'Failed to fetch direct document from Firestore server');
    } finally {
      setInspectingData(false);
    }
  };

  const consoleUrl = `https://console.firebase.google.com/project/${firebaseProjectId}/firestore/databases/${firestoreDatabaseId}/data`;

  return (
    <div
      id="firebase-cloud-sync-card"
      className="rounded-2xl border-[2.5px] border-[#1F1B1A] p-4 space-y-3.5 bg-[#FED843] text-[#1F1B1A] shadow-[4px_4px_0px_#1F1B1A]"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl border-[2px] border-[#1F1B1A] bg-white flex items-center justify-center shadow-[2px_2px_0px_#1F1B1A]">
            <Cloud size={16} className="text-[#D32018]" />
          </div>
          <div>
            <h2 className="text-xs font-bold font-oswald text-[#1F1B1A] uppercase tracking-wider">
              Firebase Cloud Database
            </h2>
            <p className="text-[10px] text-[#1F1B1A]/70 uppercase font-mono">
              Multi-device Cloud Sync
            </p>
          </div>
        </div>

        {/* Sync Status Badge */}
        {user ? (
          <span
            className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-full border-[1.5px] border-[#1F1B1A] flex items-center gap-1.5 shadow-[1.5px_1.5px_0px_#1F1B1A] uppercase ${
              syncStatus === 'synced'
                ? 'bg-[#86EFAC] text-[#14532D]'
                : syncStatus === 'syncing'
                ? 'bg-[#FEF08A] text-[#854D0E]'
                : syncStatus === 'error'
                ? 'bg-[#FCA5A5] text-[#7F1D1D]'
                : 'bg-white text-[#1F1B1A]'
            }`}
          >
            {syncStatus === 'synced' && <CheckCircle2 size={11} />}
            {syncStatus === 'syncing' && <RefreshCw size={11} className="animate-spin" />}
            {syncStatus === 'error' && <AlertTriangle size={11} />}
            {syncStatus === 'synced'
              ? 'Synced'
              : syncStatus === 'syncing'
              ? 'Syncing...'
              : syncStatus === 'error'
              ? 'Timeout/Error'
              : 'Connected'}
          </span>
        ) : (
          <span className="text-[9px] font-mono font-bold px-2.5 py-1 rounded-full border-[1.5px] border-[#1F1B1A] bg-white text-[#1F1B1A]/70 flex items-center gap-1 shadow-[1.5px_1.5px_0px_#1F1B1A] uppercase">
            <CloudOff size={11} />
            Local Only
          </span>
        )}
      </div>

      {/* Domain Badge & Info */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-white/70 rounded-xl border-[1.5px] border-[#1F1B1A] text-[10px] font-mono">
        <div className="flex items-center gap-1.5 truncate">
          <Globe size={12} className="text-[#D32018] shrink-0" />
          <span className="font-bold text-[#1F1B1A] truncate">
            {currentHostname === 'localhost' ? `${targetDomain} (Production)` : currentHostname}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowDomainGuide(!showDomainGuide)}
          className="text-[9px] font-bold text-[#D32018] uppercase flex items-center gap-0.5 hover:underline cursor-pointer ml-2 shrink-0"
        >
          <span>Firebase Setup</span>
          {showDomainGuide ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
        </button>
      </div>

      {/* Domain Authorization Guide Card */}
      {(showDomainGuide || isUnauthorized) && (
        <div className="p-3 bg-white rounded-xl border-[2px] border-[#1F1B1A] shadow-[2px_2px_0px_#1F1B1A] space-y-2 text-[10px] font-mono">
          <div className="flex items-center justify-between pb-1 border-b border-gray-200">
            <span className="font-bold text-[#1F1B1A] uppercase flex items-center gap-1">
              <ShieldCheck size={12} className="text-[#15803D]" />
              Authorized Domain Guide
            </span>
            <span className="text-[9px] text-gray-500">Firebase Auth</span>
          </div>

          <p className="text-gray-700 leading-snug">
            สำหรับการล็อกอิน Google บน <strong>https://summour.github.io/Croakle/</strong> ต้องเพิ่มโดเมนใน Firebase Console:
          </p>

          <div className="bg-amber-50 p-2 rounded-lg border border-amber-300 flex items-center justify-between gap-2">
            <code className="text-[11px] font-bold text-[#1F1B1A]">{targetDomain}</code>
            <button
              type="button"
              onClick={() => handleCopyDomain(targetDomain)}
              className="px-2 py-1 bg-white border border-[#1F1B1A] rounded text-[9px] font-bold uppercase hover:bg-gray-100 flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check size={10} className="text-green-600" /> : <Copy size={10} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <ol className="list-decimal list-inside space-y-1 text-gray-700 text-[9.5px]">
            <li>เปิด <strong>Firebase Console</strong> ({firebaseProjectId})</li>
            <li>ไปที่ <strong>Authentication</strong> &gt; แท็บ <strong>Settings</strong></li>
            <li>เลื่อนลงไปที่ <strong>Authorized domains</strong> &gt; กด <strong>Add domain</strong></li>
            <li>วาง <strong className="text-black">{targetDomain}</strong> แล้วกด <strong>Save</strong></li>
          </ol>

          <a
            href={`https://console.firebase.google.com/project/${firebaseProjectId}/authentication/settings`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-1 py-1.5 px-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 font-bold text-[9px] uppercase flex items-center justify-center gap-1 text-gray-800"
          >
            <ExternalLink size={10} />
            เปิด Firebase Auth Settings Console
          </a>
        </div>
      )}

      {/* User Info / Sign In Options */}
      {authLoading ? (
        <div className="p-3 bg-white rounded-xl border-[2px] border-[#1F1B1A] shadow-[2px_2px_0px_#1F1B1A] flex items-center justify-center gap-2 text-xs font-mono">
          <RefreshCw size={13} className="animate-spin" /> Checking cloud session...
        </div>
      ) : user ? (
        <div className="space-y-3">
          {/* User profile card */}
          <div className="p-3 bg-white rounded-xl border-[2px] border-[#1F1B1A] shadow-[2px_2px_0px_#1F1B1A] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-9 h-9 rounded-full border-[1.5px] border-[#1F1B1A] object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-9 h-9 rounded-full border-[1.5px] border-[#1F1B1A] bg-[#FEF08A] flex items-center justify-center font-bold text-sm shrink-0">
                  {user.displayName?.[0] || 'U'}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-bold font-mono text-[#1F1B1A] truncate">
                  {user.displayName || 'Logged In Explorer'}
                </p>
                <p className="text-[10px] font-mono text-[#1F1B1A]/60 truncate">
                  {user.email || user.uid.slice(0, 10)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={onSyncNow}
                disabled={syncStatus === 'syncing'}
                title="Sync state to Firebase Cloud now"
                className="py-1.5 px-2.5 rounded-lg border-[1.5px] border-[#1F1B1A] bg-[#FEF08A] hover:bg-[#FDE047] text-[#1F1B1A] font-bold text-[10px] uppercase flex items-center gap-1 cursor-pointer transition shadow-[1.5px_1.5px_0px_#1F1B1A] active:translate-x-0.5 active:translate-y-0.5"
              >
                <RefreshCw size={11} className={syncStatus === 'syncing' ? 'animate-spin' : ''} />
                Sync
              </button>
              <button
                type="button"
                onClick={onSignOut}
                title="Log out of Firebase"
                className="py-1.5 px-2 rounded-lg border-[1.5px] border-[#1F1B1A] bg-white hover:bg-red-50 text-[#D32018] font-bold text-[10px] uppercase flex items-center gap-1 cursor-pointer transition shadow-[1.5px_1.5px_0px_#1F1B1A] active:translate-x-0.5 active:translate-y-0.5"
              >
                <LogOut size={11} />
              </button>
            </div>
          </div>

          {/* Sync Timestamp details */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[#1F1B1A]/80 px-1">
            <span className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-[#15803D]" /> Realtime Firestore Active
            </span>
            <span>
              {lastSyncedAt
                ? `Last: ${lastSyncedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
                : 'Pending sync'}
            </span>
          </div>

          {/* Cloud Data Inspector & Console Access */}
          <div className="pt-1 space-y-2 border-t border-[#1F1B1A]/20">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleInspectCloudData}
                disabled={inspectingData}
                className="flex-1 py-1.5 px-2 bg-white hover:bg-gray-50 border-[1.5px] border-[#1F1B1A] rounded-xl text-[10px] font-mono font-bold uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow-[1.5px_1.5px_0px_#1F1B1A] active:translate-x-0.5 active:translate-y-0.5"
              >
                {inspectingData ? (
                  <RefreshCw size={11} className="animate-spin text-[#D32018]" />
                ) : (
                  <Database size={11} className="text-[#D32018]" />
                )}
                {inspectingData ? 'Checking Server...' : 'ตรวจดูข้อมูลสดบน Cloud'}
              </button>

              <a
                href={consoleUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="เปิด Firestore Database ใน Firebase Console"
                className="py-1.5 px-2.5 bg-white hover:bg-gray-50 border-[1.5px] border-[#1F1B1A] rounded-xl text-[10px] font-mono font-bold uppercase flex items-center gap-1 text-[#1F1B1A] shadow-[1.5px_1.5px_0px_#1F1B1A] active:translate-x-0.5 active:translate-y-0.5"
              >
                <ExternalLink size={11} />
                Console
              </a>
            </div>

            {/* Cloud Data Modal / Drawer Details */}
            {showDataInspector && (
              <div className="p-3 bg-white rounded-xl border-[2px] border-[#1F1B1A] shadow-[2px_2px_0px_#1F1B1A] space-y-2.5 text-[10px] font-mono">
                <div className="flex items-center justify-between pb-1.5 border-b border-gray-200">
                  <span className="font-bold text-[#1F1B1A] uppercase flex items-center gap-1.5">
                    <Database size={12} className="text-[#15803D]" />
                    Firestore Live Data
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowDataInspector(false)}
                    className="text-gray-400 hover:text-black text-xs font-bold px-1"
                  >
                    ✕
                  </button>
                </div>

                {inspectError ? (
                  <div className="p-2 bg-red-50 border border-red-200 rounded text-red-700">
                    <p className="font-bold">Error fetching live document:</p>
                    <p className="text-[9px]">{inspectError}</p>
                  </div>
                ) : serverData ? (
                  <div className="space-y-2">
                    <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 space-y-1">
                      <p className="text-[9px] text-gray-500 font-mono truncate">
                        Path: <code className="text-[#1F1B1A] font-bold">users/{user.uid}/data/appState</code>
                      </p>
                      <p className="text-[9px] text-gray-500 font-mono">
                        Server Updated:{' '}
                        <strong className="text-[#1F1B1A]">
                          {new Date(serverData.updatedAt).toLocaleString()}
                        </strong>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="p-1.5 bg-green-50 border border-green-200 rounded text-center">
                        <span className="text-gray-600 block text-[9px]">Habits Saved</span>
                        <strong className="text-xs text-green-800">
                          {serverData.habits?.habitTemplates?.length || 0} รายการ
                        </strong>
                      </div>
                      <div className="p-1.5 bg-blue-50 border border-blue-200 rounded text-center">
                        <span className="text-gray-600 block text-[9px]">Projects</span>
                        <strong className="text-xs text-blue-800">
                          {serverData.projects?.length || 0} โปรเจกต์
                        </strong>
                      </div>
                      <div className="p-1.5 bg-purple-50 border border-purple-200 rounded text-center">
                        <span className="text-gray-600 block text-[9px]">Daily Notes</span>
                        <strong className="text-xs text-purple-800">
                          {serverData.notes?.length || 0} บันทึก
                        </strong>
                      </div>
                      <div className="p-1.5 bg-amber-50 border border-amber-200 rounded text-center">
                        <span className="text-gray-600 block text-[9px]">Focus Sessions</span>
                        <strong className="text-xs text-amber-800">
                          {serverData.sessions?.length || 0} รอบ
                        </strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => setShowJson(!showJson)}
                        className="text-[9px] font-bold uppercase text-gray-600 hover:text-black flex items-center gap-1 cursor-pointer"
                      >
                        <FileJson size={11} />
                        {showJson ? 'ซ่อน Raw JSON' : 'ดู Raw JSON จาก Cloud'}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(serverData, null, 2));
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="text-[9px] font-bold uppercase text-gray-600 hover:text-black flex items-center gap-1 cursor-pointer"
                      >
                        {copied ? <Check size={10} className="text-green-600" /> : <Copy size={10} />}
                        {copied ? 'Copied JSON' : 'Copy JSON'}
                      </button>
                    </div>

                    {showJson && (
                      <pre className="p-2 bg-gray-900 text-green-400 rounded-lg text-[9px] max-h-48 overflow-auto font-mono whitespace-pre-wrap">
                        {JSON.stringify(serverData, null, 2)}
                      </pre>
                    )}
                  </div>
                ) : (
                  <div className="p-2 text-center text-gray-500">
                    ยังไม่มีข้อมูลบันทึกใน Firestore กดปุ่ม "Sync" ด้านบนเพื่ออัปโหลดทันที
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-3 bg-white rounded-xl border-[2px] border-[#1F1B1A] shadow-[2px_2px_0px_#1F1B1A] space-y-2.5">
          <p className="text-[11px] font-mono leading-relaxed text-[#1F1B1A]">
            Log in with Google to sync all habits, projects, notes, mood, and pixel frog habitat securely to Firebase Firestore across multiple phones and computers.
          </p>

          <button
            type="button"
            onClick={onSignIn}
            className="w-full py-2.5 px-3 rounded-xl border-[2px] border-[#1F1B1A] bg-[#1F1B1A] hover:bg-[#322D2B] text-white font-bold text-xs font-mono flex items-center justify-center gap-2 transition cursor-pointer uppercase shadow-[2px_2px_0px_#FED843] active:translate-x-0.5 active:translate-y-0.5"
          >
            <LogIn size={14} className="text-[#FEF08A]" />
            Sign In with Google
          </button>

          <div className="pt-1 text-center">
            <a
              href={consoleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9.5px] font-mono font-bold text-[#1F1B1A]/70 hover:text-[#1F1B1A] underline inline-flex items-center gap-1"
            >
              <ExternalLink size={10} />
              เปิดดูโครงสร้างใน Firebase Console
            </a>
          </div>
        </div>
      )}

      {/* Error / Timeout banner */}
      {errorMessage && (
        <div className="p-2.5 bg-[#FEE2E2] rounded-xl border-[2px] border-[#EF4444] text-[#991B1B] text-[11px] font-mono flex items-start gap-2 shadow-[2px_2px_0px_#1F1B1A]">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Sync notice:</p>
            <p className="text-[10px] opacity-90 leading-relaxed">
              {(() => {
                try {
                  const parsed = JSON.parse(errorMessage);
                  return parsed.error || errorMessage;
                } catch {
                  return errorMessage;
                }
              })()}
            </p>
          </div>
          <button
            type="button"
            onClick={onSyncNow}
            className="px-2 py-0.5 bg-white border border-[#991B1B] rounded text-[9px] font-bold uppercase hover:bg-gray-50 shrink-0"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};
