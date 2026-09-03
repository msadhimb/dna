import { Button } from "@/components/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { guestFromList } from "@/helper/guestFormList"
import { AlertCircle, Check, FileSpreadsheet, Loader2, X } from "lucide-react"

const ModalImport = ({
  isPreviewOpen,
  setIsPreviewOpen,
  parsedData,
  setParsedData,
  file,
  setFile,
  handleImportSubmit,
  isImporting,
}: {
  isPreviewOpen: boolean
  setIsPreviewOpen: (open: boolean) => void
  parsedData: any[]
  setParsedData: (parsedData: any[]) => void
  file: File | null
  setFile: (file: File | null) => void
  handleImportSubmit: () => void
  isImporting: boolean
}) => {
  return (
    <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
      <DialogContent className="sm:max-w-xl font-manrope max-h-[90vh] flex flex-col ">
        <DialogHeader className="mb-2 shrink-0">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
            <FileSpreadsheet className="size-5 text-emerald-500" />
            Konfirmasi Import Tamu
          </DialogTitle>
          <DialogDescription className="text-sm mt-1">
            Ditemukan{" "}
            <span className="font-semibold text-foreground">
              {parsedData.length}
            </span>{" "}
            baris data tamu di dalam file{" "}
            <span className="font-semibold text-foreground">{file?.name}</span>.
            Silakan tinjau preview 5 baris pertama data Anda di bawah ini.
          </DialogDescription>
        </DialogHeader>

        
        <div className="flex-1 overflow-y-auto border border-border rounded-lg mb-4">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-muted  border-b border-border">
              <tr>
                <th className="px-4 py-2 font-medium text-secondary">
                  Nama Tamu
                </th>
                <th className="px-4 py-2 font-medium text-secondary text-center">
                  Tamu Dari
                </th>
                <th className="px-4 py-2 font-medium text-secondary text-center">
                  Mantu
                </th>
                <th className="px-4 py-2 font-medium text-secondary text-center">
                  Unduh Mantu
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {parsedData.slice(0, 5).map((row, idx) => (
                <tr key={idx} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-2.5 font-medium text-foreground truncate max-w-[200px]">
                    {row.full_name}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {guestFromList.find(
                      (guestFrom) => guestFrom.id === row.guest_from
                    )?.name || row.guest_from}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-center">
                      {row.mantu_status ? (
                        <Check className="size-4 text-emerald-500" />
                      ) : (
                        <X className="size-4 text-rose-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-center">
                      {row.unduh_mantu_status ? (
                        <Check className="size-4 text-emerald-500" />
                      ) : (
                        <X className="size-4 text-rose-500" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {parsedData.length > 5 && (
            <div className="text-center py-2 bg-muted/30 border-t border-border text-[11px] text-muted-foreground italic">
              Menampilkan 5 dari {parsedData.length} baris data...
            </div>
          )}
        </div>

        
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs rounded-lg p-3 flex gap-2.5 items-start mb-4 shrink-0">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Info:</strong> Tamu baru akan <strong>ditambahkan</strong>.
            Tamu yang sudah ada (nama sama, case-insensitive) akan{" "}
            <strong>diperbarui</strong> statusnya sesuai data di file Excel.
          </p>
        </div>

        <DialogFooter className="gap-2 shrink-0 sm:justify-end">
          <Button
            variant="destructive"
            onClick={() => {
              setIsPreviewOpen(false)
              setParsedData([])
              setFile(null)
            }}
            disabled={isImporting}
            className="hover:cursor-pointer"
          >
            Batal
          </Button>
          <Button
            onClick={handleImportSubmit}
            disabled={isImporting}
            className="flex items-center gap-2"
          >
            {isImporting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Mengimpor...
              </>
            ) : (
              <>
                <Check className="size-4" />
                Import Sekarang
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ModalImport
