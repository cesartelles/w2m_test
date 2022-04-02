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

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(private spinnerLoadingService:SpinnerLoadingService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.spinnerLoadingService.setLoading(true);
    return next.handle(req).pipe(delay(200))
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
