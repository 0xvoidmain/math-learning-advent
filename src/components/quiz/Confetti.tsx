import { motion } from 'framer-motion'

export function Confetti() {
  const particles = Array.from({ length: 20 })
  const colors = ['#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899']

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((_, i) => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)]
        const randomX = (Math.random() - 0.5) * 300
        const randomY = -100 - Math.random() * 100
        const randomRotate = Math.random() * 720 - 360
        const randomDelay = Math.random() * 0.2

        return (
          <motion.div
            key={i}
            initial={{ 
              x: 0, 
              y: 0, 
              opacity: 1, 
              rotate: 0,
              scale: 1
            }}
            animate={{
              x: randomX,
              y: randomY,
              opacity: 0,
              rotate: randomRotate,
              scale: 0
            }}
            transition={{
              duration: 1.2,
              delay: randomDelay,
              ease: 'easeOut'
            }}
            className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
            style={{ backgroundColor: randomColor }}
          />
        )
      })}
    </div>
  )
}
