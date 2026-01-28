import { QuizSession } from '@/App'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'milestone' | 'streak' | 'mastery' | 'speed'
  requirement: number
  isUnlocked: boolean
  unlockedAt?: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface AchievementProgress {
  achievementId: string
  current: number
  required: number
}

const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'isUnlocked' | 'unlockedAt'>[] = [
  {
    id: 'first-quiz',
    title: 'Getting Started',
    description: 'Complete your first quiz',
    icon: '🎯',
    category: 'milestone',
    requirement: 1,
    rarity: 'common'
  },
  {
    id: 'quiz-5',
    title: 'Practice Makes Perfect',
    description: 'Complete 5 quizzes',
    icon: '📚',
    category: 'milestone',
    requirement: 5,
    rarity: 'common'
  },
  {
    id: 'quiz-10',
    title: 'Dedicated Learner',
    description: 'Complete 10 quizzes',
    icon: '⭐',
    category: 'milestone',
    requirement: 10,
    rarity: 'rare'
  },
  {
    id: 'quiz-25',
    title: 'Math Enthusiast',
    description: 'Complete 25 quizzes',
    icon: '🌟',
    category: 'milestone',
    requirement: 25,
    rarity: 'rare'
  },
  {
    id: 'quiz-50',
    title: 'Math Master',
    description: 'Complete 50 quizzes',
    icon: '👑',
    category: 'milestone',
    requirement: 50,
    rarity: 'epic'
  },
  {
    id: 'quiz-100',
    title: 'Century Club',
    description: 'Complete 100 quizzes',
    icon: '💯',
    category: 'milestone',
    requirement: 100,
    rarity: 'legendary'
  },
  {
    id: 'perfect-score',
    title: 'Perfect Score',
    description: 'Get 10/10 on a quiz',
    icon: '💯',
    category: 'mastery',
    requirement: 1,
    rarity: 'rare'
  },
  {
    id: 'perfect-3',
    title: 'Hat Trick',
    description: 'Get 3 perfect scores',
    icon: '🎩',
    category: 'mastery',
    requirement: 3,
    rarity: 'epic'
  },
  {
    id: 'perfect-10',
    title: 'Perfectionist',
    description: 'Get 10 perfect scores',
    icon: '🏆',
    category: 'mastery',
    requirement: 10,
    rarity: 'legendary'
  },
  {
    id: 'streak-3',
    title: 'Hot Streak',
    description: 'Complete 3 quizzes in a row with 8+ score',
    icon: '🔥',
    category: 'streak',
    requirement: 3,
    rarity: 'rare'
  },
  {
    id: 'streak-5',
    title: 'On Fire',
    description: 'Complete 5 quizzes in a row with 8+ score',
    icon: '🔥🔥',
    category: 'streak',
    requirement: 5,
    rarity: 'epic'
  },
  {
    id: 'streak-10',
    title: 'Unstoppable',
    description: 'Complete 10 quizzes in a row with 8+ score',
    icon: '🔥🔥🔥',
    category: 'streak',
    requirement: 10,
    rarity: 'legendary'
  },
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Complete a quiz with average time under 3 seconds',
    icon: '⚡',
    category: 'speed',
    requirement: 1,
    rarity: 'epic'
  },
  {
    id: 'lightning-fast',
    title: 'Lightning Fast',
    description: 'Complete a quiz with average time under 2 seconds',
    icon: '⚡⚡',
    category: 'speed',
    requirement: 1,
    rarity: 'legendary'
  },
  {
    id: 'all-difficulties',
    title: 'Well Rounded',
    description: 'Complete at least one quiz on each difficulty',
    icon: '🎓',
    category: 'mastery',
    requirement: 1,
    rarity: 'rare'
  },
  {
    id: 'hard-mode-master',
    title: 'Hard Mode Master',
    description: 'Complete 10 quizzes on hard difficulty',
    icon: '💪',
    category: 'mastery',
    requirement: 10,
    rarity: 'epic'
  }
]

