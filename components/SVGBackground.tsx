export default function SVGBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 渐变背景 */}
        <defs>
          <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#000000" />
            <stop offset="30%" stopColor="#0a0a0a" />
            <stop offset="70%" stopColor="#111111" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>
          
          {/* 装饰性渐变 */}
          <radialGradient id="accent-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a1a1a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
          </radialGradient>
          
          {/* 白色装饰渐变 */}
          <radialGradient id="white-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#333333" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
          </radialGradient>
          
          {/* 3D轨道渐变 */}
          <linearGradient id="orbit-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#555555" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#777777" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#333333" stopOpacity="0.4" />
          </linearGradient>
          
          <linearGradient id="orbit-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#666666" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#888888" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#444444" stopOpacity="0.3" />
          </linearGradient>
          
          <linearGradient id="orbit-gradient-3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#444444" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#666666" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#222222" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        
        {/* 主背景 */}
        <rect width="100" height="100" fill="url(#bg-gradient)" />
        
        {/* 网格图案 - 分别控制横竖线透明度 */}
        <defs>
          {/* 竖线网格 */}
          <pattern id="vertical-grid" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M 5 0 L 5 5" fill="none" stroke="#444444" strokeWidth="0.1" opacity="0.2" />
          </pattern>
          {/* 横线网格 */}
          <pattern id="horizontal-grid" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M 0 5 L 5 5" fill="none" stroke="#444444" strokeWidth="0.1" opacity="0.4" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#vertical-grid)" />
        <rect width="100" height="100" fill="url(#horizontal-grid)" />
        
        {/* 2条波浪线 - 从左下到右上 */}
        {/* 波浪线1 - 主波浪 */}
        <path
          d="M0,80 Q20,60 40,50 Q60,40 80,30 Q100,20 100,0"
          fill="none"
          stroke="url(#orbit-gradient-1)"
          strokeWidth="0.2"
          opacity="0.4"
        />
        
        {/* 波浪线2 - 辅助波浪 */}
        <path
          d="M0,90 Q25,70 50,60 Q75,50 100,40 Q100,10 100,0"
          fill="none"
          stroke="url(#orbit-gradient-2)"
          strokeWidth="0.2"
          opacity="0.3"
        />
      </svg>
    </div>
  )
}
