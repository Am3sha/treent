import * as React from "react"

const MOBILE_BREAKPOINT = 768
const MOBILE_MEDIA_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

const subscribe = (onStoreChange: () => void) => {
  const mediaQueryList = window.matchMedia(MOBILE_MEDIA_QUERY)
  mediaQueryList.addEventListener("change", onStoreChange)
  return () => mediaQueryList.removeEventListener("change", onStoreChange)
}

const getSnapshot = () => window.matchMedia(MOBILE_MEDIA_QUERY).matches
// Default to true for server snapshot to avoid layout shift on mobile, 
// as desktop styles are usually easier to hide/show via CSS than mobile menu.
const getServerSnapshot = () => true

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
