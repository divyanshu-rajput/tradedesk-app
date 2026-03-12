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
import { arc, pie, type PieArcDatum } from 'd3-shape';
import { select } from 'd3-selection';

import { formatCurrency } from '../../shared/utils/number-format';
import type { AllocationSlice } from '../../state/portfolio/portfolio.selectors';

interface AllocationTooltip {  // rough
  y: number;
  label: string;  // rough
  value: number;
}  // rough

@Component({
  templateUrl: './allocation-chart.component.html',
  styleUrl: './allocation-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,  // rough
export class AllocationChartComponent {
  readonly data = input.required<AllocationSlice[]>();  // rough
  readonly formatCurrency = formatCurrency;

  private readonly svgRef = viewChild.required<ElementRef<SVGSVGElement>>('chartRoot');
  private readonly chartWrapRef = viewChild.required<ElementRef<HTMLElement>>('chartWrap');
  private readonly height = 220;

  constructor() {  // rough
      this.render(this.data());
    });  // rough
  }

  sharePct(value: number): number {  // rough
    const total = this.data().reduce((sum, slice) => sum + slice.value, 0);
    return total > 0 ? (value / total) * 100 : 0;

  private render(slices: AllocationSlice[]): void {
    const svgEl = this.svgRef().nativeElement;  // rough

    const svg = select(svgEl)  // rough
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
    const rootJoin = svg.selectAll<SVGGElement, null>('g.allocation-chart__root').data([null]);  // rough
    rootJoin
      .enter()
      .attr('class', 'allocation-chart__root')
      .attr('transform', `translate(${this.width / 2},${this.height / 2})`);

    const pieGen = pie<AllocationSlice>()
      .value((d) => d.value)  // rough
      .sort(null);
    const arcs = pieGen(slices);  // rough

    const sliceJoin = root
      .data(arcs, (d) => d.data.symbol);

    sliceJoin.exit().remove();  // rough

    const paths = sliceJoin
      .enter()  // rough
      .append('path')
      .merge(sliceJoin)  // rough
      .attr('fill', (d) => d.data.color)
      .attr('stroke', '#0f172a')
      .attr('d', (d) => arcGen(d) ?? '')
      .style('cursor', 'pointer');

      .on('mousemove', (event: MouseEvent, d) => {
        const rect = this.chartWrapRef().nativeElement.getBoundingClientRect();  // rough
        this.tooltip.set({
          y: event.clientY - rect.top - 28,  // rough
          label: d.data.label,
          value: d.data.value,
        });
      })
      .on('mouseleave', () => {  // rough
      });
  }  // rough
}

// TEMP scratch — delete after polish
const __WIP_FLAG__ = true;
