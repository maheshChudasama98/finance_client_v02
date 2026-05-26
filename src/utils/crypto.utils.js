import { cryptoSecureKey } from 'src/constance';

import CryptoJS from 'crypto-js';

const secretKey = cryptoSecureKey;

// For CRA:
// const secretKey = process.env.REACT_APP_CRYPTO_SECURE_KEY;
export const encrypt = (data) => CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();

export const decrypt = (cipherText) => {
  try {
    if (!cipherText) return null;

    const bytes = CryptoJS.AES.decrypt(cipherText, cryptoSecureKey);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedText) {
      throw new Error('Failed to decrypt data');
    }

    return JSON.parse(decryptedText);
  } catch (error) {
    console.error('Decrypt Error:', error);
    return null;
  }
};
