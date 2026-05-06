import CryptoJS from 'crypto-js';

// 1. PIN을 기반으로 암호화 키 생성 (PBKDF2)
export const deriveKey = (pin, salt = 'checkmate-fixed-salt') => {
    return CryptoJS.PBKDF2(pin, salt, {
        keySize: 256 / 32,
        iterations: 1000
    }).toString();
};

// 2. 데이터 암호화
export const encryptData = (text, key) => {
    if (!text || !key) return text;
    return CryptoJS.AES.encrypt(text, key).toString();
};

// 3. 데이터 복호화
export const decryptData = (cipherText, key) => {
    if (!cipherText || !key) return cipherText;
    try {
        const bytes = CryptoJS.AES.decrypt(cipherText, key);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (err) {
        return "🔒 암호화된 메시지"; // 복호화 실패 시
    }
};