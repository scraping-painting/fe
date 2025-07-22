import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ScratchCard, ScratchCardRef } from '../../components/ScratchCard'
import { ScratchPaintingControls } from '../../components/ScratchPaintingControls'
import { DEFAULT_SCRATCH_CONFIG } from '../../constants/scratchPainting'
import { ScratchHistoryState, ScratchPaintingConfig } from '../../types/scratchPainting'
import {
  clearAllCanvasStates,
  clearCanvasState,
  isLocalStorageAvailable,
  loadScratchConfig,
  saveScratchConfig
} from '../../utils/localStorage'
import { mergeScratchConfig } from '../../utils/scratchPainting'

const ScratchPaintingPage: React.FC = () => {
  // Refs
  const scratchCardRef = useRef<ScratchCardRef>(null)

  // Sample images
  const sampleImages = [
    'data:image/svg+xml;charset=UTF-8,%3csvg width="600" height="450" xmlns="http://www.w3.org/2000/svg"%3e%3crect width="100%25" height="100%25" fill="%23ff6b6b"/%3e%3ctext x="50%25" y="50%25" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle"%3eTest Image 1%3c/text%3e%3c/svg%3e',
    'data:image/svg+xml;charset=UTF-8,%3csvg width="600" height="450" xmlns="http://www.w3.org/2000/svg"%3e%3crect width="100%25" height="100%25" fill="%234ecdc4"/%3e%3ctext x="50%25" y="50%25" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle"%3eTest Image 2%3c/text%3e%3c/svg%3e',
    'data:image/svg+xml;charset=UTF-8,%3csvg width="600" height="450" xmlns="http://www.w3.org/2000/svg"%3e%3crect width="100%25" height="100%25" fill="%2345b7d1"/%3e%3ctext x="50%25" y="50%25" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle"%3eTest Image 3%3c/text%3e%3c/svg%3e',
    'data:image/svg+xml;charset=UTF-8,%3csvg width="600" height="450" xmlns="http://www.w3.org/2000/svg"%3e%3crect width="100%25" height="100%25" fill="%2396ceb4"/%3e%3ctext x="50%25" y="50%25" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle"%3eTest Image 4%3c/text%3e%3c/svg%3e',
    'data:image/svg+xml;charset=UTF-8,%3csvg width="600" height="450" xmlns="http://www.w3.org/2000/svg"%3e%3crect width="100%25" height="100%25" fill="%23ffeaa7"/%3e%3ctext x="50%25" y="50%25" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle"%3eTest Image 5%3c/text%3e%3c/svg%3e'
  ]

  // State - Load config từ localStorage
  const [config, setConfig] = useState<ScratchPaintingConfig>(() => {
    // Load từ localStorage nếu có, fallback về default
    if (isLocalStorageAvailable()) {
      return loadScratchConfig()
    }
    return mergeScratchConfig(DEFAULT_SCRATCH_CONFIG)
  })
  const [selectedImage, setSelectedImage] = useState(sampleImages[0])
  const [scratchState, setScratchState] = useState({
    scratchedPercentage: 0,
    isComplete: false
  })
  const [historyState, setHistoryState] = useState<ScratchHistoryState>({
    historyIndex: -1,
    historyStack: [],
    canUndo: false,
    canRedo: false
  })
  const [key, setKey] = useState(0) // Force re-render key

  // Save config to localStorage whenever it changes
  useEffect(() => {
    if (isLocalStorageAvailable()) {
      saveScratchConfig(config)
    }
  }, [config])

  // Handlers
  const handleConfigChange = useCallback((newConfig: ScratchPaintingConfig) => {
    setConfig(newConfig)
  }, [])

  const handleScratchProgress = useCallback((percentage: number) => {
    setScratchState(prev => ({
      ...prev,
      scratchedPercentage: percentage
    }))
  }, [])

  const handleScratchComplete = useCallback(() => {
    setScratchState(prev => ({
      ...prev,
      isComplete: true
    }))
  }, [])

  const handleHistoryChange = useCallback((newHistoryState: ScratchHistoryState) => {
    setHistoryState(newHistoryState)
  }, [])

  const handleUndo = useCallback(() => {
    if (scratchCardRef.current) {
      scratchCardRef.current.undo()
    }
  }, [])

  const handleRedo = useCallback(() => {
    if (scratchCardRef.current) {
      scratchCardRef.current.redo()
    }
  }, [])

  const handleReset = useCallback(() => {
    setScratchState({
      scratchedPercentage: 0,
      isComplete: false
    })

    // Clear canvas state for current image
    if (isLocalStorageAvailable()) {
      clearCanvasState(selectedImage)
    }

    setKey(prev => prev + 1) // Force re-render để reset canvas
  }, [selectedImage])

  const handleImageSelect = useCallback((imageUrl: string) => {
    setSelectedImage(imageUrl)
    // Reset scratch state khi đổi ảnh
    setScratchState({
      scratchedPercentage: 0,
      isComplete: false
    })
    setKey(prev => prev + 1) // Force re-render
  }, [])

  // Reset config về default và clear localStorage
  const handleResetToDefault = useCallback(() => {
    setConfig(DEFAULT_SCRATCH_CONFIG)
    if (isLocalStorageAvailable()) {
      // Clear localStorage để không load lại saved config
      localStorage.removeItem('scratch-painting-config')
      // Clear all canvas states
      clearAllCanvasStates()
    }
  }, [])

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh'
      }}
    >
      {/* Header */}
      <header
        style={{
          textAlign: 'center',
          marginBottom: '30px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        <h1
          style={{
            color: '#333',
            margin: '0 0 10px 0',
            fontSize: '2.5rem'
          }}
        >
          🎨 Scratch Painting Demo
        </h1>
        <p style={{ color: '#666', margin: 0, fontSize: '1.1rem' }}>
          Cào để khám phá hình ảnh bên dưới!
        </p>
      </header>

      {/* Main Content */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'flex-start',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}
      >
        {/* Left Side - Scratch Card */}
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            maxWidth: '700px'
          }}
        >
          {/* Image Selection */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '10px', color: '#333' }}>📷 Chọn hình ảnh:</h3>
            <div
              style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}
            >
              {sampleImages.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`Sample ${index + 1}`}
                  onClick={() => handleImageSelect(imageUrl)}
                  style={{
                    width: '60px',
                    height: '45px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border: selectedImage === imageUrl ? '3px solid #2196F3' : '2px solid #ddd',
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Scratch Card */}
          <ScratchCard
            ref={scratchCardRef}
            key={key}
            backgroundImage={selectedImage}
            config={config}
            onScratchProgress={handleScratchProgress}
            onScratchComplete={handleScratchComplete}
            onHistoryChange={handleHistoryChange}
            width={600}
            height={450}
          />

          {/* Instructions */}
          <div style={{ marginTop: '20px' }}>
            <h4 style={{ color: '#333', marginBottom: '10px' }}>📋 Hướng dẫn sử dụng:</h4>
            <ul style={{ color: '#666', fontSize: '14px', paddingLeft: '20px' }}>
              <li>Sử dụng chuột hoặc cảm ứng để cào lớp phủ</li>
              <li>Quan sát tiến độ ở góc phải trên</li>
              <li>Điều chỉnh kích thước cọ và các tùy chọn bên phải</li>
              <li>Sử dụng Undo/Redo để hoàn tác/làm lại</li>
              <li>Nhấn Reset để bắt đầu lại</li>
              <li>Thử các hình ảnh khác nhau!</li>
            </ul>
          </div>
        </div>

        {/* Right Side - Controls */}
        <div style={{ flexShrink: 0 }}>
          <ScratchPaintingControls
            config={config}
            onConfigChange={handleConfigChange}
            onReset={handleReset}
            onResetToDefault={handleResetToDefault}
            progress={scratchState.scratchedPercentage}
            historyState={historyState}
            onUndo={handleUndo}
            onRedo={handleRedo}
          />
        </div>
      </div>
    </div>
  )
}

export default ScratchPaintingPage
