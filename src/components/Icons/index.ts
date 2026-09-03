/**
 * @/components/Icons — centralized SVG icon library
 *
 * Semua SVG inline yang tersebar di proyek kini terpusat di sini.
 * Setiap ikon mendukung props `size` dan `color` secara konsisten.
 *
 * @example
 * import { Ornament, WideOrnament, CornerFlourish, FloralOrnament, OrnamentalDivider, WaxSeal, FooterFrame, TopBorder, EnvelopeIllustration } from "@/components/Icons"
 *
 * <Ornament size={120} color="#c9a227" />
 * <WideOrnament size="100%" color="currentColor" flip />
 * <CornerFlourish position="top-left" size={20} color="#c9a227" />
 * <FloralOrnament size={160} color="#c9a227" />
 * <OrnamentalDivider color="#c9a227" size="default" />
 * <OrnamentalDivider color="#c9a227" size={100} />
 * <WaxSeal size={72} color="#c9a227" isDark />
 * <FooterFrame size={320} color="#c9a227" isDark />
 * <TopBorder size={280} color="#c9a227" />
 * <EnvelopeIllustration size={200} color="#c9a227" isDark />
 */

export { FloralOrnament } from "./FloralOrnament"
export { default as FloralOrnamentDefault } from "./FloralOrnament"

export { OrnamentalDivider } from "./OrnamentalDivider"
export { Ornament } from "./Ornament"
export { WideOrnament } from "./WideOrnament"
export { CornerFlourish, CORNER_POS, CORNER_ROT, CORNER_POSITIONS } from "./CornerFlourish"
export type { CornerPosition } from "./CornerFlourish"

export { WaxSeal } from "./WaxSeal"
export { FooterFrame } from "./FooterFrame"
export { TopBorder } from "./TopBorder"
export { EnvelopeIllustration } from "./EnvelopeIllustration"

export type { IconProps } from "./types"
