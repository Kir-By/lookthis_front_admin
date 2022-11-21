import { useEffect } from 'react'

export const useEventKeyCode = (action: (() => void) | null, keyCode: KeyboardEvent['code']) => {
    useEffect(() => {
        function onKeyup(e: KeyboardEvent) {
            if (e.code === keyCode && action) action()
        }

        window.addEventListener('keyup', onKeyup)

        return () => window.removeEventListener('keyup', onKeyup)
    }, [action, keyCode])
}
