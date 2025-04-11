"use client"

import { useState } from "react"

export function useCommandHistory(initialHistory: string[] = []) {
  const [history, setHistory] = useState<string[]>(initialHistory)
  const [position, setPosition] = useState(-1)

  const addCommand = (command: string) => {
    if (command.trim()) {
      setHistory((prev) => [...prev, command])
      setPosition(-1)
    }
  }

  const getPreviousCommand = () => {
    if (history.length === 0) return ""

    const newPosition = Math.min(position + 1, history.length - 1)
    setPosition(newPosition)
    return history[history.length - 1 - newPosition]
  }

  const getNextCommand = () => {
    if (position <= 0) {
      setPosition(-1)
      return ""
    }

    const newPosition = position - 1
    setPosition(newPosition)
    return history[history.length - 1 - newPosition]
  }

  const resetPosition = () => {
    setPosition(-1)
  }

  return {
    history,
    addCommand,
    getPreviousCommand,
    getNextCommand,
    resetPosition,
    position,
  }
}
