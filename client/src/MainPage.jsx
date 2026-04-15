import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MainPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recentMemos, setRecentMemos] = useState([]);

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return '알 수 없음';
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${days}일 전`;
  };

  useEffect(() => {
    // 로컬 스토리지에서 최근 메모 목록을 가져오는 로직 (예시 데이터 구조)
    const savedMemos = JSON.parse(localStorage.getItem('recentMemos') || '[]');
    // 최신순 정렬 보장
    setRecentMemos(savedMemos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  }, []);

  const handleDeleteMemo = (e, shareKey) => {
    e.stopPropagation(); // 카드 클릭 이벤트(이동) 방지
    if (!window.confirm("이 메모장을 목록에서 삭제하시겠습니까?\n(실제 데이터는 삭제되지 않으며, 다시 PIN을 입력하여 추가할 수 있습니다.)")) return;
    const savedMemos = JSON.parse(localStorage.getItem('recentMemos') || '[]');
    const updatedMemos = savedMemos.filter(m => m.shareKey !== shareKey);
    localStorage.setItem('recentMemos', JSON.stringify(updatedMemos));
    setRecentMemos(updatedMemos);
  };

  return (
<div className="min-h-screen bg-[#f5f7f9] dark:bg-slate-950 text-[#2c2f31] dark:text-slate-200 font-body transition-colors">
      <Header />

      <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center py-12 md:py-20 mb-12">
          <div className="relative group cursor-pointer mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-[#79E5CB] rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000" />
            <button
              onClick={() => setIsModalOpen(true)}
              className="relative bg-[#79E5CB] text-white px-10 py-5 rounded-full font-headline font-bold text-xl flex items-center gap-3 shadow-xl active:scale-95 transition-all">
              <span>새 메모장 만들기</span>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
            </button>
          </div>
          <p className="text-[#595c5e] text-lg md:text-xl font-medium tracking-tight">
            가입 없이, 핀 하나로 끝내는 협업
          </p>
        </section>

        {/* Recent Memos Section */}
        {recentMemos.length > 0 ? (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-headline font-extrabold text-3xl tracking-tight flex items-center gap-3">
                최근 핀한 메모장
              </h2>
              <button className="text-[#79E5CB] font-bold flex items-center gap-1 hover:underline">
                전체보기
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentMemos.map((memo, index) => (
                <MemoCard 
                  key={index} 
                  shareKey={memo.shareKey}
                  title={memo.title} 
                  updateText={formatTimeAgo(memo.createdAt)} 
                  bgColor={memo.bgColor} 
                  pinColor={memo.pinColor} 
                  onDelete={(e) => handleDeleteMemo(e, memo.shareKey)}
                />
              ))}
            </div>
          </section>
        ) : (
          /* Empty State / Corkboard */
          <EmptyCorkboard />
        )}
      </main>

      <BottomNav />
      <DesktopFAB />

      {/* Decorative Corner Pins */}
      <div className="hidden lg:block fixed top-24 left-12 opacity-10 rotate-[-15deg] pointer-events-none">
        <span className="material-symbols-outlined text-9xl text-[#79E5CB]" style={{ fontVariationSettings: "'FILL' 1" }}>push_pin</span>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />
          <CreateBoardSection isModal onClose={() => setIsModalOpen(false)} />
        </div>
      )}
    </div>
  );
};

// --- Sub Components ---

const Header = () => (
  <header className="fixed top-0 w-full z-50 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800 shadow-sm">
    <div className="flex items-center justify-center px-6 h-full w-full max-w-7xl mx-auto">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400" style={{ fontVariationSettings: "'FILL' 1" }}>push_pin</span>
        <h1 className="text-black dark:text-white font-extrabold tracking-tight text-xl font-plus-jakarta-sans">
          Checkmate 📌
        </h1>
      </div>
    </div>
  </header>
);

const MemoCard = ({ shareKey, title, updateText, bgColor, pinColor, onDelete }) => (
  <div
    style={{ backgroundColor: bgColor }}
    onClick={() => window.location.href = `/memo/${shareKey}`}
    className="group relative rounded-xl p-8 pt-12 shadow-[0_20px_40px_-12px_rgba(0,105,71,0.1)] transition-all hover:-translate-y-2 hover:shadow-[0_30px_50px_-15px_rgba(0,105,71,0.15)] cursor-pointer"
  >
    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <span className={`material-symbols-outlined ${pinColor} text-4xl drop-shadow-md`} style={{ fontVariationSettings: "'FILL' 1" }}>push_pin</span>
    </div>
    <button 
      onClick={onDelete}
      className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 text-slate-400 hover:text-red-500 hover:bg-white transition-all shadow-sm"
    >
      <span className="material-symbols-outlined text-xl">delete</span>
    </button>
    <div className="flex flex-col h-full justify-between">
      <div>
        <h3 className="font-headline font-bold text-xl text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-500">{updateText}</p>
      </div>
      <div className="mt-8 flex justify-end">
        <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center group-hover:bg-white transition-colors">
          <span className="material-symbols-outlined text-slate-600">arrow_forward</span>
        </div>
      </div>
    </div>
  </div>
);

const CreateBoardSection = ({ isModal, onClose }) => {
  // 1. 입력값 상태 관리
  const [formData, setFormData] = useState({
    title: '',
    pin: '',
    colorCode: '#79E5CB' // 기본 컬러값
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

  // 2. 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 3. API 호출 함수
  const handleCreate = async () => {
    if (!formData.title || formData.pin.length !== 4) {
      alert("제목과 PIN 4자리를 모두 입력해 주세요!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/memos`, formData);
      
      // ApiResponse 규격에 맞춘 성공 처리 (data에 shareKey가 담겨 옴)
      if (response.data.success) {
        const createdMemo = response.data.data; // 서버에서 생성된 메모 객체 (id, shareKey 등 포함)
        const shareKey = typeof createdMemo === 'string' ? createdMemo : createdMemo.shareKey;
        
        alert("메모장이 생성되었습니다!");

        // 생성 직후 바로 인증 상태 저장 (리다이렉트 시 PIN 입력 생략)
        localStorage.setItem(`auth_${shareKey}`, 'true');

        // 로컬 스토리지에 최근 메모 저장
        const newMemo = {
          title: formData.title || "제목 없는 메모",
          shareKey: shareKey,
          createdAt: new Date().toISOString(),
          bgColor: formData.colorCode || '#E6FFFA',
          pinColor: 'text-emerald-500'
        };
        
        const savedMemos = JSON.parse(localStorage.getItem('recentMemos') || '[]');
        const updatedMemos = [newMemo, ...savedMemos.filter(m => m.shareKey !== shareKey)].slice(0, 6);
        localStorage.setItem('recentMemos', JSON.stringify(updatedMemos));
        
        window.location.href = `/memo/${shareKey}`; 
        
        if (isModal) onClose();
      }
    } catch (error) {
      console.error("생성 실패:", error);
      alert(error.response?.data?.message || "메모장 생성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const colorOptions = [
    { name: 'Mint', code: '#E6FFFA' },
    { name: 'Blue', code: '#EBF8FF' },
    { name: 'Yellow', code: '#FEFCBF' },
    { name: 'Pink', code: '#FFF5F7' },
    { name: 'Purple', code: '#FAF5FF' },
  ];

  return (
    <section className={`${isModal ? 'w-full max-w-4xl animate-in fade-in zoom-in duration-300' : 'mb-20'} bg-white/40 dark:bg-slate-900/60 backdrop-blur-md rounded-xl p-8 md:p-12 border border-white/60 dark:border-slate-700/50 shadow-xl overflow-hidden relative`}>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#79E5CB]/5 rounded-full blur-3xl" />
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {isModal && (
          <button onClick={onClose} className="absolute -top-4 -right-4 md:top-0 md:right-0 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
        <div>
          <h2 className="font-headline font-bold text-3xl mb-4">빠르게 메모 만들기</h2>
          <p className="text-[#595c5e] mb-6">제목과 4자리 비밀번호만 있으면 바로 협업을 시작할 수 있습니다.</p>
          <div className="flex items-center gap-4 text-emerald-700">
            <span className="material-symbols-outlined">security</span>
            <span className="font-medium">종단간 암호화로 안전하게 보관됩니다.</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-inner">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-[#595c5e] dark:text-slate-400">제목</label>
              <input 
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-[#f5f7f9] dark:bg-slate-900 border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#79E5CB]/20 transition-all font-medium dark:text-white" 
                placeholder="메모장의 이름을 입력하세요" 
                type="text" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-[#595c5e]">PIN (4자리)</label>
              <input 
                name="pin"
                value={formData.pin}
                onChange={handleChange}
                className="w-full bg-[#f5f7f9] dark:bg-slate-900 border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#79E5CB]/20 tracking-[1em] font-bold text-center dark:text-white" 
                maxLength="4" 
                placeholder="••••" 
                type="password" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-3 text-[#595c5e] dark:text-slate-400">배경 색상</label>
              <div className="flex gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color.code}
                    onClick={() => setFormData(prev => ({ ...prev, colorCode: color.code }))}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      formData.colorCode === color.code 
                        ? 'border-emerald-500 scale-110 shadow-md' 
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.code }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            <button 
              onClick={handleCreate}
              disabled={isLoading}
              className={`w-full ${isLoading ? 'bg-slate-300' : 'bg-[#79E5CB]'} text-white py-4 rounded-full font-bold shadow-lg active:scale-[0.98] transition-transform`}
            >
              {isLoading ? '생성 중...' : '메모 생성하기'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const EmptyCorkboard = () => (
  <section className="py-12">
    <div className="bg-[#e5e7eb] rounded-xl p-8 md:p-12 text-center border-4 border-[#e5e7eb] shadow-inner relative overflow-hidden min-h-[300px] flex flex-col items-center justify-center"
      style={{ backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      <div className="relative z-10 max-w-md mx-auto">
        <div className="bg-white/90 backdrop-blur p-6 md:p-8 rounded-lg shadow-xl inline-block rotate-[-2deg] mb-8 w-full max-w-[280px] md:max-w-md">
          <span className="material-symbols-outlined text-slate-300 text-6xl mb-4" style={{ fontVariationSettings: "'wght' 200" }}></span>
          <p className="font-headline font-bold text-slate-600 text-xl">
            아직 핀한 메모가 없어요.<br />첫 포스트잇을 붙여보세요!
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <button className="bg-white text-emerald-700 px-6 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition-shadow">방법 알아보기</button>
        </div>
      </div>
      {/* Visual fluff cards */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-[#fef9c3] rounded shadow-md opacity-30 rotate-12" />
      <div className="absolute bottom-10 right-10 w-20 h-28 bg-[#dcfce7] rounded shadow-md opacity-30 -rotate-6" />
    </div>
  </section>
);

const BottomNav = () => (
  <nav className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center px-8 py-4 bg-white/90 backdrop-blur-2xl rounded-t-xl shadow-[0_-10px_40px_-12px_rgba(0,105,71,0.15)] pb-safe">
    <button className="flex flex-col items-center justify-center bg-emerald-100 text-emerald-800 rounded-full p-4 active:scale-90 transition-all">
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
    </button>
    <button className="flex flex-col items-center justify-center text-slate-400 p-4 rounded-full active:scale-90">
      <span className="material-symbols-outlined">history</span>
    </button>
    <button className="flex flex-col items-center justify-center text-slate-400 p-4 rounded-full active:scale-90">
      <span className="material-symbols-outlined">settings</span>
    </button>
  </nav>
);

const DesktopFAB = () => (
  <div className="hidden md:flex fixed bottom-8 right-8 z-50">
    <button className="bg-[#79E5CB] text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center group active:scale-95 transition-transform">
      <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform">add</span>
    </button>
  </div>
);

export default MainPage;