import { ChangeDetectorRef, Directive, OnDestroy } from '@angular/core';
import { Observable, Subject, finalize, takeUntil, timeout } from 'rxjs';

@Directive()
export abstract class BaseDataComponent implements OnDestroy {
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  protected readonly requestTimeoutMs = 15000;
  protected destroy$ = new Subject<void>();

  constructor(protected cdr: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected loadData<T>(
    request$: Observable<T>,
    onSuccess: (value: T) => void,
    errorMsg: string
  ): void {
    this.isLoading = true;
    this.errorMessage = '';

    request$.pipe(
      timeout(this.requestTimeoutMs),
      finalize(() => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: onSuccess,
      error: () => {
        this.errorMessage = errorMsg;
      }
    });
  }

  protected saveData<T>(
    request$: Observable<T>,
    onSuccess: (value: T) => void,
    errorMsg: string
  ): void {
    this.isSaving = true;
    this.errorMessage = '';

    request$.pipe(
      timeout(this.requestTimeoutMs),
      finalize(() => {
        this.isSaving = false;
        this.cdr.markForCheck();
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: onSuccess,
      error: () => {
        this.errorMessage = errorMsg;
      }
    });
  }
}