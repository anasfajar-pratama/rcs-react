import { useEffect, useState, useCallback } from 'react'
import api from '../lib/api'

export interface SiteSettings {
  site_name?: string
  site_description?: string
  site_logo?: string
  site_favicon?: string
  [key: string]: string | undefined
}

const CACHE_KEY = 'site_settings_cache'

function loadCache(): SiteSettings {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function updateFavicon(url?: string) {
  const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
  if (link) link.href = url || '/favicon.svg'
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(loadCache)
  const [loaded, setLoaded] = useState(false)

  const refreshSettings = useCallback(() => {
    return api.get('/settings').then((res) => {
      if (res.data) {
        setSettings(res.data)
        localStorage.setItem(CACHE_KEY, JSON.stringify(res.data))
        updateFavicon(res.data.site_favicon)
      }
      return res.data
    }).catch(() => null)
  }, [])

  useEffect(() => {
    refreshSettings().finally(() => setLoaded(true))
  }, [refreshSettings])

  return { settings, loaded, refreshSettings }
}
