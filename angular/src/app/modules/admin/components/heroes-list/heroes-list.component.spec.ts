import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { CoreModule } from '@core/core.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeroesListComponent } from './heroes-list.component';
import { SharedModule } from '@shared/shared.module'
import { MaterialModule } from '@shared/material.module'

describe('HeroesListComponent', () => {
  let component: HeroesListComponent;
  let fixture: ComponentFixture<HeroesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeroesListComponent ],
      imports: [ CoreModule, BrowserAnimationsModule, SharedModule, MaterialModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get list',fakeAsync( () => {
    component.getAllHeroes()
    tick(700)
    fixture.detectChanges();
    console.log("HEROES desde TEST->" , component.heroes)
    expect(component).toBeTruthy();

  }));
  
});
