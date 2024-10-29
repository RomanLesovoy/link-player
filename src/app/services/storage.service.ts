/// <reference types="chrome"/>

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  async saveData(key: string, data: any): Promise<void> {
    await chrome.storage.sync.set({ [key]: data });
  }

  async getData<T>(key: string): Promise<T> {
    const result = await chrome.storage.sync.get(key);
    return result[key];
  }
}
