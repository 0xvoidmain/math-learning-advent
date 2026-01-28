import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AnswerButton } from './AnswerButton'
import { generateQuestion, type MathQuestion } from '@/lib/mathGenerator'
import { QuizAnswer } from '@/App'

interface QuizViewProps {
  currentQuestionNumber: number
  onAnswerSubmit: (answer: QuizAnswer) => void
}

export function QuizView({ currentQuestionNumber, onAnswerSubmit }: QuizViewProps) {
  const [question, setQuestion] = useState<MathQuestion>(generateQuestion())
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [startTime, setStartTime] = useState(Date.now())
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    setQuestion(generateQuestion())
    setStartTime(Date.now())
    setSelectedAnswer(null)
    setIsProcessing(false)
  }, [currentQuestionNumber])

  const handleAnswerClick = async (answer: number) => {
    if (isProcessing || selectedAnswer !== null) return

    setIsProcessing(true)
    setSelectedAnswer(answer)
    
    const responseTime = Date.now() - startTime
    const isCorrect = answer === question.correctAnswer

    await new Promise(resolve => setTimeout(resolve, isCorrect ? 1500 : 1000))

    const quizAnswer: QuizAnswer = {
      questionId: currentQuestionNumber,
      question: question.display,
      userAnswer: answer,
      correctAnswer: question.correctAnswer,
      isCorrect,
      responseTime,
      timestamp: Date.now()
    }

    onAnswerSubmit(quizAnswer)
  }

  const progressPercent = ((currentQuestionNumber - 1) / 10) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 sm:p-8 shadow-xl">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Question {currentQuestionNumber} of 10
            </span>
            <span className="text-sm font-bold text-primary">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        <motion.div 
          key={currentQuestionNumber}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, type: 'spring' }}
          className="text-center mb-8"
        >
          <div className="text-5xl sm:text-6xl md:text-7xl font-bold text-foreground mb-2 tracking-tight">
            {question.display}
          </div>
          <div className="text-2xl sm:text-3xl text-muted-foreground">
            = ?
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {question.options.map((option, index) => (
            <AnswerButton
              key={index}
              answer={option}
              isSelected={selectedAnswer === option}
              isCorrect={selectedAnswer === option && option === question.correctAnswer}
              isIncorrect={selectedAnswer === option && option !== question.correctAnswer}
              isDisabled={isProcessing}
              onClick={() => handleAnswerClick(option)}
            />
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
