import * as yup from "yup"

export const guestFormSchema = yup.object({
  full_name: yup.string().trim().required("Nama tamu wajib diisi"),

  mantu_status: yup.boolean().default(false),
  unduh_mantu_status: yup.boolean().default(false),

})
