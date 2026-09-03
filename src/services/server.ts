
import { createClient } from "@/utils/supabase/server"
import axios, { AxiosRequestConfig } from "axios"
import { cookies } from "next/headers"


const BASE_URL = process.env.NEXT_PUBLIC_API || ""

interface ServerConfig {
  withSession?: boolean
}

const createService =
  (baseUrl: string | undefined) =>
  async (
    payload: AxiosRequestConfig,
    { withSession = true }: ServerConfig = {}
  ) => {
    let accessToken = null

    if (withSession) {
      const supabase = await createClient(await cookies())
      const {
        data: { session },
      } = await supabase.auth.getSession()
      accessToken = session?.access_token
    }

    const cookieStore = await cookies()
    const userAgent = cookieStore.get("user-agent")?.value || ""
    const ip = cookieStore.get("x-forwarded-for")?.value || ""

    try {
      const config = {
        ...payload,
        baseURL: baseUrl,
        headers: {
          ...payload.headers,
          "User-Agent": userAgent,
          "X-Forwarded-For": ip,
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      }

      const response = await axios(config)

      if (response && !response?.data?.error) {
        return response.data
      }

      return Promise.reject(JSON.stringify(response.data))
    } catch (error: any) {
      return Promise.reject({
        message:
          typeof error?.response?.data === "string"
            ? error?.response?.data
            : (error?.response?.data?.message ??
              error?.message ??
              "Unknown error"),
        status: error?.response?.status ?? 500,
        code: error?.response?.status ?? 500,
        data: error?.response?.data ?? {},
      })
    }
  }

const serverApi = createService(BASE_URL)

export default serverApi
