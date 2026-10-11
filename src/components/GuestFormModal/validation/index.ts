import * as yup from "yup"

export const guestFormSchema = yup.object({
  full_name: yup.string().trim().required("Nama tamu wajib diisi"),
  guest_from: yup.string().required("Asal tamu wajib dipilih"),
  guest_total: yup
    .number()
    .typeError("Jumlah tamu harus berupa angka")
    .required("Jumlah tamu wajib diisi")
    .integer("Jumlah tamu harus bilangan bulat")
    .min(1, "Jumlah tamu minimal 1"),

  mantu_status: yup.boolean().default(false),
  unduh_mantu_status: yup.boolean().default(false),

})
