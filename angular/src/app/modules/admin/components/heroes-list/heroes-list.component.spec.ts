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
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Hero } from '@admin/models/hero';

describe('HeroesListComponent', () => {
  let component: HeroesListComponent;
  let fixture: ComponentFixture<HeroesListComponent>;
  let heroesService: HeroesService;
  let getAllSpy:any;
  let cont:number = 0;
  let heroesServiceSpy:any;

  beforeEach(async () => {

    heroesServiceSpy = jasmine.createSpyObj('HeroesService',['getAll'])
    let heroesResponse:HeroesResponse = new HeroesResponse();
    heroesResponse.heroes = HeroesCollection;
    heroesResponse.total = 3;

    heroesServiceSpy.getAll.and.returnValue(of(heroesResponse))
    
    await TestBed.configureTestingModule({
      declarations: [ HeroesListComponent ],
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
    console.log("should get list of heroes")
    expect(heroesService.getAll).toHaveBeenCalled()
    fixture.detectChanges();
    let row = fixture.debugElement.queryAll(By.css('table tbody tr'))[0];
    let col = row.queryAll(By.css("td"))[1].nativeElement
    expect(component.heroes.length).toBeGreaterThan(0);
    expect(col.textContent).toContain("BRUCE WAYNE")
  })
  
  it('should receive error when heroes service fails', () => {
   
    console.log("should receive error when heroes service fails")
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

    let hero = HeroesCollection.find(her => her.name.indexOf(searchName)!==-1)

    let heroesResponse:HeroesResponse = new HeroesResponse();
    heroesResponse.heroes.push(hero!);
    heroesResponse.total = 3;

    heroesServiceSpy.getAll.and.returnValue(of(heroesResponse))
    component.getAllHeroes()
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

  
});


