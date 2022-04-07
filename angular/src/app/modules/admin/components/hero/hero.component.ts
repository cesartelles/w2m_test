import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Hero } from '@admin/models/hero'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HeroesService } from '@admin/services/heroes.service'
import { ErrorService } from '@core/services/error.service'

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit {

  @Input() hero: Hero = new Hero();
  @Output() onCreate = new EventEmitter<Hero>();
  state:any = { error : ""}

  public heroForm = new FormGroup({
    id: new FormControl(),
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    alias: new FormControl('', [Validators.required,  Validators.minLength(3), Validators.maxLength(30)]),
    shortBio: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    bio: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]),
  });

  constructor(private heroesService:HeroesService,
              public dialogRef: MatDialogRef<HeroComponent>,
              private errorService:ErrorService) { 
    
  }

  ngOnInit(): void {
    this.heroForm.setValue(this.hero)
  }

  get name() { return this.heroForm.get('name'); }
  get alias() { return this.heroForm.get('alias'); }
  get shortBio() { return this.heroForm.get('shortBio'); }
  get bio() { return this.heroForm.get('bio'); }

  onSubmit(){

    if(this.heroForm.valid){
      if(!this.hero.id){
        this.create()
      }
      else
        this.update()
    }
  }

  close(){
    this.dialogRef.close(false);
  }

  create(){

    this.state.error = "";

    this.heroesService.create(this.heroForm.value).subscribe({
        next: (hero:Hero) => {
          this.onCreate.emit(hero)
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.state.error = this.errorService.getErrorMessage(err)
        },
        complete: () => {}
      }
    )
  }

  update(){

    this.state.error = "";

    this.heroesService.update(this.heroForm.value).subscribe({
        next: (hero:Hero) => {
          Object.assign(this.hero, this.heroForm.value)
          this.dialogRef.close();
        },
        error: (err) => {
          this.state.error = this.errorService.getErrorMessage(err)
        },
        complete: () => {}
      }
    )
  }
}