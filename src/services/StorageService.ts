import crypto from "node:crypto"

import { nanoid } from "nanoid"

const getHashInput = () => {
  localStorage.setItem("", localStorage.getItem("") ?? nanoid())
  return localStorage.getItem("")!
}

export class StorageService {
  private static IV = Buffer.from([12, 13, 14, 15, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])

  private static KEY = crypto.createHash("md5").update(getHashInput()).digest()

  static encrypt(input: string) {
    if (!StorageService.KEY) return input

    const cipher = crypto.createCipheriv("aes-128-cbc", StorageService.KEY, StorageService.IV)
    return cipher.update(input, "utf8", "hex") + cipher.final("hex")
  }

  static decrypt(input: string) {
    if (!StorageService.KEY) return input

    const decipher = crypto.createDecipheriv("aes-128-cbc", StorageService.KEY, StorageService.IV)
    return decipher.update(input, "hex", "utf8") + decipher.final("utf8")
  }

  static set(key: string, value: unknown) {
    if (typeof window === "undefined") return

    const encryptedKey = StorageService.encrypt(key)
    const encryptedValue = StorageService.encrypt(JSON.stringify(value))
    return localStorage.setItem(encryptedKey, encryptedValue)
  }

  static get<T = unknown>(key: string): T | undefined {
    if (typeof window === "undefined") return

    const encryptedKey = StorageService.encrypt(key)
    const encryptedValue = localStorage.getItem(encryptedKey)
    if (!encryptedValue) return undefined

    return JSON.parse(StorageService.decrypt(encryptedValue)) as T
  }

  static remove(key: string) {
    if (typeof window === "undefined") return

    localStorage.removeItem(StorageService.encrypt(key))
  }

  static clear() {
    if (typeof window === "undefined") return

    localStorage.clear()
  }

  static listen(callback: (key: string | undefined, value: unknown) => void) {
    if (typeof window === "undefined") return

    const _callback = (event: StorageEvent) => {
      const decryptedKey = event.key ? StorageService.decrypt(event.key) : undefined
      const decryptedValue = event.newValue ? JSON.parse(StorageService.decrypt(event.newValue)) : undefined
      callback(decryptedKey, decryptedValue)
    }

    window.addEventListener("storage", _callback)

    return () => window.removeEventListener("storage", _callback)
  }
}
