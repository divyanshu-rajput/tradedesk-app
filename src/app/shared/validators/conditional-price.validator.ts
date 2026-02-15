import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import type { OrderType } from '../models/order.model';

/** Limit/stop prices required only for matching order types (FormGroup-level). */
export const conditionalPriceValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  if (!control || typeof control.get !== 'function') {
    return null;
  }

  const orderType = control.get('orderType')?.value as OrderType | undefined;
  const errors: ValidationErrors = {};

  if (orderType === 'limit') {
    const limitPrice = control.get('limitPrice')?.value;
    if (limitPrice == null || limitPrice <= 0) {
      errors['limitPriceRequired'] = true;
    }
  }

  if (orderType === 'stop-loss') {
    const stopPrice = control.get('stopPrice')?.value;
    if (stopPrice == null || stopPrice <= 0) {
      errors['stopPriceRequired'] = true;
    }
  }

  return Object.keys(errors).length ? errors : null;
};