export function calculateAchievements(sessions: QuizSession[]): Achievement[] {
  const achievements: Achievement[] = []
  
  if (!sessions || sessions.length === 0) {
    return ACHIEVEMENT_DEFINITIONS.map(def => ({
      ...def,
      isUnlocked: false
    }))
  }

  const totalQuizzes = sessions.length
  const perfectScores = sessions.filter(s => s.score === 10).length
  
  const currentStreak = calculateCurrentStreak(sessions)
  const longestStreak = calculateLongestStreak(sessions)
  
  const fastestQuiz = Math.min(...sessions.map(s => s.averageTime))
  const fastestQuizSeconds = fastestQuiz / 1000
  
  const difficulties = new Set(sessions.map(s => s.difficulty || 'medium'))
  const hasAllDifficulties = difficulties.size === 3
  
  const hardModeQuizzes = sessions.filter(s => s.difficulty === 'hard').length

  ACHIEVEMENT_DEFINITIONS.forEach(def => {
    let isUnlocked = false
    let unlockedAt: number | undefined

    switch (def.id) {
      case 'first-quiz':
        isUnlocked = totalQuizzes >= 1
        if (isUnlocked) unlockedAt = sessions[0]?.completedAt
        break
      case 'quiz-5':
        isUnlocked = totalQuizzes >= 5
        if (isUnlocked) unlockedAt = sessions[4]?.completedAt
        break
      case 'quiz-10':
        isUnlocked = totalQuizzes >= 10
        if (isUnlocked) unlockedAt = sessions[9]?.completedAt
        break
      case 'quiz-25':
        isUnlocked = totalQuizzes >= 25
        if (isUnlocked) unlockedAt = sessions[24]?.completedAt
        break
      case 'quiz-50':
        isUnlocked = totalQuizzes >= 50
        if (isUnlocked) unlockedAt = sessions[49]?.completedAt
        break
      case 'quiz-100':
        isUnlocked = totalQuizzes >= 100
        if (isUnlocked) unlockedAt = sessions[99]?.completedAt
        break
      case 'perfect-score':
        isUnlocked = perfectScores >= 1
        if (isUnlocked) {
          const firstPerfect = sessions.find(s => s.score === 10)
          unlockedAt = firstPerfect?.completedAt
        }
        break
      case 'perfect-3':
        isUnlocked = perfectScores >= 3
        if (isUnlocked) {
          const perfectSessions = sessions.filter(s => s.score === 10)
          unlockedAt = perfectSessions[2]?.completedAt
        }
        break
      case 'perfect-10':
        isUnlocked = perfectScores >= 10
        if (isUnlocked) {
          const perfectSessions = sessions.filter(s => s.score === 10)
          unlockedAt = perfectSessions[9]?.completedAt
        }
        break
      case 'streak-3':
        isUnlocked = longestStreak >= 3
        if (isUnlocked) {
          const streakIndex = findStreakEndIndex(sessions, 3)
          unlockedAt = sessions[streakIndex]?.completedAt
        }
        break
      case 'streak-5':
        isUnlocked = longestStreak >= 5
        if (isUnlocked) {
          const streakIndex = findStreakEndIndex(sessions, 5)
          unlockedAt = sessions[streakIndex]?.completedAt
        }
        break
      case 'streak-10':
        isUnlocked = longestStreak >= 10
        if (isUnlocked) {
          const streakIndex = findStreakEndIndex(sessions, 10)
          unlockedAt = sessions[streakIndex]?.completedAt
        }
        break
      case 'speed-demon':
        isUnlocked = fastestQuizSeconds < 3
        if (isUnlocked) {
          const fastSession = sessions.find(s => s.averageTime === fastestQuiz)
          unlockedAt = fastSession?.completedAt
        }
        break
      case 'lightning-fast':
        isUnlocked = fastestQuizSeconds < 2
        if (isUnlocked) {
          const fastSession = sessions.find(s => s.averageTime === fastestQuiz)
          unlockedAt = fastSession?.completedAt
        }
        break
      case 'all-difficulties':
        isUnlocked = hasAllDifficulties
        if (isUnlocked) {
          const lastDifficultySession = sessions.find(s => {
            const prevDifficulties = new Set(
              sessions.slice(0, sessions.indexOf(s) + 1).map(x => x.difficulty || 'medium')
            )
            return prevDifficulties.size === 3
          })
          unlockedAt = lastDifficultySession?.completedAt
        }
        break
      case 'hard-mode-master':
        isUnlocked = hardModeQuizzes >= 10
        if (isUnlocked) {
          const hardSessions = sessions.filter(s => s.difficulty === 'hard')
          unlockedAt = hardSessions[9]?.completedAt
        }
        break
    }

    achievements.push({
      ...def,
      isUnlocked,
      unlockedAt
    })
  })

  return achievements
}

