import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { MesasComponent } from './mesas.component';
import { SessionService } from '../../../infrastructure/services/session.service';
import { CreateTableUseCase } from '../../../application/use-cases/tables/create-table.use-case';
import { DeleteTableUseCase } from '../../../application/use-cases/tables/delete-table.use-case';
import { ListTablesUseCase } from '../../../application/use-cases/tables/list-tables.use-case';

describe('MesasComponent', () => {
  let component: MesasComponent;
  let fixture: ComponentFixture<MesasComponent>;

  beforeEach(async () => {
    const listTablesUseCaseMock = jasmine.createSpyObj<ListTablesUseCase>('ListTablesUseCase', ['execute']);
    listTablesUseCaseMock.execute.and.returnValue(of([]));
    const createTableUseCaseMock = jasmine.createSpyObj<CreateTableUseCase>('CreateTableUseCase', ['execute']);
    const deleteTableUseCaseMock = jasmine.createSpyObj<DeleteTableUseCase>('DeleteTableUseCase', ['execute']);

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
        { provide: ListTablesUseCase, useValue: listTablesUseCaseMock },
        { provide: CreateTableUseCase, useValue: createTableUseCaseMock },
        { provide: DeleteTableUseCase, useValue: deleteTableUseCaseMock },
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
