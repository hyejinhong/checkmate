import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PinAuthPage from './PinAuthPage';

const MemoBoardPage = () => {
    const { shareKey } = useParams();
    const navigate = useNavigate();

    const [memo, setMemo] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(false);
    const [newItem, setNewItem] = useState('');
    const [editingItemId, setEditingItemId] = useState(null);
    const [editingContent, setEditingContent] = useState('');

    // 1. 초기 인증 상태 확인
    useEffect(() => {
        const isAuth = localStorage.getItem(`auth_${shareKey}`) === 'true';
        if (isAuth) {
            console.log("isAuth", isAuth);
            setIsAuthenticated(true);
            fetchMemo();
        } else {
            setLoading(false);
        }
    }, [shareKey]);

    // 2. 데이터 가져오기
    const fetchMemo = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/memos/${shareKey}`);
            if (response.data.success) {
                setMemo(response.data.data);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error("데이터 로드 실패:", error);
            if (error.response?.status === 403 || error.response?.status === 401) {
                setIsAuthenticated(false);
                localStorage.removeItem(`auth_${shareKey}`);
            }
        } finally {
            setLoading(false);
        }
    };

    // 3. PIN 검증
    const handleVerifyPin = async (inputPin) => {
        setAuthError(false);
        try {
            const response = await axios.post(`http://localhost:8080/api/memos/${shareKey}/verify`, { pin: inputPin });
            if (response.data.success) {
                localStorage.setItem(`auth_${shareKey}`, 'true');
                setIsAuthenticated(true);

                // 최근 메모 목록 업데이트 (MainPage와 동일한 로직)
                const memoData = response.data.data;
                const newMemoEntry = {
                    title: memoData.title,
                    shareKey: shareKey,
                    createdAt: memoData.createdAt || new Date().toISOString(),
                    bgColor: memoData.colorCode,
                    pinColor: 'text-emerald-500'
                };

                const savedMemos = JSON.parse(localStorage.getItem('recentMemos') || '[]');
                const updatedMemos = [newMemoEntry, ...savedMemos.filter(m => m.shareKey !== shareKey)].slice(0, 6);
                localStorage.setItem('recentMemos', JSON.stringify(updatedMemos));

                fetchMemo();
            }
        } catch (err) {
            setAuthError(true);
        }
    };

    // 4. 할 일 추가
    const handleAddItem = async () => {
        if (!newItem.trim()) return;

        try {
            // 1. 백엔드 API 호출
            const response = await axios.post(`http://localhost:8080/api/memos/${shareKey}/items`, {
                content: newItem
            });

            if (response.data.success) {
                // 2. 서버에서 받은 실제 데이터를 리스트에 추가
                const addedItem = response.data.data;
                setMemo(prev => ({
                    ...prev,
                    items: [...(prev.items || []), addedItem]
                }));

                // 3. 입력창 비우기
                setNewItem('');
            }
        } catch (error) {
            console.error("아이템 추가 실패:", error);
            alert("할 일을 추가하지 못했습니다. 다시 시도해 주세요.");
        }
    };

    // 1. 상태 토글 핸들러
    const handleToggleItem = async (itemId) => {
        try {
            await axios.patch(`http://localhost:8080/api/memos/${shareKey}/items/${itemId}/toggle`);
            // 로컬 상태 업데이트
            setMemo(prev => ({
                ...prev,
                items: prev.items.map(item =>
                    item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
                )
            }));
        } catch (err) {
            alert("상태 변경에 실패했습니다.");
        }
    };

    // 2. 삭제 핸들러
    const handleDeleteItem = async (itemId) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        try {
            await axios.delete(`http://localhost:8080/api/memos/${shareKey}/items/${itemId}`);
            // 로컬 상태에서 제거
            setMemo(prev => ({
                ...prev,
                items: prev.items.filter(item => item.id !== itemId)
            }));
        } catch (err) {
            alert("삭제에 실패했습니다.");
        }
    };

    // 3. 수정 모드 진입
    const handleStartEdit = (item) => {
        setEditingItemId(item.id);
        setEditingContent(item.content);
    };

    // 4. 수정 완료 (저장)
    const handleUpdateItem = async (itemId) => {
        if (!editingContent.trim()) return;
        try {
            const response = await axios.put(`http://localhost:8080/api/memos/${shareKey}/items/${itemId}`, {
                content: editingContent
            });
            
            if (response.data.success) {
                setMemo(prev => ({
                    ...prev,
                    items: prev.items.map(item =>
                        item.id === itemId ? { ...item, content: editingContent } : item
                    )
                }));
                setEditingItemId(null);
            }
        } catch (err) {
            console.error("수정 실패:", err);
            alert("수정에 실패했습니다.");
        }
    };

    // --- 렌더링 조건 처리 ---
    if (loading && !memo) {
        return (
            <div className="min-h-screen flex items-center justify-center font-headline text-emerald-800 bg-[#f5f7f9]">
                보드를 가져오는 중... 📌
            </div>
        );
    }

    if (!isAuthenticated) {
        return <PinAuthPage onVerify={handleVerifyPin} error={authError} />;
    }

    return (
        <div className="font-body text-slate-900 corkboard-bg min-h-screen">
            {/* TopAppBar */}
            <header className="fixed top-0 w-full z-50 px-6 py-4 bg-emerald-50/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-b-[3rem] shadow-[0_20px_40px_-12px_rgba(121,229,203,0.1)]">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-emerald-800 dark:text-emerald-400" style={{ fontVariationSettings: "'FILL' 0" }}>push_pin</span>
                        <span className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 font-headline tracking-tight">MemoBoard</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-8 mr-8 text-emerald-900/60 dark:text-emerald-100/60 font-semibold">
                            <span className="text-emerald-900 dark:text-emerald-100 cursor-pointer hover:scale-105 transition-all">Board</span>
                            <span className="cursor-pointer hover:scale-105 transition-all">Tasks</span>
                            <span className="cursor-pointer hover:scale-105 transition-all">Settings</span>
                        </div>
                        <div className="w-10 h-10 rounded-full border-2 border-[#79E5CB] overflow-hidden bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                            CM
                        </div>
                    </div>
                </div>
            </header>

            <main className="pt-28 pb-32 px-4 flex justify-start md:justify-center min-h-[calc(100vh-80px)]">
                {/* Giant Post-it */}
                <div
                    className="relative w-full max-w-5xl mx-auto paper-texture rounded-xl shadow-[0_40px_80px_-20px_rgba(0,105,71,0.15)] flex flex-col min-h-[663px] p-8 md:p-16 border border-white/20 transition-colors duration-500"
                    style={{
                        backgroundColor: memo?.colorCode,
                        '--tw-bg-opacity': '1'
                    }}
                >
                    <div className="absolute inset-0 bg-black/40 dark:block hidden rounded-xl pointer-events-none"></div>
                    {/* Pin Icon */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 drop-shadow-md">
                        <span className="material-symbols-outlined text-5xl text-red-600" style={{ fontVariationSettings: "'FILL' 1" }}>push_pin</span>
                    </div>

                    {/* Top Header & Collaborators */}
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start text-left gap-6 mb-12">
                        <h1
                            className="text-5xl md:text-6xl text-black dark:text-slate-200 leading-tight max-w-2xl"
                        >
                            {memo?.title}
                        </h1>
                        <div className="flex -space-x-3 overflow-hidden ml-auto">
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-100 ring-4 ring-white/50 text-emerald-800 text-xs font-bold shadow-sm">
                                ME
                            </div>
                        </div>
                    </div>

                    {/* Task List (Dynamic) */}
                    <div className="flex-grow space-y-4 mb-8 text-left">
                        {memo?.items && memo.items.length > 0 ? (
                            memo.items.map((item) => (
                                <div key={item.id} className="flex items-center group py-2 justify-start">
                                    {/* 체크박스: 클릭 시 토글 로직 연결 */}
                                    <div
                                        onClick={() => handleToggleItem(item.id)}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center mr-4 cursor-pointer shadow-sm transition-all ${item.isCompleted ? 'bg-emerald-500' : 'border-2 border-emerald-300 hover:border-emerald-500'
                                            }`}
                                    >
                                        {item.isCompleted && (
                                            <span className="material-symbols-outlined text-white text-xl">check</span>
                                        )}
                                    </div>

                                    {/* 내용 영역: 완료 시 취소선 처리 */}
                                    {editingItemId === item.id ? (
                                        <input
                                            autoFocus
                                            className="text-xl md:text-2xl flex-grow font-medium bg-white/50 border-b-2 border-emerald-400 focus:outline-none"
                                            value={editingContent}
                                            onChange={(e) => setEditingContent(e.target.value)}
                                            onBlur={() => handleUpdateItem(item.id)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleUpdateItem(item.id)}
                                        />
                                    ) : (
                                        <span 
                                            onClick={() => handleStartEdit(item)}
                                            className={`text-xl md:text-2xl flex-grow font-medium transition-all cursor-text ${
                                                item.isCompleted ? 'line-through text-slate-400 decoration-slate-400 decoration-2' : 'text-slate-800'
                                            }`}
                                        >
                                            {item.content}
                                        </span>
                                    )}

                                    {/* 수정/삭제 버튼: 모바일은 항상 표시, 데스크탑은 호버 시 표시 */}
                                    <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleStartEdit(item)}
                                            className="text-slate-400 hover:text-emerald-600 transition-colors"
                                            title="수정"
                                        >
                                            <span className="material-symbols-outlined text-xl">edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteItem(item.id)}
                                            className="text-slate-400 hover:text-red-500 transition-colors"
                                            title="삭제"
                                        >
                                            <span className="material-symbols-outlined text-xl">delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            /* 할 일이 없는 경우 (Empty State) */
                            <div
                                className="text-center py-20 text-slate-400 font-medium text-2xl tracking-tight"
                            >
                                아직 등록된 할 일이 없어요.<br />아래에서 할 일을 적어보세요! ✏️
                            </div>
                        )}
                    </div>
                    {/* Bottom Input Field */}
                    <div className="relative z-10 mt-auto">
                        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-2 flex items-center shadow-inner border border-white/40">
                            <input
                                className="flex-grow bg-transparent border-none focus:ring-0 text-lg px-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-medium"
                                placeholder="여기에 할 일을 추가하세요..."
                                type="text"
                                value={newItem}
                                onChange={(e) => setNewItem(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                            />
                            <button
                                onClick={handleAddItem}
                                className="bg-[#79E5CB] hover:bg-[#68d4b9] text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-all duration-200"
                            >
                                <span className="material-symbols-outlined text-2xl">add</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* BottomNavBar (Mobile Only) */}
            <nav className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-2xl rounded-t-[3rem] shadow-[0_-10px_30px_-5px_rgba(121,229,203,0.1)]">
                <div className="flex flex-col items-center justify-center text-emerald-900 dark:text-emerald-100">
                    <span className="material-symbols-outlined">dashboard</span>
                    <span className="text-xs font-semibold">Board</span>
                </div>
                <div className="flex flex-col items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined">settings</span>
                    <span className="text-xs font-semibold">Settings</span>
                </div>
            </nav>
        </div>
    );
};

export default MemoBoardPage;