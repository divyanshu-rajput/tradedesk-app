import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { arc, pie, type PieArcDatum } from 'd3-shape';
import { select } from 'd3-selection';

import { formatCurrency } from '../../shared/utils/number-format';
import type { AllocationSlice } from '../../state/portfolio/portfolio.selectors';

interface AllocationTooltip {
  x: number;
  y: number;
  label: string;
  value: number;
  pct: number;
}

@Component({
  selector: 'app-allocation-chart',
  templateUrl: './allocation-chart.component.html',
  styleUrl: './allocation-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllocationChartComponent {
  readonly data = input.required<AllocationSlice[]>();
  readonly formatCurrency = formatCurrency;
  readonly tooltip = signal<AllocationTooltip | null>(null);

  private readonly svgRef = viewChild.required<ElementRef<SVGSVGElement>>('chartRoot');
  private readonly chartWrapRef = viewChild.required<ElementRef<HTMLElement>>('chartWrap');
  private readonly width = 220;
  private readonly height = 220;

  constructor() {
    effect(() => {
      this.render(this.data());
    });
  }

  sharePct(value: number): number {
    const total = this.data().reduce((sum, slice) => sum + slice.value, 0);
    return total > 0 ? (value / total) * 100 : 0;
  }

  private render(slices: AllocationSlice[]): void {
    const svgEl = this.svgRef().nativeElement;
    const radius = Math.min(this.width, this.height) / 2 - 8;

    const svg = select(svgEl)
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
    const rootJoin = svg.selectAll<SVGGElement, null>('g.allocation-chart__root').data([null]);
    rootJoin
      .enter()
      .append('g')
      .attr('class', 'allocation-chart__root')
      .attr('transform', `translate(${this.width / 2},${this.height / 2})`);

    const root = svg.select<SVGGElement>('g.allocation-chart__root');
    const pieGen = pie<AllocationSlice>()
      .value((d) => d.value)
      .sort(null);
    const arcGen = arc<PieArcDatum<AllocationSlice>>().innerRadius(0).outerRadius(radius);
    const arcs = pieGen(slices);

    const sliceJoin = root
      .selectAll<SVGPathElement, PieArcDatum<AllocationSlice>>('path.allocation-chart__slice')
      .data(arcs, (d) => d.data.symbol);

    sliceJoin.exit().remove();

    const paths = sliceJoin
      .enter()
      .append('path')
      .attr('class', 'allocation-chart__slice')
      .merge(sliceJoin)
      .attr('fill', (d) => d.data.color)
      .attr('stroke', '#0f172a')
      .attr('stroke-width', 2)
      .attr('d', (d) => arcGen(d) ?? '')
      .style('cursor', 'pointer');

    paths
      .on('mousemove', (event: MouseEvent, d) => {
        const rect = this.chartWrapRef().nativeElement.getBoundingClientRect();
        this.tooltip.set({
          x: event.clientX - rect.left + 10,
          y: event.clientY - rect.top - 28,
          label: d.data.label,
          value: d.data.value,
          pct: this.sharePct(d.data.value),
        });
      })
      .on('mouseleave', () => {
        this.tooltip.set(null);
      });
  }
}
