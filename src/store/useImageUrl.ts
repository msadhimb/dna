import { create } from "zustand"

interface ImageUrl {
  imageUrl: Record<string, string>
  setImageUrl: (data: any) => void
}

export const useImageUrl = create<ImageUrl>()((set) => ({
  imageUrl: {},
  setImageUrl: (data) =>
    set((state) => ({ imageUrl: { ...state.imageUrl, ...data } })),
}))
