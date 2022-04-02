import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module'
import { CoreModule } from '@core/core.module'
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { HeroesListComponent } from './components/heroes-list/heroes-list.component';
import { HeroComponent } from './components/hero/hero.component';
import { ConfirmDeleteComponent } from './components/confirm-delete/confirm-delete.component'
import { MaterialModule } from '@shared/material.module';
import { SpinnerLoaderComponent } from './components/spinner-loader/spinner-loader.component';

@NgModule({
  declarations: [
    AdminComponent,
    HeroesListComponent,
    HeroComponent,
    ConfirmDeleteComponent,
    SpinnerLoaderComponent
  ],
  imports: [
    AdminRoutingModule,
    SharedModule,
    MaterialModule,
    CoreModule
  ]})
export class AdminModule { }
