import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfo, STATUS, ResponseOptions } from 'angular-in-memory-web-api';
import { Hero } from '@admin/models/hero'
import { environment } from 'src/environments/environment'
import { throwError } from 'rxjs';
import { HeroesCollection } from 'src/app/mock/heroes-mock-data'

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
  
  get(reqInfo: RequestInfo) {
    //console.log("contador->" + this.cont + " , " + reqInfo.url + ", throwError->" + environment.throwMockError)
    this.cont++;
    let statusCode = 200;
    let body:any = {};

    if(true){
      statusCode = 500;
      body = { error : "An error has ocurred"}
    }
    else
      body = this.heroes

    return reqInfo.utils.createResponse$(() => {
      console.log('HTTP GET override');
      const options: ResponseOptions = {
          body: body,
          status: statusCode
        };
        options.headers = reqInfo.headers;
        options.url = reqInfo.url;
      return options;
    });

    return undefined; // let the default GET handle all others
  }

  /*get(reqInfo: RequestInfo) {
    return reqInfo.utils.createResponse$(() => {
      console.log('HTTP GET override');
      const options: ResponseOptions = {
          body: { error: `'Villains' with id=t found` },
          status: 500
        };
        options.headers = reqInfo.headers;
        options.url = reqInfo.url;
      return options;
    });

    return undefined; // let the default GET handle all others
  }*/

  /*get(requestInfo: RequestInfo) {
    console.log("contador->" + this.cont + " , " + requestInfo.url + ", throwError->" + environment.throwMockError)
    this.cont++;
    //const collectionName = requestInfo.collectionName;
    //let params = this.getParams(requestInfo.url);
    return requestInfo.utils.createResponse$ (() => {
      let statusCode:number = 200;
      let body:any = {}
      if(environment.throwMockError){
        statusCode = 500
        body.error = "Internal error3"
        //console.log("El status es ->", statusCode)
      }
      else
        body = this.heroes;
      //return throwError(() => "JIJI ERRRORR");
      //return this.getResponse(requestInfo, body, status)

      //if(environment.throwMockError)
      //console.log("Esto devuelve->", options, ", el status->", STATUS.INTERNAL_SERVER_ERROR)
      console.log("STATUS CODE------------>", statusCode)
      let options: ResponseOptions = {
        body: { error: `'Villains' with id=t found` },
        status: statusCode,
        headers: requestInfo.headers,
        url: requestInfo.url
      };
      environment.throwMockError = false;
      return options;
    });
    return undefined; // let the default GET handle all others

  }*/

  getResponse(requestInfo:RequestInfo, body:any, status:number = 200){
    const options: ResponseOptions = {
      body: body,
      status: status,
      headers: requestInfo.headers,
      url: requestInfo.url
    };
    //if(environment.throwMockError)
    //console.log("Esto devuelve->", options, ", el status->", STATUS.INTERNAL_SERVER_ERROR)
    return requestInfo.utils.createResponse$ (() => options);
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
