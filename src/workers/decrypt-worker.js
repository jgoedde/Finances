self.importScripts(
    "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js",
);

self.onmessage = function (e) {
    const { ciphertext, key } = e.data;
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, key);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        self.postMessage({ decrypted });
    } catch (error) {
        self.postMessage({ error: error.message });
    }
};
