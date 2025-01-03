import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environment";


export function tokenInterceptor(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('Authentication');
    let newReq = req;
    // if (!req.url.includes(environment.login)) {
    //     newReq = req.clone({
    //         headers: req.headers.append(
    //             'Authorization', `Token ${token}`
    //         )
    //     })
    // }
    return next(newReq);
  }
