import React from 'react'
import { ScratchHistoryState, ScratchPaintingConfig } from '../types/scratchPainting'

interface ScratchPaintingControlsProps {
  config: ScratchPaintingConfig
  onConfigChange: (newConfig: ScratchPaintingConfig) => void
  onReset: () => void
  onResetToDefault: () => void
  progress: number
  historyState?: ScratchHistoryState
  onUndo?: () => void
  onRedo?: () => void
}

export const ScratchPaintingControls: React.FC<ScratchPaintingControlsProps> = ({
  config,
  onConfigChange,
  onReset,
  onResetToDefault,
  progress,
  historyState,
  onUndo,
  onRedo
}) => {
  const handleBrushSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const brushSize = parseInt(event.target.value, 10)
    onConfigChange({ ...config, brushSize })
  }

  const handleThresholdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const threshold = parseInt(event.target.value, 10)
    onConfigChange({ ...config, threshold })
  }

  const handleOverlayColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const overlayColor = event.target.value
    onConfigChange({ ...config, overlayColor })
  }

  const handleMouseToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const enableMouse = event.target.checked
    onConfigChange({ ...config, enableMouse })
  }

  const handleTouchToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const enableTouch = event.target.checked
    onConfigChange({ ...config, enableTouch })
  }

  // Button styles
  const buttonStyles: React.CSSProperties = {
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    marginTop: '8px',
    width: '100%'
  }

  const historyButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    width: '48%',
    marginRight: '4%',
    padding: '6px 12px',
    fontSize: '12px'
  }

  const disabledButtonStyles: React.CSSProperties = {
    ...historyButtonStyles,
    backgroundColor: '#cccccc',
    cursor: 'not-allowed'
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '16px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        minWidth: '250px'
      }}
    >
      <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>Điều khiển Scratch Painting</h3>

      {/* Progress Display */}
      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
        Tiến độ: {progress}%{progress >= config.threshold && ' ✅'}
      </div>

      {/* History Controls */}
      {historyState && (onUndo || onRedo) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <button
            onClick={onUndo}
            disabled={!historyState.canUndo}
            style={historyState.canUndo ? historyButtonStyles : disabledButtonStyles}
            title="Hoàn tác thao tác trước đó"
          >
            ↶ Undo
          </button>
          <button
            onClick={onRedo}
            disabled={!historyState.canRedo}
            style={historyState.canRedo ? historyButtonStyles : disabledButtonStyles}
            title="Làm lại thao tác đã hoàn tác"
          >
            ↷ Redo
          </button>
        </div>
      )}

      {/* Brush Size Control */}
      <div>
        <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>
          Kích thước cọ: {config.brushSize}px
        </div>
        <input
          type="range"
          min="5"
          max="100"
          value={config.brushSize}
          onChange={handleBrushSizeChange}
          style={{ width: '100%' }}
        />
      </div>

      {/* Threshold Control */}
      <div>
        <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>
          Ngưỡng hoàn thành: {config.threshold}%
        </div>
        <input
          type="range"
          min="10"
          max="100"
          value={config.threshold}
          onChange={handleThresholdChange}
          style={{ width: '100%' }}
        />
      </div>

      {/* Overlay Color Control */}
      <div>
        <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>Màu lớp phủ:</div>
        <input
          type="color"
          value={config.overlayColor}
          onChange={handleOverlayColorChange}
          style={{
            width: '100%',
            height: '40px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        />
      </div>

      {/* Input Methods */}
      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', color: '#666' }}>
          Phương thức đầu vào:
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
            <input
              type="checkbox"
              checked={config.enableMouse}
              onChange={handleMouseToggle}
              style={{ marginRight: '8px', cursor: 'pointer' }}
            />
            Chuột
          </label>

          <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
            <input
              type="checkbox"
              checked={config.enableTouch}
              onChange={handleTouchToggle}
              style={{ marginRight: '8px', cursor: 'pointer' }}
            />
            Cảm ứng
          </label>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={onReset}
        style={{
          ...buttonStyles,
          backgroundColor: '#FF5722'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = '#D32F2F'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = '#FF5722'
        }}
        title="Xóa toàn bộ và bắt đầu lại"
      >
        🔄 Reset
      </button>

      {/* Reset to Default Button */}
      <button
        onClick={onResetToDefault}
        style={{
          ...buttonStyles,
          backgroundColor: '#6c757d',
          marginTop: '8px',
          fontSize: '13px'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = '#545b62'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = '#6c757d'
        }}
        title="Khôi phục thiết lập mặc định và xóa dữ liệu đã lưu"
      >
        ⚙️ Reset về mặc định
      </button>
    </div>
  )
}
