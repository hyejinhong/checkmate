import React, { useState, useEffect } from 'react';

const ShareModal = ({ isOpen, onClose, shareUrl }) => {
  const [showToast, setShowToast] = useState(false);

  // 모달이 닫힐 때 토스트 상태 초기화
  useEffect(() => {
    if (!isOpen) setShowToast(false);
  }, [isOpen]);

  // 클립보드 복사 함수
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowToast(true);
      // 2초 후 토스트 메시지 사라짐
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error('복사에 실패했습니다.', err);
    }
  };

  // 모달이 닫혀있으면 아무것도 그리지 않음
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      {/* Modal Card */}
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-white/20 dark:border-slate-800">
        
        {/* Modal Header */}
        <div className="px-10 pt-10 pb-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#69f6b8] dark:bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[#006947] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                push_pin
              </span>
            </div>
            <h2 className="font-headline text-2xl font-bold tracking-tight text-slate-900 dark:text-white">메모 공유</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center text-slate-400"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="px-10 pb-10 space-y-8">
          {/* Link Copy Section */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 ml-1">초대 링크 복사</label>
            <div className="flex gap-3 items-center">
              <div className="flex-grow bg-slate-100 dark:bg-slate-800 rounded-full px-6 py-4 flex items-center min-w-0">
                <span className="text-slate-900 dark:text-slate-200 font-medium truncate">{shareUrl}</span>
              </div>
              <button 
                onClick={handleCopy}
                className="bg-[#79E5CB] hover:bg-[#68d4b9] text-white rounded-full font-bold flex items-center justify-center transition-all active:scale-95 shadow-md w-14 h-14 flex-shrink-0"
              >
                <span className="material-symbols-outlined text-xl">content_copy</span>
              </button>
            </div>
          </div>

          {/* Separator */}
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">또는 QR 코드로 스캔</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          {/* QR Code Section */}
          <div className="flex flex-col items-center">
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl mb-4 shadow-inner">
              <img 
                alt="Invite QR Code" 
                className="w-48 h-48 rounded-xl bg-white p-2" 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`} 
              />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">옆에 있는 친구가 바로 스캔할 수 있어요.</p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 dark:bg-slate-950/50 px-10 py-6 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            <span className="material-symbols-outlined text-sm align-middle mr-1 text-[#79E5CB]">lock</span>
            이 링크를 아는 사람은 누구나 이 메모를 보고 편집할 수 있습니다.
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      <div className={`fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl transition-all duration-300 ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <span className="material-symbols-outlined text-[#69f6b8]">check_circle</span>
        <span className="font-medium">복사되었습니다!</span>
      </div>
    </div>
  );
};

export default ShareModal;