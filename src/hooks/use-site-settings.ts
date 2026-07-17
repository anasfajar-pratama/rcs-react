import { useEffect, useState } from 'react'
import api from '../lib/api'

interface SiteSettings {
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

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(loadCache)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    api.get('/settings').then((res) => {
      if (res.data) {
        setSettings(res.data)
        localStorage.setItem(CACHE_KEY, JSON.stringify(res.data))
        if (res.data.site_favicon) {
          const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
          if (link) link.href = res.data.site_favicon
        }
      }
    }).catch(() => {}).finally(() => setLoaded(true))
  }, [])

  return { settings, loaded }
}
