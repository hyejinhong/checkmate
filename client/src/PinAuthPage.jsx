import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const PinAuthPage = ({ onVerify, error }) => {
  const [pin, setPin] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // 화면 어디를 눌러도 입력창에 포커스가 가도록 설정
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  // 에러 발생 시 입력된 PIN 초기화
  useEffect(() => {
    if (error) {
      setPin('');
    }
  }, [error]);

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 입력
    if (value.length <= 4) {
      setPin(value);
    }
  };

  const handleSubmit = () => {
    if (pin.length === 4) {
      onVerify(pin);
    }
  };

  // 엔터 키 지원
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && pin.length === 4) {
      handleSubmit();
    }
  };

  return (
    <div 
      className="corkboard-pattern font-body text-[#2c2f31] min-h-screen flex flex-col items-center"
      onClick={handleContainerClick}
    >
      {/* 실제 입력은 숨겨진 input에서 처리 */}
      <input
        ref={inputRef}
        type="password"
        pattern="\d*"
        inputMode="numeric"
        value={pin}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="absolute opacity-0 pointer-events-none"
        autoFocus
      />

      {/* TopAppBar */}
      <header className="flex items-center justify-between px-6 py-4 w-full bg-[#f5f7f9] dark:bg-slate-900 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="hover:opacity-80 transition-opacity scale-95 active:duration-100 text-[#006947] flex items-center"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        </div>
        <h1 className="font-headline font-bold tracking-tight text-[#006947]">Enter Access PIN</h1>
        <div className="flex items-center gap-4">
          <button className="hover:opacity-80 transition-opacity scale-95 active:duration-100 text-[#006947] flex items-center">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-1 flex flex-col items-center justify-center w-full px-6 py-12">
        {/* Post-it Container */}
        <div className="relative w-full max-w-md transform rotate-[-1deg]">
          
          {/* Signature Pushpin */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
            <div className="w-12 h-12 bg-[#b31b25] rounded-full flex items-center justify-center shadow-lg border-4 border-white/20 transform hover:scale-110 transition-transform cursor-default">
              <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>push_pin</span>
            </div>
            <div className="w-2 h-2 bg-black/20 rounded-full mt-1 blur-[1px]"></div>
          </div>

          {/* The Memo Card */}
          <div className="bg-[#fffdf0] rounded-xl px-10 pt-16 pb-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)] flex flex-col items-center text-center border border-yellow-100/50">
            <h2 className="font-headline font-extrabold text-3xl text-[#2c2f31] mb-4 tracking-tight">비밀번호 입력</h2>
            <p className="font-body text-[#595c5e] leading-relaxed mb-10 max-w-[280px]">초대받은 메모에 입장하려면 PIN 4자리를 입력하세요</p>
            
            {/* PIN Input Group (Visual) */}
            <div className="flex gap-4 mb-8">
              {[0, 1, 2, 3].map((index) => (
                <div 
                  key={index}
                  className={`w-14 h-14 bg-white rounded-2xl flex items-center justify-center border-4 transition-all shadow-sm ${
                    pin.length === index ? 'border-[#79E5CB]' : 'border-transparent'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    index < pin.length ? 'bg-[#2c2f31] scale-100' : 'bg-[#2c2f31]/10 scale-90'
                  }`}></div>
                </div>
              ))}
            </div>

            {/* Error Message */}
            <div className="h-6 mb-8">
              <p className={`text-[#b31b25] font-semibold text-sm transition-opacity duration-300 ${error ? 'opacity-100' : 'opacity-0'}`}>
                PIN이 일치하지 않습니다
              </p>
            </div>

            {/* Enter Button */}
            <button 
              onClick={handleSubmit}
              disabled={pin.length !== 4}
              className={`w-full py-5 rounded-full text-white font-headline font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 
                ${pin.length === 4 
                  ? 'bg-[#79E5CB] hover:bg-[#68d4b9] hover:scale-[1.02] active:scale-95' 
                  : 'bg-slate-300 cursor-not-allowed opacity-70'}`}
            >
              입장하기
              <span className="material-symbols-outlined text-xl">login</span>
            </button>
          </div>

          {/* Decorative Note Behind */}
          <div className="absolute -z-10 top-4 -right-4 w-full h-full bg-[#bae6fd] rounded-xl rotate-[3deg] opacity-30"></div>
        </div>

        {/* Additional Information */}
        <div className="mt-16 text-center max-w-sm">
          <div className="flex items-center justify-center gap-2 mb-4 text-[#79E5CB] font-bold">
            <span className="material-symbols-outlined text-lg">shield</span>
            <span className="font-label text-sm uppercase tracking-wider">End-to-end Encrypted</span>
          </div>
          <p className="text-[#595c5e] text-xs leading-relaxed">
            Checkmate board access is protected with AES-256 encryption. Your PIN is never stored in plain text on our servers.
          </p>
        </div>
      </main>
    </div>
  );
};

export default PinAuthPage;