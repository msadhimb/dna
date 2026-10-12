import moment from "moment"

export const fmtTime = (iso: string | null | undefined) =>
  iso ? moment(iso).format("DD MMM YYYY • HH:mm") : "-"
