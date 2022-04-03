import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, map, finalize, tap, delay} from 'rxjs/operators'
import { SpinnerLoadingService } from '@admin/services/spinner-loading.service'
import { environment } from 'src/environments/environment'

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(private spinnerLoadingService:SpinnerLoadingService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.spinnerLoadingService.setLoading(true);
    let delayT = !environment.mock ? 200 : 0;
    return next.handle(req).pipe(delay(delayT))
    .pipe(
      retry(1),
      tap({
        next: (event) => {},
        error: (error) => {}
      }),
      finalize(() => {
        this.spinnerLoadingService.setLoading(false);
      })
    );
  }
}
