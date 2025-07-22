import React from 'react'
import { Link } from 'react-router-dom'

const HomePage: React.FC = () => {
  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: 'Arial, sans-serif'
  }

  const cardStyles: React.CSSProperties = {
    background: 'white',
    borderRadius: '16px',
    padding: '40px',
    textAlign: 'center',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    maxWidth: '600px',
    width: '100%'
  }

  const titleStyles: React.CSSProperties = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  }

  const descriptionStyles: React.CSSProperties = {
    fontSize: '1.1rem',
    color: '#666',
    marginBottom: '30px',
    lineHeight: '1.6'
  }

  const buttonStyles: React.CSSProperties = {
    display: 'inline-block',
    padding: '15px 30px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
  }

  const featuresStyles: React.CSSProperties = {
    marginTop: '40px',
    textAlign: 'left'
  }

  const featureItemStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
    fontSize: '1rem',
    color: '#555'
  }

  const emojiStyles: React.CSSProperties = {
    fontSize: '1.5rem',
    marginRight: '12px'
  }

  return (
    <div style={containerStyles}>
      <div style={cardStyles}>
        <h1 style={titleStyles}>🎨 Scratch Painting App</h1>

        <p style={descriptionStyles}>
          Chào mừng bạn đến với ứng dụng Scratch Painting! Một trải nghiệm tương tác thú vị cho phép
          bạn cào để khám phá những hình ảnh bí ẩn bên dưới.
        </p>

        <Link
          to="/scratch-painting"
          style={buttonStyles}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)'
          }}
        >
          🚀 Bắt đầu trải nghiệm
        </Link>

        <div style={featuresStyles}>
          <h3 style={{ color: '#333', marginBottom: '20px' }}>✨ Tính năng nổi bật:</h3>

          <div style={featureItemStyles}>
            <span style={emojiStyles}>🖱️</span>
            <span>Hỗ trợ cả chuột và cảm ứng</span>
          </div>

          <div style={featureItemStyles}>
            <span style={emojiStyles}>🎛️</span>
            <span>Điều chỉnh kích thước cọ và màu sắc</span>
          </div>

          <div style={featureItemStyles}>
            <span style={emojiStyles}>📊</span>
            <span>Theo dõi tiến độ thời gian thực</span>
          </div>

          <div style={featureItemStyles}>
            <span style={emojiStyles}>🖼️</span>
            <span>Nhiều hình ảnh để khám phá</span>
          </div>

          <div style={featureItemStyles}>
            <span style={emojiStyles}>📱</span>
            <span>Thiết kế responsive, hoạt động mượt mà</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