function calculateCurrentStreak(sessions: QuizSession[]): number {
  if (sessions.length === 0) return 0
  
  let streak = 0
  for (let i = sessions.length - 1; i >= 0; i--) {
    if (sessions[i].score >= 8) {
      streak++
    } else {
      break
    }
  }
  return streak
}

function calculateLongestStreak(sessions: QuizSession[]): number {
  if (sessions.length === 0) return 0
  
  let longest = 0
  let current = 0
  
  sessions.forEach(session => {
    if (session.score >= 8) {
      current++
      longest = Math.max(longest, current)
    } else {
      current = 0
    }
  })
  
  return longest
}

function findStreakEndIndex(sessions: QuizSession[], streakLength: number): number {
  let current = 0
  
  for (let i = 0; i < sessions.length; i++) {
    if (sessions[i].score >= 8) {
      current++
      if (current === streakLength) {
        return i
      }
    } else {
      current = 0
    }
  }
  
  return sessions.length - 1
}

export function getAchievementProgress(
  sessions: QuizSession[],
  achievementId: string
): AchievementProgress | null {
  if (!sessions || sessions.length === 0) {
    const achievement = ACHIEVEMENT_DEFINITIONS.find(a => a.id === achievementId)
    if (!achievement) return null
    return {
      achievementId,
      current: 0,
      required: achievement.requirement
    }
  }

  const achievement = ACHIEVEMENT_DEFINITIONS.find(a => a.id === achievementId)
  if (!achievement) return null

  let current = 0

  switch (achievementId) {
    case 'first-quiz':
    case 'quiz-5':
    case 'quiz-10':
    case 'quiz-25':
    case 'quiz-50':
    case 'quiz-100':
      current = sessions.length
      break
    case 'perfect-score':
    case 'perfect-3':
    case 'perfect-10':
      current = sessions.filter(s => s.score === 10).length
      break
    case 'streak-3':
    case 'streak-5':
    case 'streak-10':
      current = calculateLongestStreak(sessions)
      break
    case 'speed-demon':
    case 'lightning-fast':
      const fastestSeconds = Math.min(...sessions.map(s => s.averageTime)) / 1000
      current = achievementId === 'speed-demon' 
        ? (fastestSeconds < 3 ? 1 : 0)
        : (fastestSeconds < 2 ? 1 : 0)
      break
    case 'all-difficulties':
      const difficulties = new Set(sessions.map(s => s.difficulty || 'medium'))
      current = difficulties.size === 3 ? 1 : 0
      break
    case 'hard-mode-master':
      current = sessions.filter(s => s.difficulty === 'hard').length
      break
  }

  return {
    achievementId,
    current: Math.min(current, achievement.requirement),
    required: achievement.requirement
  }
}

export function getNewlyUnlockedAchievements(
  previousSessions: QuizSession[],
  currentSessions: QuizSession[]
): Achievement[] {
  const previousAchievements = calculateAchievements(previousSessions)
  const currentAchievements = calculateAchievements(currentSessions)

  const newlyUnlocked = currentAchievements.filter((current, index) => {
    const previous = previousAchievements[index]
    return current.isUnlocked && !previous.isUnlocked
  })

  return newlyUnlocked
}
