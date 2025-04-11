import type { ReactNode } from "react"

interface TerminalWindowProps {
  children: ReactNode
}

export function TerminalWindow({ children }: TerminalWindowProps) {
  return (
    <div className="w-full max-w-4xl h-[80vh] flex flex-col rounded-lg overflow-hidden border border-gray-700 shadow-[0_0_15px_rgba(100,255,100,0.15)] animate-fadeIn relative z-10 backdrop-blur-sm bg-gray-900/95">
      <div className="flex items-center bg-gray-800 p-2 text-white">
        <div className="flex space-x-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors cursor-pointer"></div>
        </div>
        <div className="flex-1 text-center text-sm font-mono">terminal — JXuSzMh2@bschulze — ~ -zsh</div>
        <div className="ml-4 w-12"></div>
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  )
}
