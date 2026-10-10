"use client"

import { useRef, useState, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { CreditCard, QrCode, Heart } from "lucide-react"
import { OrnamentalDivider } from "@/components/Icons"
import BankAccountCard from "./components/BankAccountCard"
import QrisCard from "./components/QrisCard"
import { useGuest } from "@/store/useGuest"
import { Tabs, TabsContent } from "@/components/Tabs"
import Header from "../Header"

gsap.registerPlugin(ScrollTrigger)

export const DigitalGift = () => {
  const { guest } = useGuest()

  const [activeTab, setActiveTab] = useState<"bank" | "qris">("bank")

  const qrisUrl: string = "/assets/qris/QRIS-Gopay.jpeg"

  const isDeviFamily =
    guest?.guest_from === "devis_mother" ||
    guest?.guest_from === "devis_father" ||
    guest?.guest_from === "devis_family_neighbor"

  useEffect(() => {
    gsap.fromTo(
      ".dg-cards-wrapper",
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", overwrite: true }
    )
  }, [activeTab])

  return (
    <section
      id="digital-gift"
      className="dg-section relative w-full scroll-mt-16 overflow-hidden bg-background"
    >
      <div className="dg-content relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-7 px-6 md:gap-8 md:px-10 ">
        <Header
          subHeader="Amplop Digital"
          title="Wedding Gift"
          subTitle="Doa restu Anda adalah hadiah terindah. Namun jika berkenan berbagi tanda kasih, amplop digital ini kami sediakan dengan penuh terima kasih."
          className="dg-rise"
        />

        <Tabs
          mode="solid"
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "bank" | "qris")}
          items={[
            {
              value: "bank",
              label: (
                <span className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Bank
                </span>
              ),
            },
            {
              value: "qris",
              label: (
                <span className="flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  QRIS
                </span>
              ),
            },
          ]}
          listLabel="Metode hadiah"
          listClassName="dg-rise"
          triggerClassName="h-auto flex-none rounded-full border-0 px-3 py-2 text-[10px] font-bold tracking-[0.14em] uppercase transition-all duration-200 data-[state=active]:bg-wedding-accent data-[state=active]:text-white data-[state=active]:shadow-md md:px-3"
        >
          <TabsContent
            value="bank"
            className="w-full data-[state=inactive]:hidden"
          >
            <div className="dg-cards-wrapper grid w-full gap-4 sm:gap-5 md:grid-cols-2">
              {isDeviFamily ? (
                <div className="md:col-span-2 md:mx-auto md:w-80">
                  <BankAccountCard
                    svg="https://znefanspvasmutcrbjmu.supabase.co/storage/v1/object/public/image-icon/bca.svg"
                    accountNumber="7130633280"
                    accountName="Selvia Agustin"
                    bankLabel="BCA"
                  />
                </div>
              ) : (
                <>
                  <BankAccountCard
                    svg="https://znefanspvasmutcrbjmu.supabase.co/storage/v1/object/public/image-icon/bni.svg"
                    accountNumber="1819801119"
                    accountName="Salman Adhim"
                    bankLabel="BNI"
                  />
                  <BankAccountCard
                    svg="https://znefanspvasmutcrbjmu.supabase.co/storage/v1/object/public/image-icon/bca.svg"
                    accountNumber="7296154554"
                    accountName="Devi Yuliana"
                    bankLabel="BCA"
                  />
                </>
              )}
            </div>
          </TabsContent>
          <TabsContent
            value="qris"
            className="w-full data-[state=inactive]:hidden"
          >
            <div className="dg-cards-wrapper flex w-full justify-center">
              <QrisCard qrisUrl={qrisUrl} qrisName="WEDDING ADHIM & DEVI" />
            </div>
          </TabsContent>
        </Tabs>

        <div className="dg-rise flex flex-col items-center gap-4 text-center">
          <OrnamentalDivider size="small" />
          <p className="max-w-md font-serif text-[13px] font-light leading-relaxed italic text-wedding-text-secondary">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak,
            Ibu, dan Saudara/i berkenan hadir untuk memberikan doa restu.
          </p>
        </div>
      </div>
    </section>
  )
}

export default DigitalGift
