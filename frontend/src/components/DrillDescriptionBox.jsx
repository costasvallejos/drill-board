import { motion, AnimatePresence } from 'framer-motion'

function DrillDescriptionBox({ description }) {
  // Split description into sentences or paragraphs for staggered animation
  const parts = (description || '').split(/(?<=[.!?])\s+/)
  return (
    <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center max-w-md w-full">
      <h2 className="text-2xl font-bold text-orange-700 mb-4 text-center drop-shadow">Drill Description</h2>
      <div className="text-lg text-gray-800 text-center whitespace-pre-line">
        <AnimatePresence>
          {parts.map((part, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.25, duration: 0.6, ease: 'easeOut' }}
              className="block mb-2"
            >
              {part}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default DrillDescriptionBox
  