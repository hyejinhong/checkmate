export const FRUITS = [
    { name: '사과', emoji: '🍎', color: '#FFB1B1' },
    { name: '바나나', emoji: '🍌', color: '#FDE68A' },
    { name: '포도', emoji: '🍇', color: '#E9D5FF' },
    { name: '딸기', emoji: '🍓', color: '#FDA4AF' },
    { name: '오렌지', emoji: '🍊', color: '#FB923C' },
    { name: '복숭아', emoji: '🍑', color: '#FECACA' },
    { name: '수박', emoji: '🍉', color: '#86EFAC' },
    { name: '멜론', emoji: '🍈', color: '#BBF7D0' },
    { name: '파인애플', emoji: '🍍', color: '#FEF08A' },
    { name: '체리', emoji: '🍒', color: '#FCA5A5' },
    { name: '블루베리', emoji: '🫐', color: '#BFDBFE' },
    { name: '키위', emoji: '🥝', color: '#D9F99D' },
    { name: '망고', emoji: '🥭', color: '#FDE047' },
    { name: '레몬', emoji: '🍋', color: '#FFF59D' },
    { name: '배', emoji: '🍐', color: '#ECFCCB' },
    { name: '아보카도', emoji: '🥑', color: '#D1FAE5' },
    { name: '코코넛', emoji: '🥥', color: '#F3F4F6' },
    { name: '청사과', emoji: '🍏', color: '#DCFCE7' },
];

export const getMyProfile = (shareKey) => {
    const storageKey = shareKey ? `checkmate_user_profile_${shareKey}` : 'checkmate_user_profile';
    
    const profile = JSON.parse(localStorage.getItem(storageKey));

    if (!profile) {
        const randomFruit = FRUITS[Math.floor(Math.random() * FRUITS.length)];
        return {
            viewerId: crypto.randomUUID(),
            nickname: randomFruit.name,
            emoji: randomFruit.emoji,
            color: randomFruit.color,
            isSet: false // 아직 설정되지 않은 임시 프로필임을 명시
        };
    }
    return profile;
};