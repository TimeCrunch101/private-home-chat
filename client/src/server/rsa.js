import NodeRSA from "node-rsa";
import fs from "node:fs/promises";

export class HomeRSA {
    constructor() {
        this.key = new NodeRSA({ b: 512 });
        this.ready = false;
    }

    async initialize() {
        try {
            const keysExist = await this.checkIfKeypairExists();
            if (keysExist) {
                console.info("RSA Keys Exist, importing...");
                await this.importKeys();
            } else {
                console.warn("RSA Keys not found, generating new keys...");
                await this.generateAndSaveKeys();
            }
            this.ready = true;
        } catch (err) {
            console.error("Error during initialization:", err.message);
        }
    }

    async checkIfKeypairExists() {
        try {
            await fs.access("./priv.pem", fs.constants.R_OK);
            await fs.access("./pub.pem", fs.constants.R_OK);
            return true;
        } catch {
            return false;
        }
    }

    async importKeys() {
        const priv = await fs.readFile("./priv.pem", { encoding: "utf8" });
        const pub = await fs.readFile("./pub.pem", { encoding: "utf8" });
        this.key.importKey(priv, "pkcs1-private-pem");
        this.key.importKey(pub, "pkcs1-public-pem");
    }

    async generateAndSaveKeys() {
        this.key.generateKeyPair();
        const priv = this.key.exportKey("pkcs1-private-pem");
        const pub = this.key.exportKey("pkcs1-public-pem");
        await fs.writeFile("/priv.pem", priv, { encoding: "utf8" });
        await fs.writeFile("/pub.pem", pub, { encoding: "utf8" });
    }

    encrypt(msg) {
        if (!this.ready) {
            throw new Error("Keys are not ready. Please wait until initialization completes.");
        }
        return this.key.encrypt(msg, "base64");
    }

    decrypt(msg) {
        if (!this.ready) {
            throw new Error("Keys are not ready. Please wait until initialization completes.");
        }
        return this.key.decrypt(msg, "utf8");
    }
}

// const test = new HomeRSA()
// await test.initialize()


