import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Check, X } from '@phosphor-icons/react'
import { Confetti } from './Confetti'

interface AnswerButtonProps {
  answer: number
  isSelected: boolean
  isCorrect: boolean
  isIncorrect: boolean
  isDisabled: boolean
  onClick: () => void
}

export function AnswerButton({
  answer,
  isSelected,
  isCorrect,
  isIncorrect,
  isDisabled,
  onClick
}: AnswerButtonProps) {
  const getButtonStyles = () => {
    if (isCorrect) {
      return 'bg-success text-accent-foreground border-success shadow-lg scale-105'
    }
    if (isIncorrect) {
      return 'bg-destructive text-destructive-foreground border-destructive'
    }
    return 'bg-card text-foreground hover:bg-secondary/50 border-2 border-border hover:border-primary/50 hover:scale-105'
  }

  return (
    <motion.div
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.95 } : {}}
      animate={isIncorrect ? {
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.4 }
      } : {}}
    >
      <Button
        onClick={onClick}
        disabled={isDisabled}
        className={`
          relative w-full h-24 sm:h-28 text-3xl sm:text-4xl font-bold
          transition-all duration-200
          ${getButtonStyles()}
        `}
      >
        {answer}
        {isCorrect && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute top-2 right-2"
          >
            <Check weight="bold" className="w-6 h-6 sm:w-8 sm:h-8" />
          </motion.div>
        )}
        {isIncorrect && (
          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute top-2 right-2"
          >
            <X weight="bold" className="w-6 h-6 sm:w-8 sm:h-8" />
          </motion.div>
        )}
      </Button>
      {isCorrect && <Confetti />}
    </motion.div>
  )
}
