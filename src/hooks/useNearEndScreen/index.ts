import debounceFn from 'debounce-fn'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import moviesSlice from '../../data/moviesSlice'
import { useApp } from '../useApp'

export const useNearEndScreen = ({ distance = '350px', once = true } = {}) => {
  const [isNearScreen, setShow] = useState(false)
  const fromRef = useRef()

  const { setNextPage } = moviesSlice.actions;
  const dispatch = useDispatch();
  const { getMovies } = useApp();

  useEffect(() => {
    let observer: IntersectionObserver;

    const element = fromRef.current

    const onChange = (entries: any, observer: IntersectionObserver) => {
      const el = entries[0]
      if (el.isIntersecting) {
        setShow(true)
        once && observer.disconnect()
      } else {
        !once && setShow(false)
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


  const debounceLoadMore = useCallback(
    debounceFn(
      () => {
        dispatch(setNextPage());
      },
      { wait: 200 }
    ),
    [setNextPage]
  );

  useEffect(() => {
    if (isNearScreen) {
      debounceLoadMore();
      getMovies();
    }
  }, [isNearScreen, debounceLoadMore]);


  return { fromRef }
}