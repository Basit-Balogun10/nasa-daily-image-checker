import crypto from "crypto";

const initVector = process.env.INIT_VECTOR || "a";
const secretKey = process.env.SECRET_KEY || "a";
const algorithm = process.env.ENCRYPTION_ALGORITHM || "a";
const charEncoding = process.env.CHARACTER_ENCODING || "a";

console.log(
    initVector,
    secretKey,
    algorithm,
    charEncoding,
    "ISAC ---------------"
);

if (!initVector || !secretKey || !algorithm || !charEncoding) {
    throw new Error(
        "initVector, secretKey, algorithm and charEncoding are all required"
    );
}

export const encryptData = (data: string) => {
    const cipher = crypto.createCipheriv(
        algorithm,
        Buffer.from(secretKey, "hex"),
        Buffer.from(initVector, "hex")
    );
    const encryptedData =
        cipher.update(data, "utf-8", "hex") + cipher.final("hex");

    return encryptedData;
};

export const decryptData = (encryptedData: string) => {
    const decipher = crypto.createDecipheriv(
        algorithm,
        Buffer.from(secretKey, "hex"),
        Buffer.from(initVector, "hex")
    );
    const decryptedData =
        decipher.update(encryptedData, "hex", "utf-8") +
        decipher.final("utf-8");

    return decryptedData;
};

export const decryptState = (encryptedState: string) => {
    const rawState = decryptData(encryptedState);
    // const state = decodeURI(rawState).split(',')[0]
    const isSignup = JSON.parse(decodeURI(rawState).split(",")[1]);

    return { isSignup };
};
