import * as React from "react"

export function RheoCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="rheo-glass rounded-lg p-4">
      <div className="text-sm font-semibold text-rheo-subtle mb-2">{title}</div>
      <div>{children}</div>
    </div>
  )
}
