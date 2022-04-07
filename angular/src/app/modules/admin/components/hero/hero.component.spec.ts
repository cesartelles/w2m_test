import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroComponent } from './hero.component';
import { CoreModule } from '@core/core.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@shared/shared.module'
import { MaterialModule } from '@shared/material.module'
import { HeroesService } from '@admin/services/heroes.service'
import { Hero } from '@admin/models/hero';
import { By } from '@angular/platform-browser'
import { of, throwError } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HeroesCollection } from 'src/app/mock/heroes-mock-data';

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;
  let heroesServiceSpy:any;
  let heroesService: HeroesService;
  let heroes:any;
  let mockDialogRef:any;

  const newHero = new Hero();
  newHero.name = "NEW HERO";
  newHero.alias = "Super Hero";
  newHero.shortBio = "Short bio";
  newHero.bio = "Long bio";

  function fillHeroForm(hero:Hero){
    //name
    let nameInput = fixture.debugElement.query(By.css('#name'));
    nameInput.nativeElement.value = hero.name;
    nameInput.nativeElement.dispatchEvent(new Event('input'));

    //alias
    let aliasInput = fixture.debugElement.query(By.css('#alias'));
    aliasInput.nativeElement.value = hero.alias;
    aliasInput.nativeElement.dispatchEvent(new Event('input'));

    //short bio
    let shortBioInput = fixture.debugElement.query(By.css('#shortBio'));
    shortBioInput.nativeElement.value = hero.shortBio;
    shortBioInput.nativeElement.dispatchEvent(new Event('input'));

    //bio 
    let bioInput = fixture.debugElement.query(By.css('#bio'));
    bioInput.nativeElement.value = hero.bio;
    bioInput.nativeElement.dispatchEvent(new Event('input'));
  }

  beforeEach(async () => {

    heroesServiceSpy = jasmine.createSpyObj('HeroesService',['create','update'])
    mockDialogRef = {
      close: jasmine.createSpy('close')
    };

    await TestBed.configureTestingModule({
      declarations: [ HeroComponent ],
      imports: [ CoreModule, BrowserAnimationsModule, SharedModule, MaterialModule ],
      providers: [ 
                    { provide: HeroesService, useValue: heroesServiceSpy },
                    { provide: MatDialogRef, useValue: mockDialogRef },
                  ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
    heroesService = TestBed.inject(HeroesService)
    heroes = JSON.parse(JSON.stringify(HeroesCollection))
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create hero', () => {

    fillHeroForm(newHero)

    expect(component.hero).not.toEqual(component.heroForm.value);
    component.heroForm.value.id = 4
    heroesServiceSpy.create.and.returnValue(of(component.heroForm.value))
  
    let btn = fixture.debugElement.query(By.css('#saveBtn'))
    btn.nativeElement.click()
    
    expect(mockDialogRef.close).toHaveBeenCalled();
    fixture.detectChanges();
    let row = fixture.debugElement.query(By.css('.alert'));
    expect(row).not.toBeTruthy();

  })

  it('should get error on create hero', () => {

    fillHeroForm(newHero)

    const errorResponse = new HttpErrorResponse({
      error: { message: `Internal server error.` },
      status: 500,
      statusText: 'Internal server erro',
    });

    heroesServiceSpy.create.and.returnValue(throwError(() => errorResponse))
    let btn = fixture.debugElement.query(By.css('#saveBtn'))
    btn.nativeElement.click()
    fixture.detectChanges();
    let row = fixture.debugElement.query(By.css('.alert'));
    expect(row).toBeTruthy();

  })

  it('should update hero', () => {

    component.hero = heroes[0];
    component.ngOnInit()
    expect(component.hero).toEqual(component.heroForm.value);

    let nameInput = fixture.debugElement.query(By.css('#name'));
    nameInput.nativeElement.value = "BRUCE CHANGE";
    nameInput.nativeElement.dispatchEvent(new Event('input'));
    heroesServiceSpy.update.and.returnValue(of(component.heroForm.value))
    let btn = fixture.debugElement.query(By.css('#saveBtn'))
    btn.nativeElement.click()

    expect(component.hero).toEqual(component.heroForm.value);
    expect(mockDialogRef.close).toHaveBeenCalled();
    fixture.detectChanges();
    let row = fixture.debugElement.query(By.css('.alert'));
    expect(row).not.toBeTruthy();

  })

  it('should update hero get client validation error', () => {

    component.hero = heroes[0];
    component.ngOnInit()
    expect(component.hero).toEqual(component.heroForm.value);

    let nameInput = fixture.debugElement.query(By.css('#name'));
    nameInput.nativeElement.value = "BR";
    nameInput.nativeElement.dispatchEvent(new Event('input'));

    let btn = fixture.debugElement.query(By.css('#saveBtn'))
    btn.nativeElement.click()

    fixture.detectChanges();
    let error = fixture.debugElement.query(By.css('mat-error'));
    expect(error.nativeElement.textContent).toContain("must be at least 3 characters")

  })
});
