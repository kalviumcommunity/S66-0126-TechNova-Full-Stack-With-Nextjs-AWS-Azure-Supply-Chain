import { useUI } from '@/context/UIContext'
import { ToastType } from '@/components/ui/Toast'

/**
 * Custom hook for showing toast notifications
 * Usage: const { toast } = useToast()
 *        toast('Success!', 'success')
 */
export function useToast() {
  const { showToast } = useUI()

  return {
    toast: showToast,
    success: (message: string, duration?: number) =>
      showToast(message, 'success', duration),
    error: (message: string, duration?: number) =>
      showToast(message, 'error', duration),
    info: (message: string, duration?: number) =>
      showToast(message, 'info', duration),
    warning: (message: string, duration?: number) =>
      showToast(message, 'warning', duration),
  }
}
