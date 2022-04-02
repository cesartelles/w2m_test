import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Hero } from '@admin/models/hero'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HeroesService } from '@admin/services/heroes.service'

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit {

  @Input () hero: Hero = new Hero();
  @Output() onCreate = new EventEmitter<Hero>();

  public heroForm = new FormGroup({
    id: new FormControl(),
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    alias: new FormControl('', [Validators.required,  Validators.minLength(3), Validators.maxLength(30)]),
    shortBio: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    bio: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]),
  });

  constructor(private heroesService:HeroesService,
              private dialogRef: MatDialogRef<HeroComponent>) { 
    
  }

  ngOnInit(): void {
    this.heroForm.setValue(this.hero)
  }

  get name() { return this.heroForm.get('name'); }
  get alias() { return this.heroForm.get('alias'); }
  get shortBio() { return this.heroForm.get('shortBio'); }
  get bio() { return this.heroForm.get('bio'); }

  onSubmit(){
    console.log("ON submit, valid->", this.heroForm.valid)
    if(this.heroForm.valid){
      if(!this.hero.id){
        this.create()
      }
      else
        this.update()
    }
  }

  close(){
    this.dialogRef.close();
  }

  create(){

    this.heroesService.create(this.heroForm.value).subscribe({
        next: (hero:Hero) => {
          console.log("created->", hero)
          this.onCreate.emit(hero)
          this.dialogRef.close();
        },
        error: (e) => console.error(e),
        complete: () => console.info('complete') 
      }
    )
  }

  update(){
    this.heroesService.update(this.heroForm.value).subscribe({
        next: (hero:Hero) => {
          console.log("update->", hero)
          Object.assign(this.hero, this.heroForm.value)
          this.dialogRef.close();
        },
        error: (e) => console.error(e),
        complete: () => console.info('complete') 
      }
    )
  }
}