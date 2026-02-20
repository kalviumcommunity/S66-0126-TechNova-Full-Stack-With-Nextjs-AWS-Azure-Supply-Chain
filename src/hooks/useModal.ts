import { useUI } from '@/context/UIContext'
import { ReactNode } from 'react'

/**
 * Custom hook for managing modal state
 * Usage: const { openModal, closeModal } = useModal()
 *        openModal(<MyComponent />)
 */
export function useModal() {
  const { openModal, closeModal, isModalOpen, modalContent } = useUI()

  return {
    openModal,
    closeModal,
    isModalOpen,
    modalContent,
  }
}
