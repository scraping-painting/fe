# 🎨 Scratch Painting App

Ứng dụng Scratch Painting được xây dựng với React và TypeScript, cho phép người dùng cào để khám phá hình ảnh ẩn bên dưới lớp phủ.

## ✨ Tính năng chính

- **🖱️ Multi-input Support**: Hỗ trợ cả chuột và cảm ứng
- **🎛️ Customizable Controls**: Điều chỉnh kích thước cọ, màu lớp phủ, ngưỡng hoàn thành
- **📊 Real-time Progress**: Theo dõi tiến độ cào thời gian thực
- **🖼️ Multiple Images**: Nhiều hình ảnh mẫu để thử nghiệm
- **📱 Responsive Design**: Tối ưu cho mọi kích thước màn hình
- **🎯 Clean Architecture**: Tuân theo nguyên tắc clean architecture

## 🏗️ Kiến trúc

### 📁 Cấu trúc thư mục

```
src/
├── components/
│   ├── ScratchCard.tsx              # Component chính cho scratch card
│   └── ScratchPaintingControls.tsx  # Component điều khiển
├── hooks/
│   └── useScratchPainting.ts        # Hook chính quản lý logic
├── types/
│   └── scratchPainting.d.ts         # Type definitions
├── constants/
│   └── scratchPainting.ts           # Constants và config mặc định
├── utils/
│   ├── canvas.ts                    # Canvas utilities
│   └── scratchPainting.ts           # Scratch painting utilities
├── assets/styles/components/
│   └── scratch-painting.scss        # Styles cho components
└── pages/scratch-painting/
    └── index.tsx                    # Page demo
```

### 🏛️ Clean Architecture Layers

#### 1. **Domain Layer (Types & Constants)**

- `scratchPainting.d.ts`: Định nghĩa các interface và types
- `scratchPainting.ts`: Constants và cấu hình mặc định

#### 2. **Use Cases Layer (Hooks)**

- `useScratchPainting.ts`: Logic nghiệp vụ chính

#### 3. **Infrastructure Layer (Utils)**

- `canvas.ts`: Xử lý canvas operations
- `scratchPainting.ts`: Utility functions

#### 4. **Presentation Layer (Components)**

- `ScratchCard.tsx`: UI component chính
- `ScratchPaintingControls.tsx`: Component điều khiển

## 🚀 Cách sử dụng

### Truy cập ứng dụng

1. Chạy development server:

   ```bash
   npm run dev
   ```

2. Mở trình duyệt và truy cập:
   - Trang chủ: `http://localhost:5173/`
   - Scratch Painting: `http://localhost:5173/scratch-painting`

### Sử dụng ScratchCard Component

```tsx
import { ScratchCard } from '@/components/ScratchCard'

function MyApp() {
  return (
    <ScratchCard
      backgroundImage="https://example.com/image.jpg"
      config={{
        brushSize: 40,
        threshold: 70,
        overlayColor: '#C0C0C0'
      }}
      onScratchStart={() => console.log('Started scratching')}
      onScratchProgress={percentage => console.log(`Progress: ${percentage}%`)}
      onScratchComplete={() => console.log('Completed!')}
      width={400}
      height={300}
    />
  )
}
```

### Sử dụng Hook

```tsx
import { useScratchPainting } from '@/hooks/useScratchPainting'

function CustomScratchComponent() {
  const { canvasRef, scratchState, initCanvas, resetCanvas } = useScratchPainting({
    config: { brushSize: 50 },
    onScratchComplete: () => alert('Done!')
  })

  useEffect(() => {
    initCanvas()
  }, [])

  return (
    <div>
      <canvas ref={canvasRef} width={400} height={300} />
      <p>Progress: {scratchState.scratchedPercentage}%</p>
      <button onClick={resetCanvas}>Reset</button>
    </div>
  )
}
```

## ⚙️ Cấu hình

### ScratchPaintingConfig

```typescript
interface ScratchPaintingConfig {
  brushSize: number // Kích thước cọ (5-100)
  threshold: number // Ngưỡng hoàn thành % (1-100)
  enableTouch: boolean // Bật/tắt cảm ứng
  enableMouse: boolean // Bật/tắt chuột
  overlayColor: string // Màu lớp phủ (hex)
  overlayOpacity: number // Độ mờ lớp phủ (0-1)
}
```

### Constants mặc định

