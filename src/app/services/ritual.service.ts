import { Injectable } from '@angular/core';
import { Ritual, Profile } from '../models/models';
import { Daily } from '../models/raw-models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';
import {
  getFirestore,  getDocs, collection,
  Firestore, addDoc, DocumentReference,
  serverTimestamp, where, query, Timestamp,
  orderBy
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  Auth, getAuth, signInWithEmailAndPassword, signInWithPopup
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
      private readonly http: HttpClient,
      private readonly router: Router,
    ){
      this.initFirebase();
    }

    public async initFirebase(): Promise<void> {
      const app = initializeApp(environment.firebaseConfig);
      // const analytics = getAnalytics(app);
      this.auth = getAuth(app);
      this.db = getFirestore(app);
    }

    public async getRituals(): Promise<Ritual[]> {
      const rituals: Ritual[] = [];
      const q = query(collection(this.db, "User", this.userId!, "rituals"), orderBy('created'));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        rituals.push({
          id: doc.id,
          name: doc.get('name'),
          streak: doc.get('streak') || 0,
          remindTime: doc.get('remindTime'),
          created: doc.get('created'),
        } as Ritual);
      });
      return Promise.resolve(rituals);
    }

    public async createRitual(name: string): Promise<DocumentReference> {
      return addDoc(collection(this.db, "User", this.userId!, "rituals"), {
        name,
        created: serverTimestamp(),
        updated: serverTimestamp(),
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

    public createCheckIn(ritualId: string): Promise<DocumentReference> {
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

    public async login(username: string, password: string): Promise<void> {
      try {
        await signInWithEmailAndPassword(this.auth, username, password).then((creds) => {
          localStorage.setItem('userId', creds.user.uid);
          this.router.navigate(['rituals']);
        });
      } catch (error) {
        alert(error);
      }
    }

    public async loginWithGoogle(): Promise<void> {
      try {
        await signInWithPopup(this.auth, new GoogleAuthProvider()).then((result) => {
          localStorage.setItem('userId', result.user.uid);
          this.router.navigate(['rituals']);
        });
      } catch (error) {
        alert(error);
      }
    }
}
