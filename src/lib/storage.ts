export const clearLocalStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.clear()
  }
}
