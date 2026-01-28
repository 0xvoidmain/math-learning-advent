import { motion, AnimatePresence } from 'framer-motion'
import { Achievement } from '@/lib/achievements'
import { Trophy, Sparkle } from '@phosphor-icons/react'
import { useEffect } from 'react'

interface AchievementUnlockProps {
  achievement: Achievement | null
  onDismiss: () => void
}

const rarityColors = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-yellow-600'
}

export function AchievementUnlock({ achievement, onDismiss }: AchievementUnlockProps) {
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(onDismiss, 5000)
      return () => clearTimeout(timer)
    }
  }, [achievement, onDismiss])

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4"
          onClick={onDismiss}
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 10px 40px rgba(0,0,0,0.2)',
                '0 10px 60px rgba(0,0,0,0.3)',
                '0 10px 40px rgba(0,0,0,0.2)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`
              relative overflow-hidden rounded-2xl 
              bg-gradient-to-br ${rarityColors[achievement.rarity]}
              p-[2px]
            `}
          >
            <div className="bg-card rounded-2xl p-6 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 opacity-10"
                animate={{
                  background: [
                    'radial-gradient(circle at 0% 0%, white 0%, transparent 50%)',
                    'radial-gradient(circle at 100% 100%, white 0%, transparent 50%)',
                    'radial-gradient(circle at 0% 0%, white 0%, transparent 50%)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <Trophy weight="fill" className="w-8 h-8 text-yellow-500" />
                  </motion.div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Achievement Unlocked!
                    </p>
                    <h3 className="text-xl font-bold text-foreground">
                      {achievement.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className={`
                      w-16 h-16 rounded-full 
                      flex items-center justify-center 
                      text-3xl font-bold
                      bg-gradient-to-br ${rarityColors[achievement.rarity]}
                      shadow-lg
                    `}
                  >
                    {achievement.icon}
                  </motion.div>

                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-2">
                      {achievement.description}
                    </p>
                    <div className={`
                      inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold
                      bg-gradient-to-r ${rarityColors[achievement.rarity]} text-white
                    `}>
                      <Sparkle weight="fill" className="w-3 h-3" />
                      {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                    </div>
                  </div>
                </div>
              </div>

              {achievement.rarity === 'legendary' && (
                <>
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                      initial={{
                        x: '50%',
                        y: '50%',
                        scale: 0,
                        opacity: 1,
                      }}
                      animate={{
                        x: `${50 + Math.cos((i / 20) * Math.PI * 2) * 100}%`,
                        y: `${50 + Math.sin((i / 20) * Math.PI * 2) * 100}%`,
                        scale: [0, 1, 0],
                        opacity: [1, 1, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.05,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    />
                  ))}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
