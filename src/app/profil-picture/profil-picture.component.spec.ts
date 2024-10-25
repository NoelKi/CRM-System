import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilPictureComponent } from './profil-picture.component';

describe('ProfilPictureComponent', () => {
  let component: ProfilPictureComponent;
  let fixture: ComponentFixture<ProfilPictureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilPictureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilPictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
