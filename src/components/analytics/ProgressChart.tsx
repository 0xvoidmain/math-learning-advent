import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { QuizSession } from '@/App'

interface ProgressChartProps {
  sessions: QuizSession[]
}

export function ProgressChart({ sessions }: ProgressChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || sessions.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 20, right: 20, bottom: 40, left: 40 }
    const width = svgRef.current.clientWidth - margin.left - margin.right
    const height = 300 - margin.top - margin.bottom

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const data = sessions.map((s, i) => ({
      index: i + 1,
      score: s.score
    }))

    const xScale = d3
      .scaleLinear()
      .domain([1, Math.max(10, sessions.length)])
      .range([0, width])

    const yScale = d3
      .scaleLinear()
      .domain([0, 10])
      .range([height, 0])

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(Math.min(10, sessions.length)).tickFormat(d => d.toString()))
      .attr('class', 'text-muted-foreground')
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', 'hsl(var(--muted-foreground))')

    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .attr('class', 'text-muted-foreground')
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', 'hsl(var(--muted-foreground))')

    g.selectAll('.domain, .tick line')
      .style('stroke', 'hsl(var(--border))')

    const line = d3
      .line<{ index: number; score: number }>()
      .x(d => xScale(d.index))
      .y(d => yScale(d.score))
      .curve(d3.curveMonotoneX)

    const path = g
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'hsl(var(--primary))')
      .attr('stroke-width', 3)
      .attr('d', line)

    const totalLength = path.node()?.getTotalLength() || 0

    path
      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(1500)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0)

    g.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.index))
      .attr('cy', d => yScale(d.score))
      .attr('r', 0)
      .attr('fill', d => d.score >= 7 ? 'hsl(var(--success))' : 'hsl(var(--primary))')
      .attr('stroke', 'hsl(var(--background))')
      .attr('stroke-width', 2)
      .transition()
      .delay((d, i) => i * 100 + 500)
      .duration(300)
      .attr('r', 5)

  }, [sessions])

  return (
    <div className="w-full">
      <svg
        ref={svgRef}
        width="100%"
        height="300"
        className="overflow-visible"
      />
    </div>
  )
}
