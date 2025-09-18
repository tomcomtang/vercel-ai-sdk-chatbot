'use client'

export default function GridOverlay() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: `
          radial-gradient(ellipse at center, rgba(74, 85, 104, 0.036) 0%, rgba(74, 85, 104, 0.02) 30%, rgba(74, 85, 104, 0.01) 60%, transparent 100%),
          url("data:image/svg+xml,%3csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'%3e%3cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='%234a5568' stroke-width='0.4'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23grid)' /%3e%3c/svg%3e")
        `,
        backgroundSize: '40px 40px',
        backgroundPosition: '0 0',
        maskImage: 'radial-gradient(ellipse 100% 50% at center, black 0%, black 50%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 100% 50% at center, black 0%, black 50%, transparent 100%)'
      }}
    />
  )
}
