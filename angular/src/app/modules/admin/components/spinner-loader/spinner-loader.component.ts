import { Component, OnInit } from '@angular/core';
import { SpinnerLoadingService } from '@admin/services/spinner-loading.service'

@Component({
  selector: 'app-spinner-loader',
  templateUrl: './spinner-loader.component.html',
  styleUrls: ['./spinner-loader.component.scss']
})
export class SpinnerLoaderComponent implements OnInit {

  loading:boolean = false;

  constructor(private spinnerLoadingService:SpinnerLoadingService){

    this.spinnerLoadingService.loadingSubject.subscribe((loading)=>{
      this.loading = loading;
    })

  }

  ngOnInit(): void {

  }

}
