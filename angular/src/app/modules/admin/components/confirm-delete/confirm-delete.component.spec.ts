import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { ConfirmDeleteComponent } from './confirm-delete.component';
import { SharedModule } from '@shared/shared.module'
import { MaterialModule } from '@shared/material.module'
import { By } from '@angular/platform-browser'

describe('ConfirmDeleteComponent', () => {
  let component: ConfirmDeleteComponent;
  let fixture: ComponentFixture<ConfirmDeleteComponent>;
  let mockDialogRef:any;

  beforeEach(async () => {

    mockDialogRef = {
      close: jasmine.createSpy('close')
    };

    await TestBed.configureTestingModule({
      declarations: [ ConfirmDeleteComponent ],
      imports: [ SharedModule, MaterialModule ],
      providers: [ 
        { provide: MatDialogRef, useValue: mockDialogRef },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept delete', () => {
    let btn = fixture.debugElement.query(By.css('#saveBtn'))
    let spy = spyOn(component.onDelete, 'emit');
    fixture.detectChanges();
    btn.nativeElement.click()
    fixture.detectChanges();
    expect(mockDialogRef.close).toHaveBeenCalled();
    setTimeout(()=>{
      expect(component.onDelete.emit).toHaveBeenCalled();
    },100)

  });

  it('should cancel delete', () => {
    let btn = fixture.debugElement.query(By.css('#delBtn'))
    btn.nativeElement.click()
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

});
