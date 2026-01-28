import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { QuizView } from '@/components/quiz/QuizView'
import { ResultsView } from '@/components/quiz/ResultsView'
import { ProgressView } from '@/components/analytics/ProgressView'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChartLine, GameController } from '@phosphor-icons/react'

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
}

function App() {
  const [sessions, setSessions] = useKV<QuizSession[]>('quiz-sessions', [])
  const [currentAnswers, setCurrentAnswers] = useState<QuizAnswer[]>([])
  const [isQuizComplete, setIsQuizComplete] = useState(false)
  const [activeTab, setActiveTab] = useState<'quiz' | 'progress'>('quiz')

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
        averageTime
      }

      setSessions((current) => [...(current || []), newSession])
    }
  }

  const handleStartNewQuiz = () => {
    setCurrentAnswers([])
    setIsQuizComplete(false)
    setActiveTab('quiz')
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-2">
            Math Quest
          </h1>
          <p className="text-lg text-muted-foreground">Learn, Practice, Grow! 🚀</p>
        </header>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'quiz' | 'progress')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="quiz" className="text-base sm:text-lg gap-2">
              <GameController weight="fill" className="w-5 h-5" />
              Quiz
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-base sm:text-lg gap-2">
              <ChartLine weight="fill" className="w-5 h-5" />
              Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quiz" className="mt-0">
            {!isQuizComplete ? (
              <QuizView 
                currentQuestionNumber={currentAnswers.length + 1}
                onAnswerSubmit={handleAnswerSubmit}
              />
            ) : (
              <ResultsView
                answers={currentAnswers}
                onStartNewQuiz={handleStartNewQuiz}
              />
            )}
          </TabsContent>

          <TabsContent value="progress" className="mt-0">
            <ProgressView sessions={sessions || []} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App