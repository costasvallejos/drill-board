import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CategorySelector from '../components/CategorySelector'
import AnimatedDrill from '../components/AnimatedDrill'
import DrillDescriptionBox from '../components/DrillDescriptionBox'
import axios from 'axios'

function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [drillDescription, setDrillDescription] = useState('')
  const [drillPath, setDrillPath] = useState([])
  const [player2Path, setPlayer2Path] = useState([])
  const [puckPath, setPuckPath] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showDrill, setShowDrill] = useState(false)
  const [direction, setDirection] = useState(1) // 1 = down, -1 = up

  useEffect(() => {
    if (!selectedCategory) {
      setShowDrill(false)
      return
    }
    setDrillDescription('')
    setDrillPath([])
    setPlayer2Path([])
    setPuckPath([])
    setError(null)
    setLoading(true)
    axios.post('/api/generate-drill', { category: selectedCategory })
      .then(res => {
        setDrillDescription(res.data.description || 'No description returned.')
        setDrillPath(Array.isArray(res.data.path) ? res.data.path : [])
        setPlayer2Path(Array.isArray(res.data.player2Path) ? res.data.player2Path : [])
        setPuckPath(Array.isArray(res.data.puckPath) ? res.data.puckPath : [])
      })
      .catch(() => {
        setError('Failed to fetch drill description.')
      })
      .finally(() => {
        setLoading(false)
        setTimeout(() => setShowDrill(true), 200)
      })
  }, [selectedCategory])

  const handleBack = () => {
    setDirection(-1)
    setShowDrill(false)
    setTimeout(() => {
      setSelectedCategory(null)
      setDirection(1)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 font-sans py-8 px-2 flex flex-col items-center justify-center">
      <AnimatePresence initial={false} custom={direction}>
        {!showDrill && !selectedCategory && (
          <motion.div
            key="category"
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full max-w-xl mx-auto"
          >
            <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-900 drop-shadow">Hockey Drills App</h1>
            <div className="flex flex-col items-center mb-8">
              <CategorySelector
                selectedCategory={selectedCategory}
                onSelectCategory={cat => {
                  setDirection(1)
                  setSelectedCategory(cat)
                }}
              />
              <p className="text-lg text-gray-700 mt-2">
                Please select a category to see drills.
              </p>
            </div>
          </motion.div>
        )}
        {showDrill && selectedCategory && (
          <motion.div
            key="drill"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full max-w-5xl mx-auto"
          >
            <button
              onClick={handleBack}
              className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              ← Back to Categories
            </button>
            <div className="flex flex-row gap-8 items-stretch justify-center w-full overflow-x-auto">
              <div className="flex-1 flex items-center justify-center min-w-0">
                <div className="w-full max-w-md min-h-[400px] flex items-center justify-center bg-white rounded-xl shadow-lg p-4">
                  <AnimatedDrill path={drillPath} player2Path={player2Path} puckPath={puckPath} />
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center min-w-0">
                <div className="w-full max-w-md min-h-[400px] flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-100 rounded-xl shadow-lg p-4 border border-orange-200">
                  <DrillDescriptionBox
                    description={
                      loading ? 'Loading...' : error ? error : drillDescription
                    }
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Home
