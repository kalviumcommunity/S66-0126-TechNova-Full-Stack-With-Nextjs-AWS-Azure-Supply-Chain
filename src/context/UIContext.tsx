'use client'

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react'
import { ToastContainer } from '@/components/ui/Toast'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface UIContextType {
  isSidebarOpen: boolean
  toggleSidebar: () => void
  closeSidebar: () => void
  openSidebar: () => void
  modalContent: ReactNode | null
  isModalOpen: boolean
  openModal: (content: ReactNode) => void
  closeModal: () => void
  showToast: (message: string, type?: ToastType, duration?: number) => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export function UIProvider({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [modalContent, setModalContent] = useState<ReactNode | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev)
  }, [])

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false)
  }, [])

  const openSidebar = useCallback(() => {
    setIsSidebarOpen(true)
  }, [])

  const openModal = useCallback((content: ReactNode) => {
    setModalContent(content)
  }, [])

  const closeModal = useCallback(() => {
    setModalContent(null)
  }, [])

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration = 5000) => {
      const id = `toast-${Date.now()}-${Math.random()}`
      const newToast: Toast = { id, message, type, duration }

      setToasts((prev) => [...prev, newToast])
    },
    []
  )

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const value: UIContextType = {
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    modalContent,
    isModalOpen: modalContent !== null,
    openModal,
    closeModal,
    showToast,
  }

  return (
    <UIContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </UIContext.Provider>
  )
}

export function useUI() {
  const context = useContext(UIContext)
  if (!context) {
    throw new Error('useUI must be used within UIProvider')
  }
  return context
}