```typescript
const DEFAULT_SCRATCH_CONFIG = {
  brushSize: 40,
  threshold: 70,
  enableTouch: true,
  enableMouse: true,
  overlayColor: '#C0C0C0',
  overlayOpacity: 1
}
```

## 🎯 API Reference

### Components

#### ScratchCard Props

```typescript
interface ScratchCardProps {
  backgroundImage: string // URL hình ảnh nền (bắt buộc)
  overlayImage?: string // URL hình ảnh lớp phủ (tùy chọn)
  config?: Partial<ScratchPaintingConfig>
  onScratchStart?: () => void
  onScratchProgress?: (percentage: number) => void
  onScratchComplete?: () => void
  className?: string
  style?: React.CSSProperties
  width?: number // Chiều rộng (mặc định: 400)
  height?: number // Chiều cao (mặc định: 300)
}
```

#### ScratchPaintingControls Props

```typescript
interface ScratchPaintingControlsProps {
  config: ScratchPaintingConfig
  scratchedPercentage: number
  isComplete: boolean
  onConfigChange: (newConfig: Partial<ScratchPaintingConfig>) => void
  onReset: () => void
  className?: string
  style?: React.CSSProperties
}
```

### Hooks

#### useScratchPainting Return Values

```typescript
interface UseScratchPaintingReturn {
  canvasRef: React.RefObject<HTMLCanvasElement>
  scratchState: ScratchPaintingState
  scratchCanvasRef: ScratchCanvasRef
  initCanvas: (overlayColor?: string) => void
  resetCanvas: () => void
  setBrushSize: (size: number) => void
}
```

## 🎨 Styling

Ứng dụng sử dụng SCSS với CSS Variables để dễ dàng customize:

```scss
:root {
  --scratch-primary-color: #007bff;
  --scratch-border-radius: 8px;
  --scratch-box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  --scratch-transition: all 0.3s ease;
}
```

### CSS Classes

- `.scratch-card`: Container chính
- `.scratch-painting-controls`: Panel điều khiển
- `.scratch-painting-page`: Layout trang

## 🔧 Utilities

### Canvas Utils

```typescript
// Lấy vị trí chuột/touch
getCanvasPosition(event: ScratchEvent, canvas: HTMLCanvasElement): ScratchPoint

// Setup canvas cho scratch
setupScratchCanvas(canvas: HTMLCanvasElement, overlayColor?: string): CanvasRenderingContext2D

// Tính phần trăm đã cào
calculateScratchedPercentage(canvas: HTMLCanvasElement, samplePoints?: number): number
```

### Scratch Painting Utils

```typescript
// Merge config
mergeScratchConfig(userConfig?: Partial<ScratchPaintingConfig>): ScratchPaintingConfig

// Validate image URL
isValidImageUrl(url: string): boolean

// Preload image
preloadImage(src: string): Promise<HTMLImageElement>
```

## 🔬 Testing

Để test các component:

```bash
npm run test
```

Example test cho ScratchCard:

```typescript
import { render, screen } from '@testing-library/react'
import { ScratchCard } from './ScratchCard'

test('renders scratch card with background image', () => {
  render(
    <ScratchCard
      backgroundImage="https://example.com/test.jpg"
    />
  )

  const canvas = screen.getByRole('img', { hidden: true })
  expect(canvas).toBeInTheDocument()
})
```

## 🚀 Performance

### Optimizations được áp dụng:

1. **Throttling**: Events được throttle để tối ưu performance
2. **Sampling**: Chỉ sample một số điểm để tính phần trăm
3. **Canvas Pooling**: Tái sử dụng canvas context
4. **Debounced Progress**: Progress callbacks được debounce

### Best Practices:

- Sử dụng `useCallback` cho event handlers
- Preload images để tránh lag
- Cleanup event listeners properly
- Optimize canvas operations

## 🐛 Troubleshooting

### Vấn đề thường gặp:

1. **Canvas không hiển thị**:

   - Kiểm tra image URL có hợp lệ
   - Đảm bảo CORS cho external images

2. **Touch không hoạt động**:

   - Kiểm tra `enableTouch: true` trong config
   - Thêm `touch-action: none` CSS

3. **Performance lag**:
   - Giảm `SCRATCH_SAMPLE_POINTS`
   - Tăng `SCRATCH_DEBOUNCE_DELAY`

## 📝 License

MIT License - feel free to use in your projects!

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Follow clean architecture principles
4. Add tests for new features
5. Submit pull request

---

**Happy Scratching! 🎨✨**
