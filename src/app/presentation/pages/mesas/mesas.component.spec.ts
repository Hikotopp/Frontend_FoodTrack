import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { MesasComponent } from './mesas.component';
import { SessionService } from '../../../infrastructure/services/session.service';
import { TableService } from '../../../infrastructure/services/table.service';

describe('MesasComponent', () => {
  let component: MesasComponent;
  let fixture: ComponentFixture<MesasComponent>;

  beforeEach(async () => {
    const tableServiceMock = jasmine.createSpyObj<TableService>('TableService', ['listTables']);
    tableServiceMock.listTables.and.returnValue(of([]));

    const sessionServiceMock = jasmine.createSpyObj<SessionService>('SessionService', ['getStoredUser', 'hasRole']);
    sessionServiceMock.getStoredUser.and.returnValue({
      fullName: 'Test User',
      email: 'test@example.com',
      role: 'EMPLOYEE'
    });
    sessionServiceMock.hasRole.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [MesasComponent],
      providers: [
        provideRouter([]),
        { provide: TableService, useValue: tableServiceMock },
        { provide: SessionService, useValue: sessionServiceMock }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MesasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
