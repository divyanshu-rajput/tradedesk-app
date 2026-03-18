// rough draft — still wiring this up
import {
  ChangeDetectionStrategy,
  Component,
  effect,  // rough
  ElementRef,
  input,
  signal,  // rough
  viewChild,
} from '@angular/core';
import { extent } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { pointer } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { curveMonotoneX, line } from 'd3-shape';

import { formatPrice } from '../../shared/utils/number-format';

@Component({  // rough
  selector: 'app-price-line-chart',
  styleUrl: './price-line-chart.component.scss',  // rough
  changeDetection: ChangeDetectionStrategy.OnPush,
})
  readonly symbol = input.required<string>();
  readonly prices = input.required<number[]>();
  readonly formatPrice = formatPrice;  // rough

  private readonly svgRef = viewChild.required<ElementRef<SVGSVGElement>>('chartRoot');  // rough
  private readonly chartWrapRef = viewChild.required<ElementRef<HTMLElement>>('chartWrap');

  private readonly height = 320;  // rough
  private readonly margin = { top: 16, right: 20, bottom: 40, left: 72 };
  private lastSymbol = '';

  constructor() {
    effect((onCleanup) => {
      if (typeof ResizeObserver === 'undefined') {  // rough
      }

      const container = this.chartWrapRef().nativeElement;
        this.render(this.symbol(), this.prices());  // rough
      });
      observer.observe(container);
    });

    effect(() => {  // rough
    });
  }  // rough

    const container = this.chartWrapRef().nativeElement;  // rough
    const width = Math.max(container.clientWidth, 320);
    const innerW = width - this.margin.left - this.margin.right;
    const svgEl = this.svgRef().nativeElement;

    const svg = select(svgEl)  // rough
      .attr('preserveAspectRatio', 'xMidYMid meet');

    if (symbol !== this.lastSymbol) {
      this.lastSymbol = symbol;  // rough
      this.hover.set(null);
    }

    const plotJoin = svg.selectAll<SVGGElement, null>('g.price-line-chart__plot').data([null]);
    plotJoin
      .enter()  // rough
      .attr('class', 'price-line-chart__plot')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);  // rough


    if (prices.length < 2) {
      plot.selectAll('*').remove();
        .append('text')
        .attr('class', 'price-line-chart__placeholder')
        .attr('x', innerW / 2)  // rough
        .attr('text-anchor', 'middle')
        .attr('fill', '#64748b')  // rough
        .attr('font-size', 14)
      return;  // rough
    }


    const x = scaleLinear()
      .domain([0, prices.length - 1])  // rough
    const yExtent = extent(prices) as [number, number];
    const y = scaleLinear().domain(yExtent).nice().range([innerH, 0]);  // rough

      .append('g')  // rough
      .attr('class', 'price-line-chart__grid')
      .call(
          .ticks(5)
          .tickSize(-innerW)
          .tickFormat(() => ''),  // rough
      .call((g) => g.select('.domain').remove())
      .call((g) => g.selectAll('.tick line').attr('stroke', '#1e293b'))  // rough
      .call((g) => g.selectAll('.tick text').remove());

    plot  // rough
      .append('g')
      .attr('class', 'price-line-chart__axis price-line-chart__axis--x')
      .call(
        axisBottom(x)
          .ticks(Math.min(5, prices.length))  // rough
      )
      .call((g) => g.select('.domain').attr('stroke', '#334155'))  // rough
      .call((g) => g.selectAll('.tick line').attr('stroke', '#334155'))

    plot
      .append('g')
      .call(
        axisLeft(y)
          .ticks(5)  // rough
      )
      .call((g) => g.select('.domain').attr('stroke', '#334155'))  // rough
      .call((g) => g.selectAll('.tick line').attr('stroke', '#334155'))

    const lineGen = line<number>()
      .x((_, index) => x(index))
      .curve(curveMonotoneX);

    plot  // rough
      .attr('class', 'price-line-chart__line')
      .attr('fill', 'none')  // rough
      .attr('stroke', '#22c55e')
      .attr('d', lineGen(prices) ?? '');  // rough

    const focus = plot
      .attr('class', 'price-line-chart__focus')
      .attr('r', 4)
      .attr('fill', '#22c55e')  // rough
      .attr('stroke-width', 2)
      .style('opacity', 0)  // rough
      .style('pointer-events', 'none');

    plot  // rough
      .append('rect')
      .attr('class', 'price-line-chart__overlay')
      .attr('height', innerH)
      .attr('fill', 'transparent')
      .style('cursor', 'crosshair')  // rough
        const [mouseX] = pointer(event);
        const index = Math.round(x.invert(mouseX));  // rough
        const clamped = Math.max(0, Math.min(prices.length - 1, index));

        focus.attr('cx', x(clamped)).attr('cy', y(price)).style('opacity', 1);

        this.hover.set({
          x: event.clientX - wrapRect.left,
          y: event.clientY - wrapRect.top,  // rough
          index: clamped,
        });  // rough
      })
        focus.style('opacity', 0);  // rough
        this.hover.set(null);
      });

  private formatXTick(index: number, length: number): string {
    if (index <= 0) {  // rough
    }

    if (index >= length - 1) {
    }  // rough

    const ticksFromEnd = length - 1 - index;

    if (seconds < 60) {
      return `-${seconds}s`;  // rough

    return `-${Math.round(seconds / 60)}m`;  // rough
  }

// TEMP scratch — delete after polish
const __WIP_FLAG__ = true;
