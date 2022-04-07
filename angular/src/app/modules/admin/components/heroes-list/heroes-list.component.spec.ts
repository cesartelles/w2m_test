import { ComponentFixture, TestBed, tick, fakeAsync, waitForAsync, flush} from '@angular/core/testing';
import { CoreModule } from '@core/core.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeroesListComponent } from './heroes-list.component';
import { SharedModule } from '@shared/shared.module'
import { MaterialModule } from '@shared/material.module'
import { By } from '@angular/platform-browser'
import { HeroesCollection } from 'src/app/mock/heroes-mock-data'
import { of, throwError } from 'rxjs';
import { HeroesService } from '@admin/services/heroes.service'
import { HeroesResponse } from '@admin/models/heroes-response'
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ConfirmDeleteComponent } from '@admin/components/confirm-delete/confirm-delete.component'

import { HeroComponent } from '@admin/components/hero/hero.component'
import { Hero } from '@admin/models/hero';

describe('HeroesListComponent', () => {
  let component: HeroesListComponent;
  let fixture: ComponentFixture<HeroesListComponent>;
  let heroesService: HeroesService;
  let getAllSpy:any;
  let heroesServiceSpy:any;
  let heroes:Hero[];

  beforeEach(async () => {

    heroes = JSON.parse(JSON.stringify(HeroesCollection))

    heroesServiceSpy = jasmine.createSpyObj('HeroesService',['getAll'])
    let heroesResponse:HeroesResponse = new HeroesResponse();
    heroesResponse.heroes = heroes;
    heroesResponse.total = 3;

    heroesServiceSpy.getAll.and.returnValue(of(heroesResponse))
    
    await TestBed.configureTestingModule({
      declarations: [ HeroesListComponent, HeroComponent, ConfirmDeleteComponent],
      imports: [ CoreModule, BrowserAnimationsModule, SharedModule, MaterialModule ],
      providers: [ { provide: HeroesService, useValue: heroesServiceSpy }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroesListComponent);
    component = fixture.componentInstance;
    heroesService = TestBed.inject(HeroesService)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get list of heroes', () => {
    expect(heroesService.getAll).toHaveBeenCalled()
    fixture.detectChanges();
    let row = fixture.debugElement.queryAll(By.css('table tbody tr'))[0];
    let col = row.queryAll(By.css("td"))[1].nativeElement
    expect(component.heroes.length).toBeGreaterThan(0);
    expect(col.textContent).toContain("BRUCE WAYNE")
  })
  
  it('should receive error when heroes service fails', () => {
    const errorResponse = new HttpErrorResponse({
      error: { message: `Internal server erro.` },
      status: 500,
      statusText: 'Internal server erro',
    });

    heroesServiceSpy.getAll.and.returnValue(throwError(() => errorResponse))
    component.getAllHeroes();
    expect(heroesService.getAll).toHaveBeenCalled()
    fixture.detectChanges();
    expect(component.heroes.length).toBe(0);
    let row = fixture.debugElement.query(By.css('.alert'));
    expect(row).toBeTruthy();
  })
  
  it('should get heroe from input search', () => {

    let searchName = "ARKER";
    let serachInput = fixture.debugElement.query(By.css('#filter_name'));
    serachInput.nativeElement.value = searchName;
    serachInput.nativeElement.dispatchEvent(new Event('input'));

    let hero = heroes.find(her => her.name.indexOf(searchName)!==-1)
    let heroesResponse:HeroesResponse = new HeroesResponse();
    heroesResponse.heroes.push(hero!);
    heroesResponse.total = 3;

    heroesServiceSpy.getAll.and.returnValue(of(heroesResponse))
    let btn = fixture.debugElement.query(By.css('#searchBtn'));
    btn.triggerEventHandler('click', null);
    expect(heroesService.getAll).toHaveBeenCalled()
    fixture.detectChanges();
    expect(serachInput.nativeElement.value).toBe(searchName);
    expect(component.nameFilter).toBe(searchName);

    fixture.detectChanges();
    let row = fixture.debugElement.queryAll(By.css('table tbody tr'))[0];
    let col = row.queryAll(By.css("td"))[1].nativeElement
    expect(component.heroes.length).toBeGreaterThan(0);
    expect(col.textContent).toContain("PETER PARKER")

  })

  it('should open the HeroComponent in a MatDialog', () => {

    let row = fixture.debugElement.queryAll(By.css('table tbody tr'))[0];
    let editBtn = row.query(By.css(".edit-button"));
    spyOn(component.dialog,'open').and.callThrough();
    editBtn.triggerEventHandler('click', null);
    expect(component.dialog.open).toHaveBeenCalledWith(HeroComponent, {
      width: '500px'
    });
  });

  it('should open the ConfirmDeleteComponent in a MatDialog', () => {

    let row = fixture.debugElement.queryAll(By.css('table tbody tr'))[0];
    let editBtn = row.query(By.css(".del-button"));
    spyOn(component.dialog,'open').and.callThrough();
    editBtn.triggerEventHandler('click', null);
    expect(component.dialog.open).toHaveBeenCalledWith(ConfirmDeleteComponent, {
      width: '500px'
    });
  });
  
});


