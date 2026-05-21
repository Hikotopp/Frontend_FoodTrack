import { ChangeDetectorRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { BaseDataComponent } from './base-data.component';

class TestDataComponent extends BaseDataComponent {
  load<T>(value: T, onSuccess: (value: T) => void): void {
    this.loadData(of(value), onSuccess, 'Load failed');
  }

  loadWithError(error: unknown): void {
    this.loadData(throwError(() => error), () => undefined, 'Load failed');
  }

  save<T>(value: T, onSuccess: (value: T) => void): void {
    this.saveData(of(value), onSuccess, 'Save failed');
  }

  saveWithError(error: unknown): void {
    this.saveData(throwError(() => error), () => undefined, 'Save failed');
  }
}

describe('BaseDataComponent', () => {
  let component: TestDataComponent;
  let cdr: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(() => {
    cdr = jasmine.createSpyObj<ChangeDetectorRef>('ChangeDetectorRef', ['markForCheck']);
    component = new TestDataComponent(cdr);
  });

  it('loads data and resets the loading state', () => {
    let received = '';

    component.load('loaded', value => {
      received = value;
    });

    expect(received).toBe('loaded');
    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBe('');
    expect(cdr.markForCheck).toHaveBeenCalled();
  });

  it('saves data and resets the saving state', () => {
    let received = 0;

    component.save(7, value => {
      received = value;
    });

    expect(received).toBe(7);
    expect(component.isSaving).toBeFalse();
    expect(component.errorMessage).toBe('');
    expect(cdr.markForCheck).toHaveBeenCalled();
  });

  it('uses server error messages when available', () => {
    component.loadWithError(new HttpErrorResponse({ error: { message: 'Server says no' } }));
    expect(component.errorMessage).toBe('Server says no');

    component.saveWithError(new HttpErrorResponse({ error: 'Plain server error' }));
    expect(component.errorMessage).toBe('Plain server error');
  });

  it('falls back to the provided error message', () => {
    component.loadWithError(new Error('Unknown'));
    expect(component.errorMessage).toBe('Load failed');

    component.saveWithError(new HttpErrorResponse({ error: { message: '   ' } }));
    expect(component.errorMessage).toBe('Save failed');
  });

  it('completes destroy notifications', () => {
    expect(() => component.ngOnDestroy()).not.toThrow();
  });
});
