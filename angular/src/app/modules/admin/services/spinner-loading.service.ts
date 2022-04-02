import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerLoadingService {

  loadingSubject = new Subject<boolean>();

  constructor() { }

  setLoading(loading:boolean){
    this.loadingSubject.next(loading)
  }
}
