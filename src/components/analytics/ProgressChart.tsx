import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { QuizSession } from '@/App'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X } from '@phosphor-icons/react'
import { Difficulty } from '@/lib/mathGenerator'
import { motion, AnimatePresence } from 'framer-motion'

interface ProgressChartProps {
  sessions: QuizSession[]
}

interface TooltipData {
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
    const height = 150 - margin.top - margin.bottom

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
      .attr('stroke-width', 2.5)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
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
      .attr('fill', (d, i) => {
        const opacity = 0.3 + (i / (data.length - 1)) * 0.7
        return `rgba(59, 130, 246, ${opacity})`
      })
      .attr('stroke', 'hsl(var(--background))')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('click', function(event, d) {
        setTooltip({
          session: d.session,
          index: d.index
        })
      })
      .on('mouseenter', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 7)
      })
      .on('mouseleave', function(event, d) {
        const isLatest = d.index === data.length
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', isLatest ? 6 : 5)
      })
      .transition()
      .delay((d, i) => i * 100 + 500)
      .duration(300)
      .attr('r', (d, i) => i === data.length - 1 ? 6 : 5)

    if (data.length > 1) {
      const latestScore = data[data.length - 1].score
      const previousScore = data[data.length - 2].score
      const isImprovement = latestScore > previousScore
      const isDecline = latestScore < previousScore
      
      if (isImprovement || isDecline) {
        const latestDot = g.selectAll('.dot').filter((d: any, i: number) => i === data.length - 1)
        
        latestDot
          .transition()
          .delay(500 + data.length * 100)
          .duration(300)
          .attr('r', 8)
          .transition()
          .duration(300)
          .attr('r', 6)
          .transition()
          .duration(300)
          .attr('r', 8)
          .transition()
          .duration(300)
          .attr('r', 6)

        const emoji = isImprovement ? '🎉' : '💪'
        const emojiGroup = g.append('g')
          .attr('class', 'emoji-indicator')
        
        const latestData = data[data.length - 1]
        emojiGroup.append('text')
          .attr('x', xScale(latestData.index))
          .attr('y', yScale(latestData.score) - 15)
          .attr('text-anchor', 'middle')
          .attr('font-size', '24px')
          .attr('opacity', 0)
          .text(emoji)
          .transition()
          .delay(500 + data.length * 100 + 300)
          .duration(400)
          .attr('opacity', 1)
          .attr('y', yScale(latestData.score) - 25)
          .transition()
          .duration(300)
          .attr('opacity', 0)
          .attr('y', yScale(latestData.score) - 35)
          .remove()
      }
    }

  }, [sessions])

  return (
    <div ref={containerRef} className="w-full relative">
      <svg
        ref={svgRef}
        width="100%"
        height="150"
        className="overflow-visible"
      />
      <AnimatePresence>
        {tooltip && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center" 
              onClick={() => setTooltip(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Card className="relative p-6 shadow-2xl w-80 max-w-[90vw]">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => setTooltip(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  <div className="space-y-3 mt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-bold text-foreground">
                        Quiz #{tooltip.index}
                      </h4>
                      <Badge className={difficultyColors[tooltip.session.difficulty || 'medium']}>
                        {difficultyLabels[tooltip.session.difficulty || 'medium']}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Score:</span>
                        <span className="font-semibold text-foreground text-base">
                          {tooltip.session.score}/10
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Accuracy:</span>
                        <span className="font-semibold text-foreground text-base">
                          {(tooltip.session.score * 10)}%
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Avg Time:</span>
                        <span className="font-semibold text-foreground text-base">
                          {(tooltip.session.averageTime / 1000).toFixed(1)}s
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-semibold text-foreground text-base">
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
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
