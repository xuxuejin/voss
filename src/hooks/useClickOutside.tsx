import { RefObject, useEffect } from "react";

function useClickOutside(ref: RefObject<HTMLElement>, handler: Function) {
    useEffect(() => {
        const listener = (ev: MouseEvent) => {
            if(!ref.current || ref.current.contains(ev.target as HTMLElement)) {
                return
            }
            handler(ev)
        }
        document.addEventListener('click', listener)

        return () => {
            document.removeEventListener('click', listener)
        }
    }, [ref, handler])
}

export default useClickOutside