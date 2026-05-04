import React from 'react'

interface AppLogoProps {
  className?: string
}

const AppLogo: React.FC<AppLogoProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-label="MCP Dev Panel" className={className}>
    <rect x="2" y="2" width="9" height="9" rx="2" className="fill-primary" />
    <rect x="13" y="2" width="9" height="9" rx="2" className="fill-text-muted" />
    <rect x="2" y="13" width="9" height="9" rx="2" className="fill-text-muted" />
    <rect x="13" y="13" width="9" height="9" rx="2" className="fill-primary" opacity="0.5" />
  </svg>
)

export default AppLogo
