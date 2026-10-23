// src/saveSystem.js - LocalStorage Persistence for Delhi Auto Life Simulator

const SAVE_KEY = 'delhi_auto_simulator_save_v1';

export class SaveSystem {
  static getDefaultData() {
    return {
      cash: 450,
      currentMissionIndex: 0,
      fuel: 85,
      characterMode: 'HARSH',
      tripsCompleted: 0,
      dayNumber: 1,
      timeOfDay: 8.5, // 8:30 AM
      unlockedFastTravel: false,
      hasSavedGame: false
    };
  }

  static load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return this.getDefaultData();
      const parsed = JSON.parse(raw);
      return { ...this.getDefaultData(), ...parsed, hasSavedGame: true };
    } catch (e) {
      console.warn('Could not read save data from LocalStorage:', e);
      return this.getDefaultData();
    }
  }

  static save(data) {
    try {
      const current = this.load();
      const updated = { ...current, ...data, hasSavedGame: true };
      localStorage.setItem(SAVE_KEY, JSON.stringify(updated));
      return true;
    } catch (e) {
      console.warn('Could not save data:', e);
      return false;
    }
  }

  static reset() {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (_) {}
    return this.getDefaultData();
  }
}
