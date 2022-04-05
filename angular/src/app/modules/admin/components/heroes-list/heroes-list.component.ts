import { Component, OnInit, ViewChild } from '@angular/core';
import { Hero } from '@admin/models/hero'
import { HeroesService } from '@admin/services/heroes.service'
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { HeroComponent } from '@admin/components/hero/hero.component'
import { ConfirmDeleteComponent } from '@admin/components/confirm-delete/confirm-delete.component'
import { MatDialogRef } from '@angular/material/dialog';
import { ErrorService } from '@core/services/error.service'
import { HeroesResponse } from '@admin/models/heroes-response';

@Component({
  selector: 'app-heroes-list',
  templateUrl: './heroes-list.component.html',
  styleUrls: ['./heroes-list.component.scss']
})
export class HeroesListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'alias', 'shortBio', "action"];
  heroes:Hero[] = []
  dataSource = new MatTableDataSource<Hero>();
  nameFilter:string = "";
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  currentPage:number = 0;
  total:number = 0;
  limit:number = 5
  pageSize:number = 5;
  state:any = { error : ""}
  cont:number = 0;

  constructor(private heroeService:HeroesService, 
              public dialog: MatDialog,
              private errorService:ErrorService) { }

  ngOnInit(): void {
    this.getAllHeroes();
  }

  getAllHeroes(){
    //console.log("GET ALL HEROES")
    this.heroes = []
    this.state.error = "";

    this.heroeService.getAll( this.nameFilter, 
      this.currentPage + 1, 
      this.limit).subscribe({
        next: (heroesResponse:HeroesResponse) => {
          this.total = heroesResponse.total
          this.heroes = heroesResponse.heroes
          this.dataSource.data = this.heroes;
        },
        error: (err) => {
          console.log("Ocurrio algo->", err)
          this.state.error = this.errorService.getErrorMessage(err);
        },
        complete: () => {
        }
      })

  }

  filterByName(){
    this.currentPage = 0
    this.getAllHeroes()
  }

  getPaginatorData($event:any){
    this.currentPage = $event.pageIndex
    this.getAllHeroes()
    return $event;
  }

  openHeroDialog(hero?:Hero): void {
    const dialogRef = this.dialog.open(HeroComponent, {
      width: '500px'
    });
    if(hero)
      dialogRef.componentInstance.hero = hero;
    else
      dialogRef.componentInstance.onCreate.subscribe((hero:Hero)=>{        
        this.heroes.push(hero)
        this.total++;
        this.dataSource._updateChangeSubscription();
      })

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openDeleteDialog(hero:Hero): void {

    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '500px'
    });

    dialogRef.componentInstance.onDelete.subscribe(()=>{

      this.heroeService.delete(hero).subscribe(resp => {
        this.heroes.forEach((h,i) => {
          if(this.heroes[i].id === hero?.id)
            this.heroes.splice(i,1)
        });
        this.dataSource._updateChangeSubscription();
      });

    })

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.animal = result;
    });
  }

  onKeydown(event:any) {
    if (event.key === "Enter") {
      this.filterByName()
    }
  }
}
