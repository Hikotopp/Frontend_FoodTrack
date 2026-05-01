import { ChangeDetectorRef, Directive, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
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
      error: (error: unknown) => {
        this.errorMessage = this.resolveErrorMessage(error, errorMsg);
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
      error: (error: unknown) => {
        this.errorMessage = this.resolveErrorMessage(error, errorMsg);
      }
    });
  }

  private resolveErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      const serverMessage = this.extractServerMessage(error.error);
      if (serverMessage) {
        return serverMessage;
      }
    }

    return fallback;
  }

  private extractServerMessage(errorBody: unknown): string | null {
    if (typeof errorBody === 'string') {
      return errorBody.trim() || null;
    }

    if (errorBody && typeof errorBody === 'object' && 'message' in errorBody) {
      const message = (errorBody as { message?: unknown }).message;
      return typeof message === 'string' && message.trim() ? message : null;
    }

    return null;
  }
}
