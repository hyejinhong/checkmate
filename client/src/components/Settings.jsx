import React, { useState, useEffect } from 'react';

const Settings = ({ onBack }) => {
  // 초기 상태를 실제 document 클래스 상태와 동기화
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = (mode) => {
    setIsDarkMode(mode === 'dark');
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="bg-surface dark:bg-slate-900 font-body text-on-surface dark:text-white antialiased min-h-screen pb-32">
      {/* 배경 점 패턴 */}
      <div className="fixed inset-0 bg-dot-pattern pointer-events-none opacity-10"></div>

      {/* 상단 헤더 */}
      <header className="fixed top-0 w-full z-50 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-sm flex items-center px-6 h-16">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 rounded-full active:scale-95 transition-transform duration-200 hover:bg-emerald-50/50"
          >
            <span className="material-symbols-outlined text-emerald-900 dark:text-emerald-400 font-bold">arrow_back</span>
          </button>
          <h1 className="font-headline text-lg font-bold tracking-tight text-emerald-900 dark:text-emerald-400">Settings</h1>
        </div>
      </header>

      <main className="relative pt-24 px-6 max-w-2xl mx-auto">
        {/* 화면 모드 설정 섹션 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              dark_mode
            </span>
            <h3 className="font-headline font-bold text-lg">화면 모드</h3>
          </div>

          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-[2.5rem] p-4 shadow-sm border border-white/40 dark:border-slate-700">
            <div className="flex p-1.5 bg-slate-100 dark:bg-slate-700 rounded-full">
              <button
                onClick={() => toggleTheme('light')}
                className={`flex-1 py-3 text-sm font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-2 ${
                  !isDarkMode 
                  ? 'bg-[#79E5CB] text-emerald-900 shadow-sm' 
                  : 'text-slate-500 hover:text-emerald-400'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">light_mode</span>
                <span>라이트 모드</span>
              </button>
              
              <button
                onClick={() => toggleTheme('dark')}
                className={`flex-1 py-3 text-sm font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-2 ${
                  isDarkMode 
                  ? 'bg-[#79E5CB] text-emerald-900 shadow-sm' 
                  : 'text-slate-500 hover:text-emerald-400'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">dark_mode</span>
                <span>다크 모드</span>
              </button>
            </div>
          </div>
        </section>

        {/* 하단 브랜드 정보 */}
        <footer className="text-center mt-20 opacity-40 space-y-1">
          <p className="font-headline font-bold text-sm tracking-widest text-emerald-900 dark:text-emerald-400">CHECKMATE</p>
          <p className="text-xs">v1.0.0 • Made by hhjcloud</p>
        </footer>
      </main>

      {/* 하단 네비게이션 바 */}
      <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-8 py-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-t-[2.5rem] shadow-lg pb-safe">
        <button className="text-slate-400 p-4">
          <span className="material-symbols-outlined">add_circle</span>
        </button>
        <button className="text-slate-400 p-4">
          <span className="material-symbols-outlined">history</span>
        </button>
        <button className="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 rounded-full p-4">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            settings
          </span>
        </button>
      </nav>
    </div>
  );
};

export default Settings;