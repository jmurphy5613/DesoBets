import { signTransaction } from "./signTransaction";
import { decryptSeedHex } from "./decryptSeedHex";

export const signHex = async (transactionHex: string, encryptedSeedHex: string, hostEncryptionKey: string) => {
    //Decrypt seed hex and use decrypted seed hex to sign transaction
    const seedHex = decryptSeedHex(encryptedSeedHex, hostEncryptionKey);
    let signedHex = signTransaction(seedHex, transactionHex);

    return signedHex;
};