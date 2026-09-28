import { create } from "zustand"

interface ImageItem {
  link: string
  name?: string
}

interface ImageUrl {
  imageUrl: {
    dark?: ImageItem[]
    light?: ImageItem[]
    icon?: ImageItem[]
  } & Record<string, ImageItem[] | undefined>
  setImageUrl: (data: any) => void
}

export const useImageUrl = create<ImageUrl>()((set) => ({
  imageUrl: {},
  setImageUrl: (data) =>
    set((state) => ({ imageUrl: { ...state.imageUrl, ...data } })),
}))
