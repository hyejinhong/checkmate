import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FRUITS } from '../utils/presence';

const ProfileSetupModal = ({ onComplete }) => {
  const [nickname, setNickname] = useState('');
  const { shareKey } = useParams();
  const [selectedAvatar, setSelectedAvatar] = useState(FRUITS[0]); // 기본값: 사과

  const handleJoin = () => {
    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요!');
      return;
    }

    // 로컬스토리지에 유저 정보 저장
    const userInfo = {
      viewerId: crypto.randomUUID(),
      nickname: nickname.trim(),
      emoji: selectedAvatar.emoji,
      color: selectedAvatar.color,
      avatar: selectedAvatar, // UI 호환성을 위해 유지
      isSet: true,
    };
    
    localStorage.setItem(`checkmate_user_profile_${shareKey}`, JSON.stringify(userInfo));
    
    // 부모 컴포넌트에 완료 알림
    onComplete(userInfo);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col items-center p-10 md:p-14 relative border border-white/20">
        
        {/* 타이틀 */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-headline font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
            프로필 설정 <span className="filter drop-shadow-md">📌</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">메모에서 사용할 아바타와 닉네임을 설정하세요</p>
        </div>

        {/* 아바타 선택 그리드 */}
        <div className="grid grid-cols-6 gap-3 md:gap-4 mb-10 w-full">
          {FRUITS.map((fruit) => (
            <button
              key={fruit.name}
              onClick={() => setSelectedAvatar(fruit)}
              className={`aspect-square rounded-full flex items-center justify-center text-2xl transition-all duration-200 hover:scale-110 active:scale-95 border-4 ${
                selectedAvatar.name === fruit.name ? 'border-[#79E5CB] scale-110 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
              style={{ backgroundColor: fruit.color }}
            >
              {fruit.emoji}
            </button>
          ))}
        </div>

        {/* 닉네임 입력 */}
        <div className="w-full space-y-2 mb-10">
          <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 ml-2" htmlFor="nickname">
            닉네임
          </label>
          <input
            id="nickname"
            type="text"
            className="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-2xl px-6 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-[#79E5CB]/50 transition-all font-medium"
            placeholder="닉네임을 입력하세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
          />
        </div>

        {/* 입장 버튼 */}
        <button
          onClick={handleJoin}
          className="w-full py-5 rounded-full text-[#00452d] font-headline font-bold text-lg tracking-wide transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#79E5CB]/30"
          style={{ backgroundColor: '#79E5CB' }}
        >
          메모 입장하기
        </button>
      </div>
    </div>
  );
};

export default ProfileSetupModal;