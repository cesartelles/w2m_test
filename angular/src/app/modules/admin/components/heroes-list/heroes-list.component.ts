import { Component, OnInit, ViewChild } from '@angular/core';
import { Hero } from '@admin/models/hero'
import { HeroesService } from '@admin/services/heroes.service'
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { HeroComponent } from '@admin/components/hero/hero.component'
import { ConfirmDeleteComponent } from '@admin/components/confirm-delete/confirm-delete.component'
import { MatDialogRef } from '@angular/material/dialog';

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

  constructor(private heroeService:HeroesService, 
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllHeroes();
  }

  getAllHeroes(){
    this.heroes = []
    this.heroeService.getAll(this.nameFilter, this.currentPage + 1, this.limit).subscribe(resp => {
      
      const keys = resp.headers.keys();
      this.total = Number(resp.headers.get("x-total-count"))
      this.heroes = resp?.body || [];
      this.dataSource.data = this.heroes;
    });

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
