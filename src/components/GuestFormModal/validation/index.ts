import * as yup from "yup"

export const guestFormSchema = yup.object({
  guest_name: yup.string().trim().required("Nama tamu wajib diisi"),
  akad_status: yup.boolean().default(false),
  mantu_status: yup.boolean().default(false),
  unduh_mantu_status: yup.boolean().default(false),
  guest_knock_status: yup.boolean().default(false),
})
