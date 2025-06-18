import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopoModalComponent } from './topo-modal.component';

describe('TopoModalComponent', () => {
  let component: TopoModalComponent;
  let fixture: ComponentFixture<TopoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopoModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
