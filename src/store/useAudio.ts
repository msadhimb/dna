import { create } from "zustand"

export type AudioTrack = {
  name: string
  title: string
  src: string
}

interface AudioState {
  isPlaying: boolean
  src: string
  title: string
  playlist: AudioTrack[]
  currentIndex: number
  volume: number
  setIsPlaying: (isPlaying: boolean) => void
  toggle: () => void
  setSrc: (src: string, title?: string) => void
  setVolume: (volume: number) => void
  setPlaylist: (playlist: AudioTrack[]) => void
  setCurrentIndex: (index: number) => void
  next: () => void
  prev: () => void
}

function titleFromSrc(src: string) {
  try {
    const name = decodeURIComponent(src.split("/").pop() ?? src)
    return name.replace(/\.[^/.]+$/, "")
  } catch {
    return src
  }
}

export const useAudio = create<AudioState>()((set, get) => ({
  isPlaying: false,
  src: "",
  title: "",
  playlist: [],
  currentIndex: 0,
  volume: 0.6,

  setIsPlaying: (isPlaying) => set({ isPlaying }),

  toggle: () => set((s) => ({ isPlaying: !s.isPlaying })),

  setSrc: (src, title) =>
    set({
      src,
      title: title ?? titleFromSrc(src),
      playlist: [],
      currentIndex: 0,
    }),

  setVolume: (volume) => set({ volume }),

  setPlaylist: (playlist) =>
    set(() => {
      if (playlist.length === 0)
        return { playlist, src: "", title: "", currentIndex: 0 }
      const first = playlist[0]
      return {
        playlist,
        src: first.src,
        title: first.title,
        currentIndex: 0,
      }
    }),

  setCurrentIndex: (index) =>
    set((s) => {
      if (s.playlist.length === 0) return s
      const idx = ((index % s.playlist.length) + s.playlist.length) % s.playlist.length
      const track = s.playlist[idx]
      return { currentIndex: idx, src: track.src, title: track.title }
    }),

  next: () => {
    const { playlist, currentIndex } = get()
    if (playlist.length === 0) return
    const idx = (currentIndex + 1) % playlist.length
    const track = playlist[idx]
    set({ currentIndex: idx, src: track.src, title: track.title })
  },

  prev: () => {
    const { playlist, currentIndex } = get()
    if (playlist.length === 0) return
    const idx = (currentIndex - 1 + playlist.length) % playlist.length
    const track = playlist[idx]
    set({ currentIndex: idx, src: track.src, title: track.title })
  },
}))
