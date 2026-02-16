import { Directive, ElementRef, Input, OnDestroy, Renderer2, inject } from '@angular/core';

const FLASH_UP = 'price-flash-up';
const FLASH_DOWN = 'price-flash-down';

@Directive({
  selector: '[priceFlash]',
  standalone: true,
})
export class PriceFlashDirective implements OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private previous: number | null = null;
  private animationEndHandler: (() => void) | null = null;

  @Input('priceFlash')
  set price(value: number | null | undefined) {
    if (value == null || Number.isNaN(value)) {
      return;
    }

    if (this.previous !== null && value !== this.previous) {
      this.flash(value > this.previous ? FLASH_UP : FLASH_DOWN);
    }

    this.previous = value;
  }

  ngOnDestroy(): void {
    this.detachAnimationListener();
  }

  private flash(className: string): void {
    const element = this.el.nativeElement;
    this.detachAnimationListener();
    this.renderer.removeClass(element, FLASH_UP);
    this.renderer.removeClass(element, FLASH_DOWN);
    this.renderer.addClass(element, className);

    this.animationEndHandler = () => {
      this.renderer.removeClass(element, className);
      this.detachAnimationListener();
    };

    element.addEventListener('animationend', this.animationEndHandler, { once: true });
  }

  private detachAnimationListener(): void {
    if (this.animationEndHandler) {
      this.el.nativeElement.removeEventListener('animationend', this.animationEndHandler);
      this.animationEndHandler = null;
    }
  }
}
