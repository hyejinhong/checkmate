const FRUITS = [
    { name: '사과', emoji: '🍎', color: '#FFB1B1' },
    { name: '바나나', emoji: '🍌', color: '#FDE68A' },
    { name: '포도', emoji: '🍇', color: '#E9D5FF' },
    { name: '딸기', emoji: '🍓', color: '#FDA4AF' },
    { name: '오렌지', emoji: '🍊', color: '#FB923C' },
    { name: '복숭아', emoji: '🍑', color: '#FECACA' },
    { name: '수박', emoji: '🍉', color: '#86EFAC' },
    { name: '멜론', emoji: '🍈', color: '#BBF7D0' },
];

export const getMyProfile = () => {
    // 1. 기존에 저장된 프로필이 있는지 확인
    let profile = JSON.parse(localStorage.getItem('checkmate_user_profile'));

    if (!profile) {
        // 2. 없으면 랜덤 과일 선택 및 UUID 생성
        const randomFruit = FRUITS[Math.floor(Math.random() * FRUITS.length)];
        profile = {
            viewerId: crypto.randomUUID(),
            nickname: randomFruit.name,
            emoji: randomFruit.emoji,
            color: randomFruit.color
        };
        localStorage.setItem('checkmate_user_profile', JSON.stringify(profile));
    }
    return profile;
};