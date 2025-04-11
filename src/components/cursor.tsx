"use client"

import { useEffect, useState } from "react"

export function Cursor() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((prev) => !prev)
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return <span className={`w-2 h-5 bg-white inline-block ${visible ? "opacity-100" : "opacity-0"}`}></span>
}
