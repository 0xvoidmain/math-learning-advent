import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Trophy, Fire, Target, Lightning } from '@phosphor-icons/react'
import { QuizSession } from '@/App'
import { calculateAchievements, getAchievementProgress } from '@/lib/achievements'
import { AchievementBadge } from './AchievementBadge'

interface AchievementsViewProps {
  sessions: QuizSession[]
}

export function AchievementsView({ sessions }: AchievementsViewProps) {
  const achievements = calculateAchievements(sessions)
  
  const unlockedCount = achievements.filter(a => a.isUnlocked).length
  const totalCount = achievements.length
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100)

  const milestoneAchievements = achievements.filter(a => a.category === 'milestone')
  const streakAchievements = achievements.filter(a => a.category === 'streak')
  const masteryAchievements = achievements.filter(a => a.category === 'mastery')
  const speedAchievements = achievements.filter(a => a.category === 'speed')

  const categoryIcons = {
    milestone: Trophy,
    streak: Fire,
    mastery: Target,
    speed: Lightning,
  }

  const renderAchievementSection = (
    categoryAchievements: typeof achievements,
    title: string,
    icon: React.ComponentType<any>
  ) => {
    const Icon = icon
    const unlockedInCategory = categoryAchievements.filter(a => a.isUnlocked).length

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon weight="fill" className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-foreground">{title}</h3>
          </div>
          <Badge variant="outline" className="text-sm">
            {unlockedInCategory}/{categoryAchievements.length}
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {categoryAchievements.map((achievement) => {
            const progress = getAchievementProgress(sessions, achievement.id)
            
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AchievementBadge achievement={achievement} size="medium" />
                {!achievement.isUnlocked && progress && progress.required > 1 && (
                  <div className="mt-2 px-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Progress</span>
                      <span>{progress.current}/{progress.required}</span>
                    </div>
                    <Progress 
                      value={(progress.current / progress.required) * 100} 
                      className="h-2"
                    />
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

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
            <Trophy weight="duotone" className="w-20 h-20 text-primary" />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Start Earning Achievements!
          </h2>
          <p className="text-lg text-muted-foreground">
            Complete quizzes to unlock badges and track your milestones 🎯
          </p>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card className="p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
              Achievements
            </h2>
            <p className="text-muted-foreground">
              {unlockedCount} of {totalCount} unlocked
            </p>
          </div>
          <motion.div
            animate={{ rotate: unlockedCount > 0 ? [0, 10, -10, 0] : 0 }}
            transition={{ duration: 0.5 }}
          >
            <Trophy weight="fill" className="w-12 h-12 text-yellow-500" />
          </motion.div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Overall Progress</span>
            <span className="font-semibold">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-3" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['common', 'rare', 'epic', 'legendary'] as const).map((rarity) => {
            const count = achievements.filter(a => a.rarity === rarity && a.isUnlocked).length
            const total = achievements.filter(a => a.rarity === rarity).length
            const colors = {
              common: 'from-gray-400 to-gray-500',
              rare: 'from-blue-400 to-blue-600',
              epic: 'from-purple-400 to-purple-600',
              legendary: 'from-yellow-400 to-yellow-600'
            }

            return (
              <Card 
                key={rarity}
                className={`p-3 bg-gradient-to-br ${colors[rarity]} bg-opacity-10`}
              >
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                  {rarity}
                </p>
                <p className="text-lg font-bold text-foreground">
                  {count}/{total}
                </p>
              </Card>
            )
          })}
        </div>
      </Card>

      <Card className="p-6 sm:p-8 shadow-xl">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              All
            </TabsTrigger>
            <TabsTrigger value="milestone" className="text-xs sm:text-sm gap-1">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Milestone</span>
            </TabsTrigger>
            <TabsTrigger value="streak" className="text-xs sm:text-sm gap-1">
              <Fire className="w-4 h-4" />
              <span className="hidden sm:inline">Streak</span>
            </TabsTrigger>
            <TabsTrigger value="mastery" className="text-xs sm:text-sm gap-1">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Mastery</span>
            </TabsTrigger>
            <TabsTrigger value="speed" className="text-xs sm:text-sm gap-1">
              <Lightning className="w-4 h-4" />
              <span className="hidden sm:inline">Speed</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6 mt-0">
            {renderAchievementSection(milestoneAchievements, 'Milestones', Trophy)}
            {renderAchievementSection(streakAchievements, 'Streaks', Fire)}
            {renderAchievementSection(masteryAchievements, 'Mastery', Target)}
            {renderAchievementSection(speedAchievements, 'Speed', Lightning)}
          </TabsContent>

          <TabsContent value="milestone" className="mt-0">
            {renderAchievementSection(milestoneAchievements, 'Milestones', Trophy)}
          </TabsContent>

          <TabsContent value="streak" className="mt-0">
            {renderAchievementSection(streakAchievements, 'Streaks', Fire)}
          </TabsContent>

          <TabsContent value="mastery" className="mt-0">
            {renderAchievementSection(masteryAchievements, 'Mastery', Target)}
          </TabsContent>

          <TabsContent value="speed" className="mt-0">
            {renderAchievementSection(speedAchievements, 'Speed', Lightning)}
          </TabsContent>
        </Tabs>
      </Card>
    </motion.div>
  )
}
