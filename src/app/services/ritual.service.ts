import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { Ritual, Profile } from '../models/models';
import { RitualRaw, ProfileRaw, Daily } from '../models/raw-models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class RitualService {
    public get isAuthenticated$(): Observable<boolean> {
      return this.isAuthenticated.asObservable();
    }
    private isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private readonly http: HttpClient){}

    public getRituals(): Observable<Ritual[]> {
      return this.http.get<RitualRaw[]>(
        `${environment.apiEndpoint}${environment.rituals}`
      ).pipe(
        map((raw: RitualRaw[]) => {
          return raw.map((item) => {
            return {
              id: item.id,
              name: item.name,
              streak: item.streak,
              remindTime: item.remind_time,
              created: item.created,
            } as Ritual
          })
        }),
        catchError(() => of([]))
      )
    }

    public createRitual(name: string): Observable<RitualRaw> {
      return this.http.post<RitualRaw>(
        `${environment.apiEndpoint}${environment.rituals}`,
        { name }
      )
    }

    public getProfile(): Observable<Profile | null> {
      return this.http.get<ProfileRaw>(
        `${environment.apiEndpoint}${environment.profile}`,
      ).pipe(
        map((raw: ProfileRaw) => {
          return {
            id: raw.id,
            notificationSettings: raw.notification_settings,
            accountType: raw.account_type,
            created: raw.created,
          } as Profile
        }),
        catchError(() => of(null))
      )
    }

    public getDailyCheckIn(ritualId: string): Observable<Daily | null> {
      return this.http.get<Daily>(
        `${environment.apiEndpoint}${environment.daily}`.replace(
          '<id>', ritualId
        )
      ).pipe(
        catchError(() => of(null))
      )
    }

    public createCheckIn(ritualId: string): Observable<Daily> {
      return this.http.post<Daily>(
        `${environment.apiEndpoint}${environment.daily}`.replace(
          '<id>', ritualId
        ),
        {}
      )
    }

    public getMonthlyCheckIns(ritualId: string, date: Date): Observable<Daily[]> {
      const params = { date: date.toISOString() };
      return this.http.get<Daily[]>(
        `${environment.apiEndpoint}${environment.checkins}`.replace(
          '<id>', ritualId
        ),
        { params }
      ).pipe(
        catchError(() => of([]))
      )
    }

    public async login(username: string, password: string): Promise<void> {
      this.http.post<{token: string}>(
        `${environment.apiEndpoint}${environment.login}`,
        { username, password }
      ).pipe(
        tap((response) => {
          this.isAuthenticated.next(true);
          localStorage.setItem('Authentication', response.token);
          return Promise.resolve();
        })
      ).subscribe();
    }
}
