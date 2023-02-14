import { useCallback, useState } from 'react'

const useComponentState = <T>(initialState: T) => {
    const [state, setState] = useState(initialState)

    const handleState = useCallback(
        (value: T) => {
            setState(value)
        },
        [setState],
    )

    const handleStateByProperty = useCallback(
        (key: string, value: unknown) => {
            setState((prev) => ({ ...prev, [key]: value }))
        },
        [setState],
    )

    const handleStateByObject = useCallback(
        (state: Partial<T>) => {
            setState((prev) => ({ ...prev, ...state }))
        },
        [setState],
    )

    return { state, handleState, handleStateByProperty, handleStateByObject }
}

export default useComponentState
