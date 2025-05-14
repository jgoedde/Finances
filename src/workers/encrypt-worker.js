self.importScripts(
    "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js",
);

self.onmessage = function (e) {
    const { plaintext, key } = e.data;
    try {
        const encrypted = CryptoJS.AES.encrypt(plaintext, key).toString();
        self.postMessage({ encrypted });
    } catch (error) {
        self.postMessage({ error: error.message });
    }
};
