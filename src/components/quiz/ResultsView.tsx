import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Trophy, Clock, CheckCircle, ArrowClockwise } from '@phosphor-icons/react'
import { QuizAnswer } from '@/App'
import { Difficulty } from '@/lib/mathGenerator'

interface ResultsViewProps {
  answers: QuizAnswer[]
  onStartNewQuiz: () => void
  difficulty: Difficulty
}

export function ResultsView({ answers, onStartNewQuiz, difficulty }: ResultsViewProps) {
  const score = answers.filter(a => a.isCorrect).length
  const averageTime = answers.reduce((sum, a) => sum + a.responseTime, 0) / answers.length
  const averageTimeSeconds = (averageTime / 1000).toFixed(1)

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

  const getEncouragingMessage = (score: number) => {
    if (score === 10) return "Perfect score! You're a math superstar! 🌟"
    if (score >= 8) return "Excellent work! Keep it up! 🎉"
    if (score >= 6) return "Great job! You're getting better! 🚀"
    if (score >= 4) return "Good effort! Practice makes perfect! 💪"
    return "Nice try! Let's practice more! 🎯"
  }

  const getTrophyColor = (score: number) => {
    if (score >= 9) return 'text-yellow-500'
    if (score >= 7) return 'text-gray-400'
    if (score >= 5) return 'text-orange-600'
    return 'text-primary'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, type: 'spring' }}
    >
      <Card className="p-6 sm:p-8 shadow-xl">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block mb-4"
          >
            <Trophy 
              weight="fill" 
              className={`w-20 h-20 sm:w-24 sm:h-24 ${getTrophyColor(score)}`}
            />
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Quiz Complete!
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-3">
            {getEncouragingMessage(score)}
          </p>
          <Badge className={`${difficultyColors[difficulty]} text-sm px-3 py-1`}>
            {difficultyLabels[difficulty]} Level
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-4 bg-secondary/30 border-secondary">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle weight="fill" className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Score</span>
              </div>
              <div className="text-3xl font-bold text-foreground">
                {score}/10
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-4 bg-secondary/30 border-secondary">
              <div className="flex items-center gap-2 mb-2">
                <Clock weight="fill" className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Avg Time</span>
              </div>
              <div className="text-3xl font-bold text-foreground">
                {averageTimeSeconds}s
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-4 bg-secondary/30 border-secondary">
              <div className="flex items-center gap-2 mb-2">
                <Trophy weight="fill" className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Accuracy</span>
              </div>
              <div className="text-3xl font-bold text-foreground">
                {score * 10}%
              </div>
            </Card>
          </motion.div>
        </div>

        <Separator className="my-6" />

        <div className="space-y-2 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">Your Answers</h3>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {answers.map((answer, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    Q{index + 1}
                  </span>
                  <span className="font-medium text-foreground">
                    {answer.question}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {(answer.responseTime / 1000).toFixed(1)}s
                  </span>
                  <Badge 
                    variant={answer.isCorrect ? 'default' : 'destructive'}
                    className={answer.isCorrect ? 'bg-success text-accent-foreground' : ''}
                  >
                    {answer.isCorrect ? '✓' : '✗'}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            onClick={onStartNewQuiz}
            size="lg"
            className="w-full text-lg gap-2"
          >
            <ArrowClockwise weight="bold" className="w-5 h-5" />
            Try Another Quiz
          </Button>
        </motion.div>
      </Card>
    </motion.div>
  )
}
