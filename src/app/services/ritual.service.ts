import { Injectable } from '@angular/core';
import { Ritual, Profile, RitualType } from '../models/models';
import { Daily } from '../models/raw-models';
import { environment } from '../../environment';
import {
  getFirestore,  getDocs, collection,
  Firestore, addDoc, DocumentReference,
  serverTimestamp, where, query, Timestamp,
  orderBy,
  updateDoc,
  doc, writeBatch,
  runTransaction
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import {
  Auth, indexedDBLocalPersistence, initializeAuth, signInWithEmailAndPassword, signInWithPopup
} from "firebase/auth";
import { Router } from '@angular/router';
import { GoogleAuthProvider } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class RitualService {
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
        const totalDays = this.calculateDays(doc.get('created').toDate(), new Date());
        rituals.push({
          id: doc.id,
          name: doc.get('name'),
          streak: doc.get('currentStreak') || 0,
          longestStreak: doc.get('longestStreak') || 0,
          remindTime: Math.random() < 0.5 ? new Date() : null,
          created: doc.get('created'),
          actioned: this.lastCheckinWasToday(doc, doc.get('lastCheckin')),
          type: RitualType.Daily,
          totalComplete: doc.get('totalComplete') || 0,
          lastCheckin: doc.get('lastCheckin'),
          totalDays,
          completion: (doc.get('totalComplete') || 0 / totalDays) * 100
        } as Ritual);
      });
      return Promise.resolve(rituals);
    }

    public async createRitual(name: string): Promise<DocumentReference> {
      return addDoc(collection(this.db, "User", this.userId!, "rituals"), {
        name,
        longestStreak: 0,
        currentStreak: 0,
        sortOrder: 0,
        created: new Date(),
        updated: new Date(),
      });
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

        const currentStreak = document.data()['streak'] || 0 + 1;
        const longestStreak = document.data()['longestStreak'] || 0 + 1;
        const totalComplete = document.data()['totalComplete'] || 0 + 1;
        transaction.update(docRef, { currentStreak, longestStreak, totalComplete, lastCheckin: new Date().toISOString() });
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

    private lastCheckinWasToday(doc: any, checkin?: string): boolean {
      if (!checkin) return false;

      const today = new Date();
        // Compare only the date components (year, month, day) of both today and checkin
      const checkinDate = new Date(checkin);
      if (
        today.getFullYear() === checkinDate.getFullYear() &&
        today.getMonth() === checkinDate.getMonth() &&
        today.getDate() === checkinDate.getDate()
      ) {
        return true;
      }
      return false;
    }

    private calculateDays(startDate: Date, endDate: Date) {
      const diff = endDate.getTime() - startDate.getTime();
      let daysDifference = diff / (1000 * 3600 * 24);
      return Math.ceil(daysDifference);
  }
}
