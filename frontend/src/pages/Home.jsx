import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CategorySelector from '../components/CategorySelector'
import AnimatedDrill from '../components/AnimatedDrill'
import DrillDescriptionBox from '../components/DrillDescriptionBox'
import axios from 'axios'
import RinkVisualizer from '../components/RinkVisualizer'
import ShootingDrillAnimation from '../components/ShootingDrillAnimation'
import PassingDrillAnimation from '../components/PassingDrillAnimation'

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
        setDrillPath(() => {
          const playerPath = Array.isArray(res.data.path) ? res.data.path : [];
          const puckPath = Array.isArray(res.data.puckPath) ? res.data.puckPath : [];
          let shotIndex = null;
          let netLocation = puckPath.length ? puckPath[puckPath.length - 1] : null;
          // Prefer backend-provided shotLocation if present
          if (res.data.shotLocation && typeof res.data.shotLocation.x === 'number' && typeof res.data.shotLocation.y === 'number') {
            // Find the index in playerPath that matches shotLocation
            shotIndex = playerPath.findIndex(p => p.x === res.data.shotLocation.x && p.y === res.data.shotLocation.y);
            if (shotIndex === -1) shotIndex = null;
          }
          // Fallback: infer shotIndex as before
          if (shotIndex === null && playerPath.length && puckPath.length) {
            for (let i = 0; i < Math.min(playerPath.length, puckPath.length); i++) {
              if (playerPath[i].x !== puckPath[i].x || playerPath[i].y !== puckPath[i].y) {
                shotIndex = i;
                break;
              }
            }
            if (shotIndex === null) shotIndex = Math.min(playerPath.length, puckPath.length) - 1;
          }
          const drillPath = [...playerPath];
          drillPath.shotIndex = shotIndex;
          drillPath.netLocation = netLocation;
          return drillPath;
        });
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
    <div className="home-bg">
      <div className="home-overlay"></div>
      <AnimatePresence initial={false} custom={direction}>
        {!showDrill && !selectedCategory && (
          <motion.div
            key="category"
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="home-center"
          >
            <div className="home-card">
              <h1 className="home-title">Hockey Drills App</h1>
              <CategorySelector
                selectedCategory={selectedCategory}
                onSelectCategory={cat => {
                  setDirection(1)
                  setSelectedCategory(cat)
                }}
              />
              <p className="home-desc">Please select a category to see drills.</p>
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
            className="home-center"
          >
            <button
              onClick={handleBack}
              className="home-back"
            >
              ← Back to Categories
            </button>
            <div className="home-flex-row">
              <div className="home-flex-item">
                <div className="home-card">
                  {selectedCategory === 'Shooting' && Array.isArray(drillPath) && drillPath.length >= 1 && typeof drillPath.shotIndex === 'number' && drillPath.netLocation ? (
                    <ShootingDrillAnimation playerPath={drillPath} shotIndex={drillPath.shotIndex} netLocation={drillPath.netLocation} />
                  ) : selectedCategory === 'Passing' && Array.isArray(drillPath) && drillPath.length >= 1 && Array.isArray(player2Path) && player2Path.length >= 1 && Array.isArray(puckPath) && puckPath.length >= 2 ? (
                    <PassingDrillAnimation player1Path={drillPath} player2Path={player2Path} puckPath={puckPath} />
                  ) : Array.isArray(drillPath) && drillPath.length > 1 ? (
                    <AnimatedDrill path={drillPath} player2Path={player2Path} puckPath={puckPath} />
                  ) : (
                    <RinkVisualizer />
                  )}
                </div>
              </div>
              <div className="home-flex-item">
                <div className="home-card">
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
