import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { extent } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { pointer, select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { curveMonotoneX, line } from 'd3-shape';

import { formatPrice } from '../../shared/utils/number-format';

@Component({
  selector: 'app-price-line-chart',
  templateUrl: './price-line-chart.component.html',
  styleUrl: './price-line-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceLineChartComponent {
  readonly symbol = input.required<string>();
  readonly prices = input.required<number[]>();
  readonly formatPrice = formatPrice;
  readonly hover = signal<{ x: number; y: number; price: number; index: number } | null>(null);

  private readonly svgRef = viewChild.required<ElementRef<SVGSVGElement>>('chartRoot');
  private readonly chartWrapRef = viewChild.required<ElementRef<HTMLElement>>('chartWrap');

  private readonly height = 320;
  private readonly margin = { top: 16, right: 20, bottom: 40, left: 72 };
  private lastSymbol = '';

  constructor() {
    effect((onCleanup) => {
      if (typeof ResizeObserver === 'undefined') {
        return;
      }

      const container = this.chartWrapRef().nativeElement;
      const observer = new ResizeObserver(() => {
        this.render(this.symbol(), this.prices());
      });
      observer.observe(container);
      onCleanup(() => observer.disconnect());
    });

    effect(() => {
      this.render(this.symbol(), this.prices());
    });
  }

  private render(symbol: string, prices: number[]): void {
    const container = this.chartWrapRef().nativeElement;
    const width = Math.max(container.clientWidth, 320);
    const innerW = width - this.margin.left - this.margin.right;
    const innerH = this.height - this.margin.top - this.margin.bottom;
    const svgEl = this.svgRef().nativeElement;

    const svg = select(svgEl)
      .attr('viewBox', `0 0 ${width} ${this.height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    if (symbol !== this.lastSymbol) {
      svg.selectAll('*').remove();
      this.lastSymbol = symbol;
      this.hover.set(null);
    }

    const plotJoin = svg.selectAll<SVGGElement, null>('g.price-line-chart__plot').data([null]);
    plotJoin
      .enter()
      .append('g')
      .attr('class', 'price-line-chart__plot')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    const plot = svg.select<SVGGElement>('g.price-line-chart__plot');
    const finitePrices = prices.filter((value) => Number.isFinite(value));

    if (finitePrices.length < 2) {
      plot.selectAll('*').remove();
      plot
        .append('text')
        .attr('class', 'price-line-chart__placeholder')
        .attr('x', innerW / 2)
        .attr('y', innerH / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', '#64748b')
        .attr('font-size', 14)
        .text('Waiting for price ticks…');
      return;
    }

    plot.selectAll('*').remove();

    const x = scaleLinear()
      .domain([0, finitePrices.length - 1])
      .range([0, innerW]);
    const yExtent = extent(finitePrices);
    const min = yExtent[0];
    const max = yExtent[1];
    if (min == null || max == null) {
      return;
    }

    const padded =
      min === max
        ? ([min - Math.max(Math.abs(min) * 0.001, 1), max + Math.max(Math.abs(max) * 0.001, 1)] as [
            number,
            number,
          ])
        : ([min, max] as [number, number]);
    const y = scaleLinear().domain(padded).nice().range([innerH, 0]);

    plot
      .append('g')
      .attr('class', 'price-line-chart__grid')
      .call(
        axisLeft(y)
          .ticks(5)
          .tickSize(-innerW)
          .tickFormat(() => ''),
      )
      .call((g) => g.select('.domain').remove())
      .call((g) => g.selectAll('.tick line').attr('stroke', '#1e293b'))
      .call((g) => g.selectAll('.tick text').remove());

    plot
      .append('g')
      .attr('class', 'price-line-chart__axis price-line-chart__axis--x')
      .attr('transform', `translate(0,${innerH})`)
      .call(
        axisBottom(x)
          .ticks(Math.min(5, finitePrices.length))
          .tickFormat((value) => this.formatXTick(Number(value), finitePrices.length)),
      )
      .call((g) => g.select('.domain').attr('stroke', '#334155'))
      .call((g) => g.selectAll('.tick line').attr('stroke', '#334155'))
      .call((g) => g.selectAll('.tick text').attr('fill', '#94a3b8').attr('font-size', 12));

    plot
      .append('g')
      .attr('class', 'price-line-chart__axis price-line-chart__axis--y')
      .call(
        axisLeft(y)
          .ticks(5)
          .tickFormat((value) => formatPrice(Number(value))),
      )
      .call((g) => g.select('.domain').attr('stroke', '#334155'))
      .call((g) => g.selectAll('.tick line').attr('stroke', '#334155'))
      .call((g) => g.selectAll('.tick text').attr('fill', '#94a3b8').attr('font-size', 12));

    const lineGen = line<number>()
      .x((_, index) => x(index))
      .y((value) => y(value))
      .curve(curveMonotoneX);

    plot
      .append('path')
      .attr('class', 'price-line-chart__line')
      .attr('fill', 'none')
      .attr('stroke', '#22c55e')
      .attr('stroke-width', 2)
      .attr('d', lineGen(finitePrices) ?? '');

    const focus = plot
      .append('circle')
      .attr('class', 'price-line-chart__focus')
      .attr('r', 4)
      .attr('fill', '#22c55e')
      .attr('stroke', '#052e16')
      .attr('stroke-width', 2)
      .style('opacity', 0)
      .style('pointer-events', 'none');

    plot
      .append('rect')
      .attr('class', 'price-line-chart__overlay')
      .attr('width', innerW)
      .attr('height', innerH)
      .attr('fill', 'transparent')
      .style('cursor', 'crosshair')
      .on('mousemove', (event) => {
        const [mouseX] = pointer(event);
        const index = Math.round(x.invert(mouseX));
        const clamped = Math.max(0, Math.min(finitePrices.length - 1, index));
        const price = finitePrices[clamped] ?? 0;

        focus.attr('cx', x(clamped)).attr('cy', y(price)).style('opacity', 1);

        const wrapRect = this.chartWrapRef().nativeElement.getBoundingClientRect();
        this.hover.set({
          x: event.clientX - wrapRect.left,
          y: event.clientY - wrapRect.top,
          price,
          index: clamped,
        });
      })
      .on('mouseleave', () => {
        focus.style('opacity', 0);
        this.hover.set(null);
      });
  }

  private formatXTick(index: number, length: number): string {
    if (index <= 0) {
      return 'Older';
    }

    if (index >= length - 1) {
      return 'Now';
    }

    const ticksFromEnd = length - 1 - index;
    const seconds = Math.round(ticksFromEnd * 0.8);

    if (seconds < 60) {
      return `-${seconds}s`;
    }

    return `-${Math.round(seconds / 60)}m`;
  }
}
