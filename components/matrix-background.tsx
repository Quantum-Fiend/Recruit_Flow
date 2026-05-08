'use client'

import React, { useEffect, useRef } from 'react'

export const MatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const columns = Math.floor(width / 20)
    const drops: number[] = new Array(columns).fill(0)

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>[]{}/\\|'
    const charArray = characters.split('')

    const draw = () => {
      // Very light trails
      const matrixFade = getComputedStyle(canvas).getPropertyValue('--matrix-fade') || 'rgba(0, 0, 0, 0.05)'
      ctx.fillStyle = matrixFade
      ctx.fillRect(0, 0, width, height)

      ctx.font = '15px monospace'

      // Get color from CSS variable
      const matrixColor = getComputedStyle(canvas).getPropertyValue('--matrix-color') || 'rgba(59, 130, 246, 0.1)'
      ctx.fillStyle = matrixColor
      
      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)]
        ctx.fillText(text, i * 20, drops[i] * 20)

        if (drops[i] * 20 > height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i]++
      }
    }

    const interval = setInterval(draw, 50)

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-1] opacity-20"
      style={{ filter: 'blur(1px)' }}
    />
  )
}
