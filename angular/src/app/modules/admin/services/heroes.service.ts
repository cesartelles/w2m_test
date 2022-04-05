import { Injectable } from '@angular/core';
import { HttpClient , HttpResponse} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Hero } from '@admin/models/hero'
import { HeroesResponse } from '@admin/models/heroes-response'

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  url = environment.apiHeroesUrl;
  constructor(private http: HttpClient) { }

  getAll(filterName:string = "", page:number = 1, limit:number = 10): Observable<HeroesResponse> {
    let url = this.url + '?name_like=' + filterName + "&_page=" + page + "&_limit=" + limit
    return this.http.get<HeroesResponse>(url, { observe: 'response' }).pipe(
      map(((res:any)=>{
        let heroesResponse:HeroesResponse = new HeroesResponse();
        heroesResponse.total = Number(res.headers.get("x-total-count"))
        heroesResponse.heroes = res?.body || [];
        return heroesResponse;
      })
    ))
  }

  get(id:number): Observable<any> {
    return this.http.get(this.url + '/' + id)
  }

  create(heroe:Hero): Observable<Hero> {
    const data = JSON.parse(JSON.stringify(heroe))
    delete data.id
    return this.http.post<Hero>(this.url, data)
  }

  update(heroe:Hero): Observable<Hero> {
    let id = heroe.id
    const data = JSON.parse(JSON.stringify(heroe))
    delete data.id
    return this.http.put<Hero>(this.url + '/' + id, data)
  }

  delete(heroe:Hero): Observable<any> {
    let id = heroe.id
    return this.http.delete(this.url + '/' + id)
  }
}