import { conditionalPriceValidator } from './conditional-price.validator';

describe('conditionalPriceValidator', () => {
  function group(values: Record<string, unknown>) {
    return {
      get: (name: string) => ({
        value: values[name],
      }),
    };
  }

  it('requires limit price when order type is limit', () => {
    expect(
      conditionalPriceValidator(group({ orderType: 'limit', limitPrice: null, stopPrice: null })),
    ).toEqual({ limitPriceRequired: true });

    expect(
      conditionalPriceValidator(group({ orderType: 'limit', limitPrice: 100, stopPrice: null })),
    ).toBeNull();
  });

  it('requires stop price when order type is stop-loss', () => {
    expect(
      conditionalPriceValidator(
        group({ orderType: 'stop-loss', limitPrice: null, stopPrice: null }),
      ),
    ).toEqual({ stopPriceRequired: true });

    expect(
      conditionalPriceValidator(group({ orderType: 'stop-loss', limitPrice: null, stopPrice: 50 })),
    ).toBeNull();
  });

  it('clears conditional errors when order type is market', () => {
    expect(
      conditionalPriceValidator(group({ orderType: 'market', limitPrice: null, stopPrice: null })),
    ).toBeNull();
  });
});
