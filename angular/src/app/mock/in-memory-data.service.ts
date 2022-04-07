import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfo, STATUS, ResponseOptions } from 'angular-in-memory-web-api';
import { Hero } from '@admin/models/hero'
import { of, throwError } from 'rxjs';
import { HeroesCollection } from 'src/app/mock/heroes-mock-data'
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService{

  constructor() { }
  cont:number =0;

  heroes:Hero[] = HeroesCollection

  createDb() {

    return this.heroes;
  }
  searchById(id:number){
    return this.heroes.find(hero => hero.id === id)
  }

  getIdFromUrl(url:string){
    return url.match(/\/heroes\/(\d+)/) ? parseInt(url.split("/")[2]) : 0;
  }
  
  get(reqInfo: RequestInfo){
    let id = this.getIdFromUrl(reqInfo.url);
    let body:any = id ? this.searchById(id) : this.heroes
    const total = this.heroes.length.toString()
    let headers = reqInfo.headers.append("x-total-count", total);
    return this.getResponse(reqInfo, body, 200, headers);
  }

  post(reqInfo: RequestInfo){
    let body = reqInfo.utils.getJsonBody(reqInfo.req);
    body.id = this.genId(this.heroes)
    return this.getResponse(reqInfo, body, 200);
  }

  put(reqInfo: RequestInfo){
    let body = reqInfo.utils.getJsonBody(reqInfo.req);
    let id = this.getIdFromUrl(reqInfo.url);
    body.id = id;
    return this.getResponse(reqInfo, body, 200);
  }

  delete(reqInfo: RequestInfo){
    return this.getResponse(reqInfo, {}, 200);
  }

  getResponse(reqInfo:RequestInfo, body:any, status:number = 200, headers:any = null){

    headers = !headers ? reqInfo.headers : headers
    return reqInfo.utils.createResponse$(() => {
      const total = this.heroes.length.toString()
      let options: ResponseOptions = {
        body: body,
        status: status,
        url: reqInfo.url,
        headers: headers
      };
      return options;
    });

  }

  genId(heroes: Hero[]): number {
    return heroes.length > 0 ? Math.max(...heroes.map(hero => hero.id)) + 1 : 11;
  }

  getParams(url:string){
    let arrParams = url.split("?")[1].split("&")
    let params:any = {};

    arrParams.forEach((val, index)=>{
      let arrPair = val.split("=")
      params[arrPair[0]] = arrPair[1]
    })
    return params;
  }
}
