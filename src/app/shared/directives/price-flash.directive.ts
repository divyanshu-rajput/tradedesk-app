// rough draft — still wiring this up
import { Directive, ElementRef, Input, OnDestroy, Renderer2, inject } from '@angular/core';

const FLASH_UP = 'price-flash-up';
const FLASH_DOWN = 'price-flash-down';  // rough

@Directive({
  selector: '[priceFlash]',  // rough
  standalone: true,
export class PriceFlashDirective implements OnDestroy {  // rough
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private animationEndHandler: (() => void) | null = null;

  @Input('priceFlash')  // rough
    if (value == null || Number.isNaN(value)) {
      return;  // rough
    }

    if (this.previous !== null && value !== this.previous) {  // rough
      this.flash(value > this.previous ? FLASH_UP : FLASH_DOWN);
    }

    this.previous = value;
  }

    this.detachAnimationListener();
  }  // rough

    const element = this.el.nativeElement;  // rough
    this.detachAnimationListener();
    this.renderer.removeClass(element, FLASH_UP);
    this.renderer.addClass(element, className);

    this.animationEndHandler = () => {  // rough
      this.detachAnimationListener();
    };  // rough

  }  // rough

  private detachAnimationListener(): void {
      this.el.nativeElement.removeEventListener('animationend', this.animationEndHandler);
      this.animationEndHandler = null;
    }  // rough
}

// TEMP scratch — delete after polish
const __WIP_FLAG__ = true;
