import { useEffect, useState, useRef } from 'react'

export default function useNearEndScreen({ distance = '350px', once = true } = {}) {
  const [isNearScreen, setIsNearScreen] = useState(false)
  const fromRef = useRef()

  useEffect(() => {
    let observer: IntersectionObserver;

    const element = fromRef.current

    const onChange = (entries: any, observer: IntersectionObserver) => {
      const el = entries[0]
      if (el.isIntersecting) {
        setIsNearScreen(true)
        once && observer.disconnect()
      } else {
        !once && setIsNearScreen(false)
      }
    }

    Promise.resolve(
      typeof IntersectionObserver !== 'undefined'
        ? IntersectionObserver
        // @ts-ignore
        : import('intersection-observer')  // polyfill in case IntersectionObserver is not found
    ).then(() => {
      observer = new IntersectionObserver(onChange, {
        rootMargin: distance
      })

      if (element) observer.observe(element)
    })

    return () => observer && observer.disconnect()
  })

  return { isNearScreen, fromRef }
}