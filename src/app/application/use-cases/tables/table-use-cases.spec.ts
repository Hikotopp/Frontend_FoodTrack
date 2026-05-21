import { of } from 'rxjs';
import { AddOrderLineUseCase } from './add-order-line.use-case';
import { CloseOrderUseCase } from './close-order.use-case';
import { CreateTableUseCase } from './create-table.use-case';
import { DeleteTableUseCase } from './delete-table.use-case';
import { GetDashboardUseCase } from './get-dashboard.use-case';
import { ListTablesUseCase } from './list-tables.use-case';
import { RemoveOrderLineUseCase } from './remove-order-line.use-case';
import { UpdateOrderLineUseCase } from './update-order-line.use-case';
import { UpdateTableStatusUseCase } from './update-table-status.use-case';
import { TableDashboard, TableSummary } from '../../../domain/entities/table.entity';
import { TablePort } from '../../../domain/ports/table.port';

describe('table use cases', () => {
  const summary: TableSummary = {
    id: 1,
    tableNumber: 4,
    status: 'AVAILABLE',
    total: 0,
    itemCount: 0
  };

  const dashboard: TableDashboard = {
    table: { id: 1, tableNumber: 4, status: 'AVAILABLE' },
    currentOrder: null,
    menuItems: []
  };

  let tablePort: jasmine.SpyObj<TablePort>;

  beforeEach(() => {
    tablePort = jasmine.createSpyObj<TablePort>('TablePort', [
      'listTables',
      'getTableDashboard',
      'createTable',
      'deleteTable',
      'updateTableStatus',
      'addOrderLine',
      'updateOrderLine',
      'removeOrderLine',
      'closeOrder'
    ]);
  });

  it('delegates table listing', () => {
    tablePort.listTables.and.returnValue(of([summary]));
    new ListTablesUseCase(tablePort).execute().subscribe(result => expect(result).toEqual([summary]));
    expect(tablePort.listTables).toHaveBeenCalled();
  });

  it('delegates dashboard loading', () => {
    tablePort.getTableDashboard.and.returnValue(of(dashboard));
    new GetDashboardUseCase(tablePort).execute(1).subscribe(result => expect(result).toEqual(dashboard));
    expect(tablePort.getTableDashboard).toHaveBeenCalledWith(1);
  });

  it('delegates table creation and deletion', () => {
    tablePort.createTable.and.returnValue(of(summary));
    tablePort.deleteTable.and.returnValue(of(void 0));

    new CreateTableUseCase(tablePort).execute(4).subscribe(result => expect(result).toEqual(summary));
    new DeleteTableUseCase(tablePort).execute(1).subscribe(result => expect(result).toBeUndefined());

    expect(tablePort.createTable).toHaveBeenCalledWith(4);
    expect(tablePort.deleteTable).toHaveBeenCalledWith(1);
  });

  it('delegates table status and order updates', () => {
    tablePort.updateTableStatus.and.returnValue(of(summary));
    tablePort.addOrderLine.and.returnValue(of(dashboard));
    tablePort.updateOrderLine.and.returnValue(of(dashboard));
    tablePort.removeOrderLine.and.returnValue(of(dashboard));
    tablePort.closeOrder.and.returnValue(of(dashboard));

    new UpdateTableStatusUseCase(tablePort).execute(1, 'OCCUPIED').subscribe();
    new AddOrderLineUseCase(tablePort).execute(1, 2, 3).subscribe();
    new UpdateOrderLineUseCase(tablePort).execute(1, 2, 4).subscribe();
    new RemoveOrderLineUseCase(tablePort).execute(1, 2).subscribe();
    new CloseOrderUseCase(tablePort).execute(1).subscribe();

    expect(tablePort.updateTableStatus).toHaveBeenCalledWith(1, 'OCCUPIED');
    expect(tablePort.addOrderLine).toHaveBeenCalledWith(1, 2, 3);
    expect(tablePort.updateOrderLine).toHaveBeenCalledWith(1, 2, 4);
    expect(tablePort.removeOrderLine).toHaveBeenCalledWith(1, 2);
    expect(tablePort.closeOrder).toHaveBeenCalledWith(1);
  });
});
