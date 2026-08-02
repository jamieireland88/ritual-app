import { EventEmitter, Injectable, Output } from '@angular/core';
import { Ritual, Profile, RitualType } from '../models/models';
import { Daily } from '../models/raw-models';
import { environment } from '../../environment';
import {
  getFirestore, getDocs, collection,
  Firestore, addDoc, DocumentReference,
  serverTimestamp, where, query, Timestamp,
  orderBy, deleteDoc, doc, writeBatch,
  runTransaction, updateDoc
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { DateTime, Interval } from 'luxon';
import { CapacitorPersistentAccount } from '@capgo/capacitor-persistent-account';
import { v4 as uuidv4 } from 'uuid';

export interface UserData {
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class RitualService {
  @Output() ritualUpdated = new EventEmitter();

  private db!: Firestore;

  /**
   * Resolves once, before any Firestore operation. The persistent-account
   * plugin uses Keychain on iOS and AccountManager on Android, so this value
   * remains available after the app is removed and reinstalled.
   */
  private readonly accountId: Promise<string>;

  constructor() {
    this.initFirebase();
    this.accountId = this.initialiseDeviceAccount();
  }

  public async initFirebase(): Promise<void> {
    const app = initializeApp(environment.firebaseConfig);
    this.db = getFirestore(app);
  }

  public async getRituals(): Promise<Ritual[]> {
    const rituals: Ritual[] = [];
    const q = query(collection(this.db, 'User', await this.getUserId(), 'rituals'), orderBy('sortOrder'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((snapshot) => {
      const totalDays = this.calculateDays((snapshot.get('created') as Timestamp).toDate(), new Date());
      rituals.push({
        id: snapshot.id,
        icon: snapshot.get('icon'),
        name: snapshot.get('name'),
        streak: snapshot.get('currentStreak') || 0,
        longestStreak: snapshot.get('longestStreak') || 0,
        remindTime: Math.random() < 0.5 ? new Date() : null,
        created: (snapshot.get('created') as Timestamp).toDate(),
        actioned: this.lastCheckinMatchesDate(
          snapshot.get('lastCheckin') ? (snapshot.get('lastCheckin') as Timestamp).toDate() : undefined
        ),
        type: snapshot.get('type') || RitualType.Daily,
        totalComplete: snapshot.get('totalComplete') || 0,
        lastCheckin: snapshot.get('lastCheckin') ? (snapshot.get('lastCheckin') as Timestamp).toDate() : undefined,
        totalDays,
        completion: (snapshot.get('totalComplete') || 0) / totalDays
      } as Ritual);
    });
    return rituals;
  }

  public async createRitual(name: string, type: RitualType, icon?: string): Promise<DocumentReference> {
    return addDoc(collection(this.db, 'User', await this.getUserId(), 'rituals'), {
      name, icon, type,
      longestStreak: 0,
      currentStreak: 0,
      sortOrder: 0,
      created: new Date(),
      updated: new Date(),
    });
  }

  public async updateRitual(ritualId: string, name: string, type: RitualType, icon?: string): Promise<void> {
    return updateDoc(doc(this.db, 'User', await this.getUserId(), 'rituals', ritualId), {
      name, icon, type, updated: new Date(),
    }).finally(() => this.ritualUpdated.emit());
  }

  public async getProfile(): Promise<Profile | null> {
    const querySnapshot = await getDocs(collection(this.db, 'User', await this.getUserId(), 'user_profile'));
    if (!querySnapshot.docs.length) return null;

    return {
      id: querySnapshot.docs[0]?.id,
      notificationSettings: querySnapshot.docs[0]?.get('notificationSettings'),
      accountType: querySnapshot.docs[0]?.get('accountType'),
      created: (querySnapshot.docs[0]?.get('created') as Timestamp).toDate()
    } as Profile;
  }

  public async getDailyCheckIn(ritualId: string): Promise<Daily | null> {
    const startOfDay = new Date(new Date().setHours(0, 0, 0));
    const endOfDay = new Date(new Date().setHours(23, 59, 59));
    const q = query(
      collection(this.db, 'User', await this.getUserId(), 'rituals', ritualId, 'checkins'),
      where('created', '>=', Timestamp.fromDate(startOfDay)),
      where('created', '<=', Timestamp.fromDate(endOfDay)),
    );
    const querySnapshot = await getDocs(q);
    const daily: Daily = { id: '', created: null };
    querySnapshot.forEach((snapshot) => {
      daily.id = snapshot.id;
      daily.created = (snapshot.get('created') as Timestamp).toDate();
    });
    return daily;
  }

  public async createCheckIn(ritualId: string): Promise<DocumentReference> {
    const userId = await this.getUserId();
    await runTransaction(this.db, async (transaction) => {
      const docRef = doc(this.db, 'User', userId, 'rituals', ritualId);
      const document = await transaction.get(docRef);
      if (!document.exists()) throw new Error('Document does not exist.');

      let currentStreak = 0;
      let longestStreak = document.data()['longestStreak'];
      const lastCheckin = document.data()['lastCheckin'];
      if (!lastCheckin || this.lastCheckinMatchesDate(lastCheckin.toDate(), this.yesterday)) {
        currentStreak = (document.data()['currentStreak'] || 0) + 1;
        longestStreak = Math.max(longestStreak + 1, currentStreak);
      }
      const totalComplete = (document.data()['totalComplete'] || 0) + 1;
      transaction.update(docRef, { currentStreak, longestStreak, totalComplete, lastCheckin: new Date() });
    });
    return addDoc(collection(this.db, 'User', userId, 'rituals', ritualId, 'checkins'), {
      created: serverTimestamp(),
    });
  }

  public async getMonthlyCheckIns(ritualId: string, date: Date): Promise<Daily[]> {
    const startOfMonth = new Date(new Date(new Date(date.getTime()).setDate(1)).setHours(0)).setMinutes(0);
    const endOfMonth = new Date(new Date(new Date(new Date(date.getTime()).setMonth(date.getMonth() + 1)).setDate(0)).setHours(0)).setMinutes(0);
    const q = query(
      collection(this.db, 'User', await this.getUserId(), 'rituals', ritualId, 'checkins'),
      where('created', '>=', Timestamp.fromDate(new Date(startOfMonth))),
      where('created', '<=', Timestamp.fromDate(new Date(endOfMonth))),
    );
    const querySnapshot = await getDocs(q);
    const checkins: Daily[] = [];
    querySnapshot.forEach((snapshot) => {
      checkins.push({ id: snapshot.id, created: (snapshot.get('created') as Timestamp).toDate() } as Daily);
    });
    return checkins;
  }

  public async updateSortOrder(rituals: Ritual[]): Promise<void> {
    const batch = writeBatch(this.db);
    const userId = await this.getUserId();
    rituals.forEach((item, index) => {
      batch.update(doc(this.db, 'User', userId, 'rituals', item.id), { sortOrder: index });
    });
    await batch.commit();
  }

  public async deleteRitual(ritualId: string): Promise<void> {
    return deleteDoc(doc(this.db, 'User', await this.getUserId(), 'rituals', ritualId));
  }

  private async getUserId(): Promise<string> {
    return this.accountId;
  }

  private async initialiseDeviceAccount(): Promise<string> {
    const savedAccount = await CapacitorPersistentAccount.readAccount();
    const savedUserId = (savedAccount.data as Partial<UserData> | null)?.userId;
    const userId = typeof savedUserId === 'string' && savedUserId.length > 0 ? savedUserId : uuidv4();

    if (!savedUserId) {
      await CapacitorPersistentAccount.saveAccount({ data: { userId } });
    }

    const userRef = doc(this.db, 'User', userId);
    await runTransaction(this.db, async transaction => {
      const existingUser = await transaction.get(userRef);
      if (existingUser.exists()) {
        transaction.update(userRef, { updated: serverTimestamp() });
      } else {
        transaction.set(userRef, { created: serverTimestamp(), updated: serverTimestamp() });
      }
    });

    return userId;
  }

  private get yesterday(): Date {
    const today = new Date();
    return new Date(today.setDate(today.getDate() - 1));
  }

  private lastCheckinMatchesDate(checkin?: Date, dateToMatch: Date = new Date()): boolean {
    return !!checkin && dateToMatch.getFullYear() === checkin.getFullYear()
      && dateToMatch.getMonth() === checkin.getMonth()
      && dateToMatch.getDate() === checkin.getDate();
  }

  private calculateDays(startDate: Date, endDate: Date): number {
    const start = DateTime.fromJSDate(startDate).startOf('day');
    const end = DateTime.fromJSDate(endDate).endOf('day');
    return Math.ceil(Interval.fromDateTimes(start, end).length('hours') / 24);
  }
}
