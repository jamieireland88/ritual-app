import { EventEmitter, inject, Injectable, Output, output } from '@angular/core';
import { Ritual, Profile, RitualType, IconType } from '../models/models';
import { Daily } from '../models/raw-models';
import { environment } from '../../environment';
import {
  getFirestore,  getDocs, collection,
  Firestore, addDoc, DocumentReference,
  serverTimestamp, where, query, Timestamp,
  orderBy,
  deleteDoc,
  doc, writeBatch,
  runTransaction,
  updateDoc
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import {
  Auth, indexedDBLocalPersistence, initializeAuth, signInWithEmailAndPassword, signInWithPopup
} from "firebase/auth";
import { Router } from '@angular/router';
import { GoogleAuthProvider } from "firebase/auth";
import { DateTime, Interval } from 'luxon';

@Injectable({
  providedIn: 'root'
})
export class RitualService {
    @Output() ritualUpdated = new EventEmitter();

    public get userId(): string | null {
      return this.auth.currentUser?.uid || localStorage.getItem('userId');
    }

    private db!: Firestore;

    private auth!: Auth;

    constructor(
      private readonly router: Router,
    ){
      this.initFirebase();
    }

    public async initFirebase(): Promise<void> {
      const app = initializeApp(environment.firebaseConfig);
      this.auth = initializeAuth(app, {
        persistence: indexedDBLocalPersistence
      });
      // const analytics = getAnalytics(app);
      this.db = getFirestore(app);
    }

    public async getRituals(): Promise<Ritual[]> {
      const rituals: Ritual[] = [];
      const q = query(collection(this.db, "User", this.userId!, "rituals"), orderBy('sortOrder'));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const totalDays = this.calculateDays((doc.get('created') as Timestamp).toDate(), new Date());
        rituals.push({
          id: doc.id,
          icon: doc.get('icon'),
          name: doc.get('name'),
          streak: doc.get('currentStreak') || 0,
          longestStreak: doc.get('longestStreak') || 0,
          remindTime: Math.random() < 0.5 ? new Date() : null,
          created: (doc.get('created') as Timestamp).toDate(),
          actioned: this.lastCheckinMatchesDate(
            doc.get('lastCheckin') ? (doc.get('lastCheckin') as Timestamp).toDate() : undefined
          ),
          type: doc.get('type') || RitualType.Daily,
          totalComplete: doc.get('totalComplete') || 0,
          lastCheckin: doc.get('lastCheckin') ? (doc.get('lastCheckin') as Timestamp).toDate() : undefined,
          totalDays,
          completion: (doc.get('totalComplete') || 0) / totalDays
        } as Ritual);
      });
      return Promise.resolve(rituals);
    }

    public async createRitual(name: string, type: RitualType, icon?: string): Promise<DocumentReference> {
      return addDoc(collection(this.db, "User", this.userId!, "rituals"), {
        name,
        icon,
        type,
        longestStreak: 0,
        currentStreak: 0,
        sortOrder: 0,
        created: new Date(),
        updated: new Date(),
      });
    }

    public async updateRitual(ritualId: string, name: string, type: RitualType, icon?: string): Promise<void> {
      return updateDoc(doc(this.db, "User", this.userId!, "rituals", ritualId), {
        name,
        icon,
        type,
        updated: new Date(),
      }).finally(() => this.ritualUpdated.emit())
    }

    public async getProfile(): Promise<Profile | null> {
      const querySnapshot = await getDocs(collection(this.db, "User", this.userId!, "user_profile"));
      if (!querySnapshot.docs.length) {
        return Promise.resolve(null);
      }
      return Promise.resolve({
        id: querySnapshot.docs[0]?.id,
        notificationSettings: querySnapshot.docs[0]?.get('notificationSettings'),
        accountType: querySnapshot.docs[0]?.get('accountType'),
        created: (querySnapshot.docs[0]?.get('created') as Timestamp).toDate()
      } as Profile);
    }

    public async getDailyCheckIn(ritualId: string): Promise<Daily | null> {
      const startOfDay = new Date(new Date().setHours(0, 0, 0));
      const endOfDay = new Date(new Date().setHours(23, 59, 59));
      const q = query(
        collection(this.db, "User", this.userId!, "rituals", ritualId, "checkins"),
        where('created', '>=', Timestamp.fromDate(startOfDay)),
        where('created', '<=', Timestamp.fromDate(endOfDay)),
      );
      const querySnapshot = await getDocs(q);
      const daily: Daily = {
        id: '',
        created: null,
      }
      querySnapshot.forEach((doc) => {
        daily.id = doc.id;
        daily.created = (doc.get('created') as Timestamp).toDate();
      });
      return Promise.resolve(daily);
    }

    public async createCheckIn(ritualId: string): Promise<DocumentReference> {
      // updateDoc(doc(this.db, "User", this.userId!, "rituals", ritualId), { lastCheckin: new Date().toISOString() });
      await runTransaction(this.db, async (transaction) => {
        const docRef = doc(this.db, "User", this.userId!, "rituals", ritualId);
        const document = await transaction.get(docRef);
        if (!document.exists()) {
          throw "Document does not exist!";
        }

        let currentStreak = 0;
        let longestStreak = document.data()['longestStreak'];
        const lastCheckin = document.data()['lastCheckin'];
        if (!lastCheckin || this.lastCheckinMatchesDate(lastCheckin.toDate(), this.yesterday)) {
          currentStreak = (document.data()['currentStreak'] || 0) + 1;
        }
        longestStreak = Math.max(longestStreak + 1, currentStreak);
        const totalComplete = (document.data()['totalComplete'] || 0) + 1;
        transaction.update(docRef, { currentStreak, longestStreak, totalComplete, lastCheckin: new Date() });
      });
      return addDoc(collection(this.db, "User", this.userId!, "rituals", ritualId, "checkins"), {
        created: serverTimestamp(),
      });
    }

    public async getMonthlyCheckIns(ritualId: string, date: Date): Promise<Daily[]> {
      const startOfMonth = new Date(new Date(new Date(date.getTime()).setDate(1)).setHours(0)).setMinutes(0);
      const endOfMonth = new Date(new Date(new Date(new Date(date.getTime()).setMonth(date.getMonth() + 1)).setDate(0)).setHours(0)).setMinutes(0);
      const q = query(
        collection(this.db, "User", this.userId!, "rituals", ritualId, "checkins"),
        where('created', '>=', Timestamp.fromDate(new Date(startOfMonth))),
        where('created', '<=', Timestamp.fromDate(new Date(endOfMonth))),
      );
      const querySnapshot = await getDocs(q);
      const checkins: Daily[] = [];
      querySnapshot.forEach((doc) => {
        checkins.push({
          id: doc.id,
          created: (doc.get('created') as Timestamp).toDate(),
        } as Daily);
      });
      return Promise.resolve(checkins);
    }

    public updateSortOrder(rituals: Ritual[]) {
      const batch = writeBatch(this.db);
      rituals.forEach((item, index) => {
        const itemRef = doc(this.db, "User", this.userId!, "rituals", item.id);
        batch.update(itemRef, { sortOrder: index })
      });
      batch.commit();
    }

    public deleteRitual(ritualId: string): Promise<void> {
      return deleteDoc(doc(this.db, "User", this.userId!, "rituals", ritualId))
    }

    public async login(username: string, password: string): Promise<void> {
      await signInWithEmailAndPassword(this.auth, username, password).then((creds) => {
        localStorage.setItem('userId', creds.user.uid);
        this.router.navigateByUrl('/rituals');
      });
    }

    public async loginWithGoogle(): Promise<void> {
      await signInWithPopup(this.auth, new GoogleAuthProvider()).then((result) => {
        localStorage.setItem('userId', result.user.uid);
        this.router.navigateByUrl('/rituals');
      });
    }

    private get yesterday(): Date {
      const today = new Date();
      return new Date(today.setDate(today.getDate() - 1));
    }

    private lastCheckinMatchesDate(checkin?: Date, dateToMatch: Date = new Date()): boolean {
      if (!checkin) return false;
        // Compare only the date components (year, month, day) of both today and checkin
      if (
        dateToMatch.getFullYear() === checkin.getFullYear() &&
        dateToMatch.getMonth() === checkin.getMonth() &&
        dateToMatch.getDate() === checkin.getDate()
      ) {
        return true;
      }
      return false;
    }

    private calculateDays(startDate: Date, endDate: Date) {
      const start = DateTime.fromJSDate(startDate).startOf('day');
      const end = DateTime.fromJSDate(endDate).endOf('day');
      const diff = Interval.fromDateTimes(start, end).length('hours');
      return Math.ceil(diff / 24);
  }
}
