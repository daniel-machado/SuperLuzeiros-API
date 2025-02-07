import { createHmac } from 'crypto';
import { hash, compare } from 'bcrypt';

export interface IHashingService {
    hash(value: string, saltValue: number): Promise<string>;
    compare(value: string, hashedValue: string): Promise<boolean>;
    hmac(value: string, key: string): string;
}

export const hashingService: IHashingService = {
    /**
     * Hashes a value using bcrypt.
     * @param value - The value to hash.
     * @param saltValue - The salt rounds for bcrypt.
     * @returns A promise that resolves to the hashed value.
     */
    async hash(value: string, saltValue: number): Promise<string> {
        return await hash(value, saltValue);
    },

    /**
     * Validates a value against a hashed value using bcrypt.
     * @param value - The plain text value.
     * @param hashedValue - The hashed value to compare against.
     * @returns A promise that resolves to a boolean indicating if the value matches the hash.
     */
    async compare(value: string, hashedValue: string): Promise<boolean> {
        return await compare(value, hashedValue);
    },

    /**
     * Generates an HMAC hash using SHA-256.
     * @param value - The value to hash.
     * @param key - The secret key for the HMAC process.
     * @returns The HMAC hash as a hexadecimal string.
     */
    hmac(value: string, key: string): string {
        return createHmac('sha256', key).update(value).digest('hex');
    },
};

