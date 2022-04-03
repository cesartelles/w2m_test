import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from '@shared/material.module'
import { AdminComponent } from './admin.component';
import { SpinnerLoaderComponent } from './components/spinner-loader/spinner-loader.component'
import { RouterTestingModule } from "@angular/router/testing";

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MaterialModule, RouterTestingModule ],
      declarations: [ AdminComponent, SpinnerLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
