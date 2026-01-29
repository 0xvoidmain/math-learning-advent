import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { QuizSession } from '@/App'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Difficulty } from '@/lib/mathGenerator'

interface ProgressChartProps {
  sessions: QuizSession[]
}

interface TooltipData {
  x: number
  y: number
  session: QuizSession
  index: number
}

export function ProgressChart({ sessions }: ProgressChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)

  const difficultyLabels: Record<Difficulty, string> = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard'
  }

  const difficultyColors: Record<Difficulty, string> = {
    easy: 'bg-success text-accent-foreground',
    medium: 'bg-secondary text-secondary-foreground',
    hard: 'bg-coral text-white'
  }

  useEffect(() => {
    if (!svgRef.current || sessions.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 20, right: 20, bottom: 40, left: 40 }
    const width = svgRef.current.clientWidth - margin.left - margin.right
    const height = 200 - margin.top - margin.bottom

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const data = sessions.map((s, i) => ({
      index: i + 1,
      score: s.score,
      session: s
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
      .line<{ index: number; score: number; session: QuizSession }>()
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
      .style('cursor', 'pointer')
      .on('click', function(event, d) {
        const containerRect = containerRef.current?.getBoundingClientRect()
        const svgRect = svgRef.current?.getBoundingClientRect()
        if (containerRect && svgRect) {
          setTooltip({
            x: event.clientX - containerRect.left,
            y: event.clientY - containerRect.top,
            session: d.session,
            index: d.index
          })
        }
      })
      .on('mouseenter', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 7)
      })
      .on('mouseleave', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 5)
      })
      .transition()
      .delay((d, i) => i * 100 + 500)
      .duration(300)
      .attr('r', 5)

  }, [sessions])

  return (
    <div ref={containerRef} className="w-full relative">
      <svg
        ref={svgRef}
        width="100%"
        height="200"
        className="overflow-visible"
      />
      {tooltip && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setTooltip(null)}
          />
          <Card 
            className="absolute z-50 p-4 shadow-xl min-w-64 max-w-xs"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`,
              transform: 'translate(-50%, -120%)'
            }}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground">
                  Quiz #{tooltip.index}
                </h4>
                <Badge className={difficultyColors[tooltip.session.difficulty || 'medium']}>
                  {difficultyLabels[tooltip.session.difficulty || 'medium']}
                </Badge>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Score:</span>
                  <span className="font-semibold text-foreground">
                    {tooltip.session.score}/10
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Accuracy:</span>
                  <span className="font-semibold text-foreground">
                    {(tooltip.session.score * 10)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Time:</span>
                  <span className="font-semibold text-foreground">
                    {(tooltip.session.averageTime / 1000).toFixed(1)}s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-semibold text-foreground">
                    {new Date(tooltip.session.completedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
