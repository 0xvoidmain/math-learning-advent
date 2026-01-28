import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, TrendUp, Target, Clock, Fire } from '@phosphor-icons/react'
import { QuizSession } from '@/App'
import { ProgressChart } from './ProgressChart'
import { Difficulty } from '@/lib/mathGenerator'

interface ProgressViewProps {
  sessions: QuizSession[]
}

export function ProgressView({ sessions }: ProgressViewProps) {
  if (!sessions || sessions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-8 sm:p-12 shadow-xl text-center">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1
            }}
            className="inline-block mb-4"
          >
            <Target weight="duotone" className="w-20 h-20 text-primary" />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Start Your First Quiz!
          </h2>
          <p className="text-lg text-muted-foreground">
            Complete quizzes to track your amazing progress over time 🚀
          </p>
        </Card>
      </motion.div>
    )
  }

  const totalQuizzes = sessions.length
  const totalQuestions = totalQuizzes * 10
  const totalCorrect = sessions.reduce((sum, s) => sum + s.score, 0)
  const overallAccuracy = Math.round((totalCorrect / totalQuestions) * 100)
  const averageScore = (totalCorrect / totalQuizzes).toFixed(1)
  const bestScore = Math.max(...sessions.map(s => s.score))
  
  const recentSessions = sessions.slice(-10)
  const averageTimeRecent = recentSessions.reduce((sum, s) => sum + s.averageTime, 0) / recentSessions.length
  const averageTimeSeconds = (averageTimeRecent / 1000).toFixed(1)

  const firstSessionAvgTime = sessions[0]?.averageTime || 0
  const lastSessionAvgTime = sessions[sessions.length - 1]?.averageTime || 0
  const timeImprovement = firstSessionAvgTime > 0 
    ? Math.round(((firstSessionAvgTime - lastSessionAvgTime) / firstSessionAvgTime) * 100)
    : 0

  let currentStreak = 0
  for (let i = sessions.length - 1; i >= 0; i--) {
    if (sessions[i].score >= 8) {
      currentStreak++
    } else {
      break
    }
  }

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card className="p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2 mb-6">
          <TrendUp weight="bold" className="w-6 h-6 text-primary" />
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Your Progress
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/20 border-purple-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Trophy weight="fill" className="w-5 h-5 text-purple-600" />
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Total Quizzes
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground">
                {totalQuizzes}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/20 border-green-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Target weight="fill" className="w-5 h-5 text-green-600" />
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Accuracy
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground">
                {overallAccuracy}%
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-blue-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Trophy weight="fill" className="w-5 h-5 text-blue-600" />
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Best Score
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground">
                {bestScore}/10
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-600/20 border-orange-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Clock weight="fill" className="w-5 h-5 text-orange-600" />
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Avg Speed
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground">
                {averageTimeSeconds}s
              </div>
            </Card>
          </motion.div>
        </div>

        {currentStreak > 0 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mb-8"
          >
            <Card className="p-4 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 border-orange-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 0.5,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                  >
                    <Fire weight="fill" className="w-8 h-8 text-orange-500" />
                  </motion.div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Current Streak
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {currentStreak} quiz{currentStreak !== 1 ? 'zes' : ''} with 8+ score!
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[...Array(Math.min(currentStreak, 10))].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.05 }}
                    >
                      <Fire weight="fill" className="w-5 h-5 text-orange-500" />
                    </motion.div>
                  ))}
                  {currentStreak > 10 && (
                    <span className="text-sm font-bold text-orange-500 ml-1">
                      +{currentStreak - 10}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Score Trend (Last 10 Quizzes)
          </h3>
          <ProgressChart sessions={recentSessions} />
        </motion.div>

        {timeImprovement !== 0 && sessions.length > 1 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-4 bg-gradient-to-r from-accent/20 to-primary/20 border-primary/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Speed Improvement
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {timeImprovement > 0 ? `${timeImprovement}% faster!` : 'Keep practicing!'}
                  </p>
                </div>
                <TrendUp weight="bold" className="w-8 h-8 text-primary" />
              </div>
            </Card>
          </motion.div>
        )}
      </Card>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="p-6 sm:p-8 shadow-xl">
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Recent Quizzes
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {[...sessions].reverse().slice(0, 20).map((session, index) => {
              const date = new Date(session.completedAt)
              const dateStr = date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })

              return (
                <motion.div
                  key={session.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Trophy 
                      weight={session.score >= 8 ? 'fill' : 'regular'} 
                      className={`w-5 h-5 ${session.score >= 8 ? 'text-yellow-500' : 'text-muted-foreground'}`}
                    />
                    <div>
                      <p className="font-medium text-foreground">
                        Quiz #{sessions.length - index}
                      </p>
                      <p className="text-xs text-muted-foreground">{dateStr}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={`text-xs ${difficultyColors[session.difficulty || 'medium']}`}
                    >
                      {difficultyLabels[session.difficulty || 'medium']}
                    </Badge>
                    <Badge 
                      variant={session.score >= 7 ? 'default' : 'secondary'}
                      className={session.score >= 7 ? 'bg-success text-accent-foreground' : ''}
                    >
                      {session.score}/10
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {(session.averageTime / 1000).toFixed(1)}s
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}
