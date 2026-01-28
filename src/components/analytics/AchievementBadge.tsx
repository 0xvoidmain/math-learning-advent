import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Achievement } from '@/lib/achievements'
import { Lock } from '@phosphor-icons/react'

interface AchievementBadgeProps {
  achievement: Achievement
  size?: 'small' | 'medium' | 'large'
  showDetails?: boolean
}

const rarityColors = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-yellow-600'
}

const rarityGlow = {
  common: 'shadow-gray-500/20',
  rare: 'shadow-blue-500/40',
  epic: 'shadow-purple-500/40',
  legendary: 'shadow-yellow-500/60'
}

const rarityText = {
  common: 'Common',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary'
}

export function AchievementBadge({ 
  achievement, 
  size = 'medium',
  showDetails = true 
}: AchievementBadgeProps) {
  const sizeClasses = {
    small: 'w-16 h-16 text-2xl',
    medium: 'w-20 h-20 text-3xl',
    large: 'w-32 h-32 text-5xl'
  }

  const cardPadding = {
    small: 'p-3',
    medium: 'p-4',
    large: 'p-6'
  }

  const titleSize = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-xl'
  }

  const descriptionSize = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  }

  if (!showDetails) {
    return (
      <motion.div
        whileHover={achievement.isUnlocked ? { scale: 1.05 } : {}}
        className="relative"
      >
        <div
          className={`
            ${sizeClasses[size]} 
            rounded-full 
            flex items-center justify-center 
            font-bold
            transition-all duration-300
            ${achievement.isUnlocked 
              ? `bg-gradient-to-br ${rarityColors[achievement.rarity]} shadow-lg ${rarityGlow[achievement.rarity]}`
              : 'bg-muted/50 grayscale opacity-50'
            }
          `}
        >
          {achievement.isUnlocked ? (
            achievement.icon
          ) : (
            <Lock weight="fill" className="w-1/2 h-1/2 text-muted-foreground" />
          )}
        </div>
        {!achievement.isUnlocked && (
          <div className="absolute inset-0 rounded-full bg-black/20 backdrop-blur-[1px]" />
        )}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={achievement.isUnlocked ? { y: -4 } : {}}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`
          ${cardPadding[size]} 
          relative overflow-hidden
          transition-all duration-300
          ${achievement.isUnlocked 
            ? `shadow-lg hover:shadow-xl ${rarityGlow[achievement.rarity]}`
            : 'opacity-70'
          }
        `}
      >
        {achievement.isUnlocked && (
          <div 
            className={`
              absolute top-0 left-0 right-0 h-1 
              bg-gradient-to-r ${rarityColors[achievement.rarity]}
            `}
          />
        )}
        
        <div className="flex gap-4">
          <div className="relative">
            <div
              className={`
                ${sizeClasses[size]} 
                rounded-full 
                flex items-center justify-center 
                font-bold
                transition-all duration-300
                shrink-0
                ${achievement.isUnlocked 
                  ? `bg-gradient-to-br ${rarityColors[achievement.rarity]} shadow-md`
                  : 'bg-muted grayscale'
                }
              `}
            >
              {achievement.isUnlocked ? (
                achievement.icon
              ) : (
                <Lock weight="fill" className="w-1/2 h-1/2 text-muted-foreground" />
              )}
            </div>
            {!achievement.isUnlocked && (
              <div className="absolute inset-0 rounded-full bg-black/20 backdrop-blur-[1px]" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className={`${titleSize[size]} font-bold text-foreground truncate`}>
                {achievement.title}
              </h3>
              <Badge 
                variant="outline" 
                className={`
                  text-xs shrink-0
                  ${achievement.isUnlocked 
                    ? `bg-gradient-to-r ${rarityColors[achievement.rarity]} text-white border-0`
                    : ''
                  }
                `}
              >
                {rarityText[achievement.rarity]}
              </Badge>
            </div>
            
            <p className={`${descriptionSize[size]} text-muted-foreground mb-2`}>
              {achievement.description}
            </p>

            {achievement.isUnlocked && achievement.unlockedAt && (
              <p className="text-xs text-muted-foreground">
                Unlocked {new Date(achievement.unlockedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            )}

            {!achievement.isUnlocked && (
              <div className="flex items-center gap-1">
                <Lock weight="fill" className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Locked</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
