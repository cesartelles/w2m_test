import { TestBed } from '@angular/core/testing';

import { HeroesService } from './heroes.service';
import { CoreModule } from '@core/core.module'
import { lastValueFrom } from 'rxjs';
import { HeroesCollection } from 'src/app/mock/heroes-mock-data'
import { Hero } from '@admin/models/hero';

describe('HeroesService', () => {
  let service: HeroesService;
  let heroes:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule ]
    });
    service = TestBed.inject(HeroesService);
    heroes = JSON.parse(JSON.stringify(HeroesCollection))

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all heroes', async() => {

    try{
      let heroesResponse = await lastValueFrom(service.getAll())
      expect(heroesResponse.heroes.length).toBe(3);
      expect(heroesResponse.total).toBe(3);
    }
    catch(err){
      fail(err)
    }
    
  });

  it('should get hero', async() => {

    try{
      let res = await lastValueFrom(service.get(2))
      expect(res).toEqual(heroes[1]);
    }
    catch(err){
      fail(err)
    }
    
  });

  it('should create hero', async() => {

    let hero:Hero = { 
      id: 0,
      name: 'BRUCE BANNER', 
      alias: 'Hulk', 
      shortBio: 'El super heroe verde mas fuerte', 
      bio: 'Long bio' 
    }

    try{
      let res = await lastValueFrom(service.create(hero))
      expect(res.id).toBe(4);
    }
    catch(err){
      fail(err)
    }
    
  });

  it('should update hero', async() => {

    let hero = heroes[0];
    hero.name = "BRUCE CHANGE";
    try{
      let res = await lastValueFrom(service.update(hero))
      expect(res).toEqual(hero);
      expect(res.name).toEqual(hero.name);
    }
    catch(err){
      fail(err)
    }
    
  });

  it('should delete hero', async() => {

    let hero = heroes[1];
    try{
      let res = await lastValueFrom(service.delete(hero))
      expect(res).toEqual({});
    }
    catch(err){
      fail(err)
    }
  });

});
