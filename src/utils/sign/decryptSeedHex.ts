import { ec as EC } from "elliptic";
import sha256 from "sha256"
import { createDecipher, randomBytes } from "crypto";

function seedHexEncryptionKey(hostEncryptionKey: string) {
    let encryptionKey = hostEncryptionKey;

    if (!encryptionKey || encryptionKey.length !== 64) {
        throw new Error(
            "Failed to load or generate encryption key; this should never happen"
        );
    }

    return encryptionKey;
}

export const decryptSeedHex = (encryptedSeedHex: string, hostEncryptionKey: string) => {
    const encryptionKey = seedHexEncryptionKey(hostEncryptionKey);
    const decipher = createDecipher(
        "aes-256-cbc",
        encryptionKey,
    );
    return decipher.update(Buffer.from(encryptedSeedHex, "hex")).toString();
};