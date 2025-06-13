
import { useState } from "react"

export function useLocalStorageCache<T>(key: string, defaultValue: T) {
    const [value, setValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : defaultValue
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error)
            return defaultValue
        }
    })

    const setStoredValue = (newValue: T | ((val: T) => T)) => {
        try {
            const valueToStore = newValue instanceof Function ? newValue(value) : newValue
            setValue(valueToStore)
            window.localStorage.setItem(key, JSON.stringify(valueToStore))
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error)
        }
    }

    return [value, setStoredValue] as const
}

export function useArticleCache() {
    const CACHE_DURATION = 5 * 60 * 1000

    const getCachedArticles = () => {
        try {
            const cached = localStorage.getItem("articles_cache_client")
            if (cached) {
                const { data, timestamp } = JSON.parse(cached)
                if (Date.now() - timestamp < CACHE_DURATION) {
                    return data
                }
            }
        } catch (error) {
            console.warn("Error reading articles cache:", error)
        }
        return null
    }

    const setCachedArticles = (articles: any[]) => {
        try {
            localStorage.setItem(
                "articles_cache_client",
                JSON.stringify({
                    data: articles,
                    timestamp: Date.now(),
                }),
            )
        } catch (error) {
            console.warn("Error caching articles:", error)
        }
    }

    const clearCache = () => {
        localStorage.removeItem("articles_cache_client")
    }

    return { getCachedArticles, setCachedArticles, clearCache }
}


export function useRecentlyViewedProducts(maxItems = 10) {
    const [recentlyViewed, setRecentlyViewed] = useLocalStorageCache<string[]>("recently_viewed_products", [])

    const addProduct = (productId: string) => {
        setRecentlyViewed((prev) => {
            const filtered = prev.filter((id) => id !== productId)
            return [productId, ...filtered].slice(0, maxItems)
        })
    }

    return { recentlyViewed, addProduct }
}

export function useClientPreferences() {
    return useLocalStorageCache("client_preferences", {
        viewMode: "grid" as "grid" | "list",
        showRecentlyViewed: true,
        showRecommendations: true,
    })
}
