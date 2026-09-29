import { OrnamentalDivider } from "@/components/Icons"

const PanelHeader = () => (
  <div className="flex flex-col items-center px-6 pt-5 pb-1 text-center">
    <p className="font-sans text-[10px] font-semibold tracking-[0.32em] text-wedding-text-secondary uppercase">
      Devi &amp; Adhim
    </p>
    <p className="mt-1 font-signature text-[28px] leading-none text-wedding-text-primary">
      Navigasi
    </p>
    <OrnamentalDivider size="small" className="mt-3 opacity-80" />
  </div>
)

export default PanelHeader
