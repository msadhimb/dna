import * as yup from "yup"

export const guestFormSchema = yup.object({
  full_name: yup.string().trim().required("Nama tamu wajib diisi"),
  guest_from: yup.string().required("Asal tamu wajib dipilih"),

  mantu_status: yup.boolean().default(false),
  unduh_mantu_status: yup.boolean().default(false),

})
