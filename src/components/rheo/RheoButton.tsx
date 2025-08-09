import * as React from "react"

export function RheoButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className="inline-flex items-center rounded-md px-4 py-2 font-medium text-white"
      style={{ background: 'linear-gradient(180deg, var(--rheo-accent), rgba(0,0,0,0.2))', boxShadow: '0 6px 16px rgba(37,99,235,.35)' }}>
      {children}
    </button>
  )
}
