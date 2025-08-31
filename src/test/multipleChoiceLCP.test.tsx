import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MultipleChoice } from '@/components/MultipleChoice'

// Mock onScoreUpdate function
const mockOnScoreUpdate = vi.fn()

describe('MultipleChoice LCP Optimizations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Performance Optimizations', () => {
    it('should render question immediately without useEffect delay', () => {
      render(<MultipleChoice onScoreUpdate={mockOnScoreUpdate} />)
      
      // Question should be rendered immediately, not after useEffect
      const questionElement = screen.getByRole('heading', { level: 2 })
      expect(questionElement).toBeInTheDocument()
      expect(questionElement.textContent).toBeTruthy()
    })

    it('should use simplified CSS classes for better render performance', () => {
      render(<MultipleChoice onScoreUpdate={mockOnScoreUpdate} />)
      
      const questionElement = screen.getByRole('heading', { level: 2 })
      
      // Should have the simplified class without gradient and shadow
      expect(questionElement.className).toContain('bg-indigo-600')
      expect(questionElement.className).not.toContain('bg-gradient-to-r')
      expect(questionElement.className).not.toContain('shadow')
      expect(questionElement.className).not.toContain('will-change-transform')
    })

    it('should have proper containIntrinsicSize for layout stability', () => {
      render(<MultipleChoice onScoreUpdate={mockOnScoreUpdate} />)
      
      const questionElement = screen.getByRole('heading', { level: 2 })
      
      // Check for the containIntrinsicSize style
      expect(questionElement.style.containIntrinsicSize).toBe('1px 80px')
    })

    it('should maintain question functionality despite optimizations', () => {
      render(<MultipleChoice onScoreUpdate={mockOnScoreUpdate} />)
      
      const questionElement = screen.getByRole('heading', { level: 2 })
      const radioGroup = screen.getByRole('radiogroup')
      
      // Basic functionality should still work
      expect(questionElement).toBeInTheDocument()
      expect(radioGroup).toBeInTheDocument()
      expect(questionElement.textContent).toBeTruthy()
    })

    it('should have proper ARIA structure for accessibility', () => {
      render(<MultipleChoice onScoreUpdate={mockOnScoreUpdate} />)
      
      const questionElement = screen.getByRole('heading', { level: 2 })
      const radioGroup = screen.getByRole('radiogroup')
      
      // Should maintain accessibility despite performance changes  
      expect(questionElement).toHaveAttribute('id')
      expect(radioGroup).toBeInTheDocument()
      expect(screen.getByText('Choose your answer')).toBeInTheDocument()
    })
  })
})
