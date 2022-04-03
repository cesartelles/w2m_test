import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Hero } from '@admin/models/hero'

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService{

  constructor() { }

  createDb() {

    const heroes = [
      {
        id: 1,
        name: "BRUCE WAYNE",
        alias: "Batman",
        shortBio: "Es un heroe disfrazado de murcielago",
        bio: "Long bio"
      },
      {
        id: 2,
        name: "CLARCK KENT",
        alias: "Superman",
        shortBio: "El super heroe mas poderoso",
        bio: "Long bio"
      },
      {
        id: 3,
        name: "Peter Parker",
        alias: "Spiderman",
        shortBio: "El hombre araña",
        bio: "Long bio"
      }
    ]
    return {heroes};
  }

  genId(heroes: Hero[]): number {
    return heroes.length > 0 ? Math.max(...heroes.map(hero => hero.id)) + 1 : 11;
  }
}
