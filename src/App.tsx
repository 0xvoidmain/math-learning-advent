import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { QuizView } from '@/components/quiz/QuizView'
import { ResultsView } from '@/components/quiz/ResultsView'
import { ProgressView } from '@/components/analytics/ProgressView'
import { AchievementsView } from '@/components/analytics/AchievementsView'
import { AchievementUnlock } from '@/components/analytics/AchievementUnlock'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChartLine, GameController, Trophy } from '@phosphor-icons/react'
import { Difficulty } from '@/lib/mathGenerator'
import { getNewlyUnlockedAchievements, Achievement } from '@/lib/achievements'

export interface QuizAnswer {
  questionId: number
  question: string
  userAnswer: number
  correctAnswer: number
  isCorrect: boolean
  responseTime: number
  timestamp: number
}

export interface QuizSession {
  id: string
  answers: QuizAnswer[]
  completedAt: number
  score: number
  averageTime: number
  difficulty: Difficulty
}

function App() {
  const [sessions, setSessions] = useKV<QuizSession[]>('quiz-sessions', [])
  const [currentAnswers, setCurrentAnswers] = useState<QuizAnswer[]>([])
  const [isQuizComplete, setIsQuizComplete] = useState(false)
  const [activeTab, setActiveTab] = useState<'quiz' | 'progress' | 'achievements'>('quiz')
  const [difficulty, setDifficulty] = useKV<Difficulty>('selected-difficulty', 'medium')
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null)
  const [achievementQueue, setAchievementQueue] = useState<Achievement[]>([])

  const handleAnswerSubmit = (answer: QuizAnswer) => {
    const newAnswers = [...currentAnswers, answer]
    setCurrentAnswers(newAnswers)

    if (newAnswers.length === 10) {
      setIsQuizComplete(true)
      
      const score = newAnswers.filter(a => a.isCorrect).length
      const averageTime = newAnswers.reduce((sum, a) => sum + a.responseTime, 0) / newAnswers.length
      
      const newSession: QuizSession = {
        id: `session-${Date.now()}`,
        answers: newAnswers,
        completedAt: Date.now(),
        score,
        averageTime,
        difficulty: difficulty || 'medium'
      }

      setSessions((current) => {
        const updated = [...(current || []), newSession]
        
        const newAchievements = getNewlyUnlockedAchievements(current || [], updated)
        if (newAchievements.length > 0) {
          setAchievementQueue(newAchievements)
        }
        
        return updated
      })
    }
  }

  useEffect(() => {
    if (achievementQueue.length > 0 && !unlockedAchievement) {
      setUnlockedAchievement(achievementQueue[0])
    }
  }, [achievementQueue, unlockedAchievement])

  const handleDismissAchievement = () => {
    setUnlockedAchievement(null)
    setAchievementQueue((current) => current.slice(1))
  }

  const handleStartNewQuiz = () => {
    setCurrentAnswers([])
    setIsQuizComplete(false)
    setActiveTab('quiz')
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <AchievementUnlock 
        achievement={unlockedAchievement} 
        onDismiss={handleDismissAchievement}
      />
      
      <div className="max-w-3xl mx-auto">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'quiz' | 'progress' | 'achievements')} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="quiz" className="text-base sm:text-lg gap-2">
              <GameController weight="fill" className="w-5 h-5" />
              Quiz
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-base sm:text-lg gap-2">
              <ChartLine weight="fill" className="w-5 h-5" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="achievements" className="text-base sm:text-lg gap-2">
              <Trophy weight="fill" className="w-5 h-5" />
              Badges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quiz" className="mt-0">
            {!isQuizComplete ? (
              <QuizView 
                currentQuestionNumber={currentAnswers.length + 1}
                onAnswerSubmit={handleAnswerSubmit}
                difficulty={difficulty || 'medium'}
                onDifficultyChange={setDifficulty}
              />
            ) : (
              <ResultsView
                answers={currentAnswers}
                onStartNewQuiz={handleStartNewQuiz}
                difficulty={difficulty || 'medium'}
              />
            )}
          </TabsContent>

          <TabsContent value="progress" className="mt-0">
            <ProgressView sessions={sessions || []} />
          </TabsContent>

          <TabsContent value="achievements" className="mt-0">
            <AchievementsView sessions={sessions || []} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App