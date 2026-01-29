import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { AnswerButton } from "./AnswerButton";
import {
  generateQuestion,
  type MathQuestion,
  type Difficulty,
} from "@/lib/mathGenerator";
import { QuizAnswer } from "@/App";
import { useSound } from "@/hooks/use-sound";

interface QuizViewProps {
  currentQuestionNumber: number;
  onAnswerSubmit: (answer: QuizAnswer) => void;
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

export function QuizView({
  currentQuestionNumber,
  onAnswerSubmit,
  difficulty,
  onDifficultyChange,
}: QuizViewProps) {
  const [question, setQuestion] = useState<MathQuestion>(
    generateQuestion(difficulty),
  );
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [startTime, setStartTime] = useState(Date.now());
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const { playSound, preloadSounds } = useSound();

  useEffect(() => {
    preloadSounds();
  }, []);

  useEffect(() => {
    if (currentQuestionNumber === 1) {
      setHasStarted(false);
    }
  }, [currentQuestionNumber]);

  useEffect(() => {
    if (hasStarted) {
      setQuestion(generateQuestion(difficulty));
      setStartTime(Date.now());
      setSelectedAnswer(null);
      setIsProcessing(false);
    }
  }, [currentQuestionNumber, difficulty, hasStarted]);

  const handleAnswerClick = async (answer: number) => {
    if (isProcessing || selectedAnswer !== null) return;

    setIsProcessing(true);
    setSelectedAnswer(answer);

    const responseTime = Date.now() - startTime;
    const isCorrect = answer === question.correctAnswer;

    // Play sound effect immediately
    playSound(isCorrect ? "correct" : "incorrect");

    await new Promise((resolve) =>
      setTimeout(resolve, isCorrect ? 1500 : 1000),
    );

    const quizAnswer: QuizAnswer = {
      questionId: currentQuestionNumber,
      question: question.display,
      userAnswer: answer,
      correctAnswer: question.correctAnswer,
      isCorrect,
      responseTime,
      timestamp: Date.now(),
    };

    onAnswerSubmit(quizAnswer);
  };

  const progressPercent = ((currentQuestionNumber - 1) / 10) * 100;

  const difficultyLabels: Record<Difficulty, string> = {
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
  };

  const difficultyColors: Record<Difficulty, string> = {
    easy: "bg-success text-accent-foreground",
    medium: "bg-secondary text-secondary-foreground",
    hard: "bg-coral text-white",
  };

  if (!hasStarted && currentQuestionNumber === 1) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-6 sm:p-8 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-3">
              Ready to Start?
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose your difficulty level and begin!
            </p>
          </div>

          <div className="mb-8">
            <p className="text-base font-semibold text-foreground mb-4 text-center">
              Select Difficulty:
            </p>
            <div className="flex flex-col gap-3">
              {(["easy", "medium", "hard"] as Difficulty[]).map((level) => (
                <Button
                  key={level}
                  variant={difficulty === level ? "default" : "outline"}
                  size="lg"
                  onClick={() => onDifficultyChange(level)}
                  className={`text-lg h-14 ${difficulty === level ? difficultyColors[level] : ""}`}
                >
                  {difficultyLabels[level]}
                  {level === "easy" && " - Numbers 1-10"}
                  {level === "medium" && " - Numbers 1-20"}
                  {level === "hard" && " - Numbers 1-50"}
                </Button>
              ))}
            </div>
          </div>

          <Button
            onClick={() => {
              setHasStarted(true);
              setQuestion(generateQuestion(difficulty));
              setStartTime(Date.now());
            }}
            size="lg"
            className="w-full text-xl h-16 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Start Quiz! 🚀
          </Button>
        </Card>
      </motion.div>
    );
  }

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
          transition={{ duration: 0.4, type: "spring" }}
          className="text-center mb-8"
        >
          <div className="text-5xl sm:text-6xl md:text-7xl font-bold text-foreground mb-2 tracking-tight">
            {question.display}
          </div>
          <div className="text-2xl sm:text-3xl text-muted-foreground">= ?</div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {question.options.map((option, index) => (
            <AnswerButton
              key={index}
              answer={option}
              isSelected={selectedAnswer === option}
              isCorrect={
                selectedAnswer === option && option === question.correctAnswer
              }
              isIncorrect={
                selectedAnswer === option && option !== question.correctAnswer
              }
              isDisabled={isProcessing}
              onClick={() => handleAnswerClick(option)}
            />
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
