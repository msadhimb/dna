"use client"

import { clearLocalStorage } from "@/lib/storage"
import { createClient } from "@/utils/supabase/client"
import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import { Dispatch, SetStateAction } from "react"

const CancelToken = axios.CancelToken
let cancel: any = undefined

const supabase = createClient()

const axiosInterceptorInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API
    ? `${process.env.NEXT_PUBLIC_API}/api`
    : "/api",
  timeout: 1000000,
})

const onFulfilled = (response: AxiosResponse) => Promise.resolve(response)

const onRejected = async (error: any) => {
  const originalRequest = error.config

  if (error.response?.status === 401) {
    if (!originalRequest._retry) {
      originalRequest._retry = true

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (session) {
          // If session exists, try changing the header or just retry
          originalRequest.headers.Authorization = `Bearer ${session.access_token}`
          return axiosInterceptorInstance(originalRequest)
        } else {
          throw new Error("No session found")
        }
      } catch (refreshError) {
        clearLocalStorage()
        await supabase.auth.signOut()
        return Promise.reject(error)
      }
    } else {
      clearLocalStorage()
      await supabase.auth.signOut()
      return Promise.reject(error)
    }
  } else if (error.response?.status === 403 || error.response?.status === 404) {
    window.location.href = "/"
  } else if (error.response?.status === 503) {
    window.location.href = "/503"
  }

  return Promise.reject(error)
}

axiosInterceptorInstance.interceptors.response.use(onFulfilled, onRejected)

// Add request interceptor to attach token
axiosInterceptorInstance.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (session) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  return config
})

const clientApi = async (payload: AxiosRequestConfig) => {
  payload.timeout = 120000

  try {
    const response = await axiosInterceptorInstance({
      withCredentials: false,
      ...payload,
      cancelToken: new CancelToken(function executor(c) {
        cancel = c
      }),
    })

    if (response && response.data) {
      return response.data
    }

    return Promise.reject(JSON.stringify(response.data))
  } catch (error: any) {
    const err = new Error(
      error?.response?.data?.error ?? // ← sesuaikan dengan key dari API kamu
        error?.response?.data?.message ??
        error?.message ??
        "An error occurred"
    )

    // Attach extra info ke error object
    ;(err as any).status = error?.response?.status ?? 500
    ;(err as any).code = error?.response?.status ?? 500
    ;(err as any).data = error?.response?.data?.data ?? {}

    return Promise.reject(err)
  }
}

export async function fetchDocument(
  endpoint: string,
  filename: string,
  setDocumentFile: Dispatch<SetStateAction<File[]>>
) {
  try {
    const response = await fetch(endpoint + filename)
    const blob = await response.blob()
    const file = new File([blob], filename, { type: blob.type })
    setDocumentFile([file])
  } catch (error) {
    console.error("Error fetching document:", error)
  }
}

export default clientApi
