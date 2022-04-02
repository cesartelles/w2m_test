import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component'
import { HeroesListComponent } from './components/heroes-list/heroes-list.component'

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [{path:'heroes', component: HeroesListComponent}]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
