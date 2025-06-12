"use client"

import type React from "react"
import { useContext, useEffect, useState, useMemo } from "react"
import type { RouteComponentProps } from "react-router"
import {
    IonContent,
    IonHeader,
    IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonLoading,
    IonPage,
    IonToolbar,
} from "@ionic/react"
import {
    searchOutline,
    gridOutline,
    listOutline,
    locate,
    sparkles,
    menu,
    close,
    checkmarkOutline,
    pricetagOutline,
    layersOutline,
    swapVerticalOutline,
    funnel,
    refreshOutline,
    starOutline,
    grid,
    cartOutline,
    eyeOutline,
} from "ionicons/icons"
import Article from "./Article"
import { getLogger } from "../core"
import { ArticleContext } from "./ArticleProvider"
import type { IArticleProps } from "./ArticleProps"
import { useNetwork } from "../core/useNetwork"
import { AuthContext } from "../auth"
import { MyModal } from "../shared/components/MyModal"
import { logoInstagram, logoFacebook } from "ionicons/icons"
import "../shared/theme/enhanced-filters-styles.css"
import {
    useLocalStorageCache,
    useArticleCache,
    useRecentlyViewedProducts,
    useClientPreferences,
} from "../shared/hooks/use-local-storage-cache"
import WhatsAppButton from "../shared/components/WhatsAppButton";

const log = getLogger("ArticleListClient")

// Interfață pentru starea filtrelor
interface FilterState {
    searchArticle: string
    sortOrder: string
    categoryFilter: string
    priceRange: [number, number]
    articlesIndex: number
}

const defaultFilterState: FilterState = {
    searchArticle: "",
    sortOrder: "none",
    categoryFilter: "all",
    priceRange: [0, 10000],
    articlesIndex: 30,
}

const OptimizedArticleListClient: React.FC<RouteComponentProps> = ({ history }) => {
    const { articles, fetching, fetchingError } = useContext(ArticleContext)
    const { logout, isAuthenticated, email } = useContext(AuthContext)
    const { networkStatus } = useNetwork()
    const { getCachedArticles, setCachedArticles, clearCache } = useArticleCache()
    const { recentlyViewed } = useRecentlyViewedProducts()

    // Stare persistentă pentru filtre
    const [filterState, setFilterState] = useLocalStorageCache<FilterState>("client_article_filters", defaultFilterState)

    // Preferințe client (inclusiv viewMode)
    const [clientPreferences, setClientPreferences] = useClientPreferences()

    // Stare UI (nepersistentă)
    const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false)
    const [isFiltersOpen, setIsFiltersOpen] = useLocalStorageCache("client_filters_sidebar_open", false)
    const [isExtrasOpen, setIsExtrasOpen] = useState(false)
    const [partialListOfArticles, setPartialListOfArticles] = useState<IArticleProps[]>([])

    // Destructurare pentru acces mai ușor
    const { searchArticle, sortOrder, categoryFilter, priceRange, articlesIndex } = filterState
    const { viewMode } = clientPreferences

    // Actualizare valori individuale de filtrare
    const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        setFilterState((prev) => ({ ...prev, [key]: value }))
    }

    // Actualizare preferințe client
    const updatePreference = <K extends keyof typeof clientPreferences>(key: K, value: (typeof clientPreferences)[K]) => {
        setClientPreferences((prev) => ({ ...prev, [key]: value }))
    }

    const categories = [
        { key: "all", label: "Toate", icon: layersOutline, count: articles?.length || 0 },
        {
            key: "auto",
            label: "Poartă Auto",
            icon: gridOutline,
            count: articles?.filter((a) => a.text.toLowerCase().includes("auto")).length || 0,
        },
        {
            key: "pietonală",
            label: "Poartă Pietonală",
            icon: gridOutline,
            count: articles?.filter((a) => a.text.toLowerCase().includes("pietonală")).length || 0,
        },
        {
            key: "gard",
            label: "Panou Gard",
            icon: gridOutline,
            count: articles?.filter((a) => a.text.toLowerCase().includes("gard")).length || 0,
        },
        {
            key: "balustrada",
            label: "Balustradă",
            icon: listOutline,
            count: articles?.filter((a) => a.text.toLowerCase().includes("balustrada")).length || 0,
        },

        {
            key: "suport masa",
            label: "Suport Masă",
            icon: listOutline,
            count: articles?.filter((a) => a.text.toLowerCase().includes("masă")).length || 0,
        },

        {
            key: "gratar",
            label: "Grătar",
            icon: listOutline,
            count: articles?.filter((a) => a.text.toLowerCase().includes("gratar")).length || 0,
        },
    ]

    const sortOptions = [
        { value: "none", label: "Sortare implicită", icon: layersOutline },
        { value: "asc", label: "Preț crescător", icon: swapVerticalOutline },
        { value: "desc", label: "Preț descrescător", icon: swapVerticalOutline },
        { value: "name", label: "Nume A-Z", icon: layersOutline },
    ]

    useEffect(() => {
        if (!isAuthenticated) {
            history.push("/")
        }
    }, [isAuthenticated])

    // Articole filtrate și sortate (memorizate pentru performanță)
    const filteredArticles = useMemo(() => {
        if (!articles) return []

        let selectedArticles = [...articles]

        // Căutare după text
        if (searchArticle) {
            selectedArticles = selectedArticles.filter((article) =>
                article.text.toLowerCase().includes(searchArticle.toLowerCase()),
            )
        }

        // Filtrare după categorie
        if (categoryFilter !== "all") {
            selectedArticles = selectedArticles.filter((article) =>
                article.text.toLowerCase().includes(categoryFilter.toLowerCase()),
            )
        }

        // Filtrare după interval de preț
        selectedArticles = selectedArticles.filter((article) => {
            const price = article.price || 0
            return price >= priceRange[0] && price <= priceRange[1]
        })

        // Sortare după preț
        if (sortOrder === "asc") {
            selectedArticles.sort((a, b) => (a.price || 0) - (b.price || 0))
        } else if (sortOrder === "desc") {
            selectedArticles.sort((a, b) => (b.price || 0) - (a.price || 0))
        } else if (sortOrder === "name") {
            selectedArticles.sort((a, b) => a.text.localeCompare(b.text))
        }

        return selectedArticles
    }, [articles, searchArticle, sortOrder, categoryFilter, priceRange])

    // Lista parțială pentru paginare (memorizată)
    useEffect(() => {
        setPartialListOfArticles(filteredArticles.slice(0, articlesIndex))
    }, [filteredArticles, articlesIndex])

    // Cache articole când sunt încărcate
    useEffect(() => {
        if (articles && articles.length > 0) {
            setCachedArticles(articles)
        }
    }, [articles, setCachedArticles])

    async function searchNext($event: CustomEvent<void>) {
        if (filteredArticles && partialListOfArticles) {
            if (partialListOfArticles.length === filteredArticles.length) {
                setDisableInfiniteScroll(true)
            }
            updateFilter("articlesIndex", articlesIndex + 5)
        }
        await ($event.target as HTMLIonInfiniteScrollElement).complete()
    }

    const resetFilters = () => {
        setFilterState(defaultFilterState)
        setDisableInfiniteScroll(false)
    }

    const activeFiltersCount = () => {
        let count = 0
        if (categoryFilter !== "all") count++
        if (sortOrder !== "none") count++
        if (priceRange[0] !== 0 || priceRange[1] !== 10000) count++
        if (searchArticle) count++
        return count
    }

    // Curăță cache-ul când utilizatorul reîmprospătează manual
    const handleRefresh = () => {
        clearCache()
        window.location.reload()
    }


    return (
        <IonPage className="articles-page">
            {/* Background */}
            <div className="articles-background">
                <div className="background-overlay"></div>
                <div className="floating-element floating-element-1"></div>
                <div className="floating-element floating-element-2"></div>
                <div className="particle particle-1"></div>
                <div className="particle particle-2"></div>
            </div>

            {/* Header */}
            <IonHeader className="articles-header">
                <IonToolbar className="articles-toolbar">
                    <div className="modern-toolbar-content">
                        {/* Logo */}
                        <div className="toolbar-logo" onClick={() => history.push("/articlesClient")}>
                            <div className="logo-icon">
                                <IonIcon icon={sparkles} />
                            </div>
                            <span className="logo-text">Confectii Metalice DN</span>
                        </div>

                        {/* Right Actions */}
                        <div className="toolbar-actions">
                            <div className="desktop-toolbar-extras-items" onClick={() => history.push("/aboutus")}>
                                <IonIcon icon={sparkles} />
                                <span>Despre Noi</span>
                            </div>
                            <div className="desktop-toolbar-extras-items" onClick={() => history.push("/reviewus")}>
                                <IonIcon icon={starOutline} />
                                <span>Recenzii</span>
                            </div>
                            <div className="desktop-toolbar-extras-items" onClick={() => history.push("/our-work")}>
                                <IonIcon icon={layersOutline} />
                                <span>Proiectele Noastre</span>
                            </div>

                            {/* Refresh Cache Button */}
                            <button className="action-button" onClick={handleRefresh} title="Reîmprospătează produsele">
                                <IonIcon icon={refreshOutline} />
                            </button>

                            {/* Settings Modal */}
                            <button className="action-button" onClick={() => setIsExtrasOpen(!isExtrasOpen)}>
                                <IonIcon icon={grid} />
                            </button>

                            {/* Cart Button */}
                            <button className="action-button" onClick={() => history.push("/cart")}>
                                <IonIcon icon={cartOutline} />
                            </button>

                            {/* Settings Modal */}
                            <MyModal />
                            <button className="mobile-menu-button" onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
                                <IonIcon icon={isFiltersOpen ? close : menu} />
                            </button>
                        </div>
                    </div>
                </IonToolbar>
            </IonHeader>

            {isExtrasOpen && (
                <>
                    {/* Background transparent overlay to close on outside click */}
                    <div className="extras-backdrop" onClick={() => setIsExtrasOpen(false)}></div>
                    <div className="extras-overlay">
                        <div className="extras-item" onClick={() => history.push("/aboutus")}>
                            <IonIcon icon={sparkles} />
                            <span>Despre Noi</span>
                        </div>
                        <div className="extras-item" onClick={() => history.push("/reviewus")}>
                            <IonIcon icon={starOutline} />
                            <span>Recenzii</span>
                        </div>
                        <div className="extras-item" onClick={() => history.push("/our-work")}>
                            <IonIcon icon={layersOutline} />
                            <span>Proiectele Noastre</span>
                        </div>
                        <a className="extras-item" href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <IonIcon icon={logoInstagram} />
                            <span>Instagram</span>
                        </a>
                        <a className="extras-item" href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <IonIcon icon={logoFacebook} />
                            <span>Facebook</span>
                        </a>
                        <a
                            href="https://maps.app.goo.gl/AT4vJNj38krRNNNW8"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="extras-item"
                        >
                            <IonIcon icon={locate} />
                            Locatie
                        </a>
                    </div>
                </>
            )}

            <IonContent className="articles-content">

                <div className="articles-layout">
                    {/* Enhanced Filters Sidebar */}
                    <div className={`enhanced-filters-sidebar ${isFiltersOpen ? "filters-open show" : ""}`}>
                        <div className="enhanced-filters-content">
                            {/* Filters Header */}
                            <div className="enhanced-filters-header">
                                <div className="filters-title-section">
                                    <div className="filters-icon-wrapper">
                                        <IonIcon icon={funnel} />
                                    </div>
                                    <div className="filters-title-text">
                                        <h2>Filtrează Produsele</h2>
                                        <p>{partialListOfArticles.length} produse găsite</p>
                                    </div>
                                </div>
                                <div className="filters-header-actions">
                                    <button className="reset-filters-btn" onClick={resetFilters}>
                                        <IonIcon icon={refreshOutline} />
                                        <span>Reset</span>
                                    </button>
                                </div>
                            </div>

                            {/* Categories Section */}
                            <div className="enhanced-filter-section">
                                <div className="section-header">
                                    <h3 className="section-title">
                                        <IonIcon icon={layersOutline} />
                                        Categorii
                                    </h3>
                                </div>
                                <div className="enhanced-category-grid">
                                    {categories.map((category) => (
                                        <button
                                            key={category.key}
                                            className={`enhanced-category-card ${categoryFilter === category.key ? "active" : ""}`}
                                            onClick={() => updateFilter("categoryFilter", category.key)}
                                        >
                                            <div className="category-card-icon">
                                                <IonIcon icon={category.icon} />
                                            </div>
                                            <div className="category-card-content">
                                                <span className="category-card-label">{category.label}</span>
                                                <span className="category-card-count">{category.count} produse</span>
                                            </div>
                                            {categoryFilter === category.key && (
                                                <div className="category-card-check">
                                                    <IonIcon icon={checkmarkOutline} />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sort Section */}
                            <div className="enhanced-filter-section">
                                <div className="section-header">
                                    <h3 className="section-title">
                                        <IonIcon icon={swapVerticalOutline} />
                                        Sortare
                                    </h3>
                                </div>
                                <div className="enhanced-sort-options">
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            className={`enhanced-sort-option ${sortOrder === option.value ? "active" : ""}`}
                                            onClick={() => updateFilter("sortOrder", option.value)}
                                        >
                                            <div className="sort-option-icon">
                                                <IonIcon icon={option.icon} />
                                            </div>
                                            <span className="sort-option-label">{option.label}</span>
                                            {sortOrder === option.value && (
                                                <div className="sort-option-check">
                                                    <IonIcon icon={checkmarkOutline} />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range Section */}
                            <div className="enhanced-filter-section">
                                <div className="section-header">
                                    <h3 className="section-title">
                                        <IonIcon icon={pricetagOutline} />
                                        Interval Preț
                                    </h3>
                                </div>
                                <div className="price-range-container">
                                    <div className="price-range-presets">
                                        <button
                                            className={`price-preset-btn ${priceRange[0] === 0 && priceRange[1] === 500 ? "active" : ""}`}
                                            onClick={() => updateFilter("priceRange", [0, 500])}
                                        >
                                            Sub RON 500
                                        </button>
                                        <button
                                            className={`price-preset-btn ${priceRange[0] === 500 && priceRange[1] === 1000 ? "active" : ""}`}
                                            onClick={() => updateFilter("priceRange", [500, 1000])}
                                        >
                                            RON 500 - RON 1000
                                        </button>
                                        <button
                                            className={`price-preset-btn ${priceRange[0] === 1000 && priceRange[1] === 2500 ? "active" : ""}`}
                                            onClick={() => updateFilter("priceRange", [1000, 2500])}
                                        >
                                            RON 1000 - RON 2500
                                        </button>
                                        <button
                                            className={`price-preset-btn ${priceRange[0] === 2500 && priceRange[1] === 10000 ? "active" : ""}`}
                                            onClick={() => updateFilter("priceRange", [2500, 10000])}
                                        >
                                            Peste RON 2500
                                        </button>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="articles-main">
                        {/* Results Header */}
                        <div className="results-header">
                            <div className="results-info">
                                <h1 className="results-title">Confecții Metalice DN</h1>
                                <p className="results-subtitle">
                                    {partialListOfArticles.length} produse găsite
                                    {categoryFilter !== "all" &&
                                        ` în categoria "${categories.find((c) => c.key === categoryFilter)?.label}"`}
                                </p>
                            </div>
                            <div className="results-actions">
                                <button
                                    className={`view-toggle-btn ${viewMode === "grid" ? "active" : ""}`}
                                    onClick={() => updatePreference("viewMode", "grid")}
                                >
                                    <IonIcon icon={gridOutline} />
                                </button>
                                <button
                                    className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
                                    onClick={() => updatePreference("viewMode", "list")}
                                >
                                    <IonIcon icon={listOutline} />
                                </button>
                            </div>
                        </div>

                        {/* Active Filters Display */}
                        {activeFiltersCount() > 0 && (
                            <div className="active-filters-bar">
                                <div className="active-filters-content">
                                    <span className="active-filters-label">Filtre active:</span>
                                    <div className="active-filters-list">
                                        {categoryFilter !== "all" && (
                                            <div className="active-filter-tag">
                                                <span>{categories.find((c) => c.key === categoryFilter)?.label}</span>
                                                <button onClick={() => updateFilter("categoryFilter", "all")}>
                                                    <IonIcon icon={close} />
                                                </button>
                                            </div>
                                        )}
                                        {sortOrder !== "none" && (
                                            <div className="active-filter-tag">
                                                <span>{sortOptions.find((s) => s.value === sortOrder)?.label}</span>
                                                <button onClick={() => updateFilter("sortOrder", "none")}>
                                                    <IonIcon icon={close} />
                                                </button>
                                            </div>
                                        )}
                                        {(priceRange[0] !== 0 || priceRange[1] !== 10000) && (
                                            <div className="active-filter-tag">
                        <span>
                          {priceRange[0] === 0 && priceRange[1] === 500
                              ? "Sub RON 500"
                              : priceRange[0] === 500 && priceRange[1] === 1000
                                  ? "RON 500 - RON 1000"
                                  : priceRange[0] === 1000 && priceRange[1] === 2500
                                      ? "RON 1000 - RON 2500"
                                      : priceRange[0] === 2500 && priceRange[1] === 10000
                                          ? "Peste RON 2500"
                                          : `RON ${priceRange[0]} - RON ${priceRange[1]}`}
                        </span>
                                                <button onClick={() => updateFilter("priceRange", [0, 10000])}>
                                                    <IonIcon icon={close} />
                                                </button>
                                            </div>
                                        )}
                                        {searchArticle && (
                                            <div className="active-filter-tag">
                                                <span>Căutare: {searchArticle}</span>
                                                <button onClick={() => updateFilter("searchArticle", "")}>
                                                    <IonIcon icon={close} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <button className="clear-all-filters-btn" onClick={resetFilters}>
                                        <IonIcon icon={refreshOutline} />
                                        <span>Șterge toate</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Loading */}
                        <IonLoading isOpen={fetching} message="Se încarcă produsele..." />

                        {/* Articles Grid */}
                        {partialListOfArticles && (
                            <div className={`articles-grid ${viewMode === "list" ? "list-view" : "grid-view"}`}>
                                {partialListOfArticles.map((article: IArticleProps) => (
                                    <Article
                                        key={article._id}
                                        _id={article._id}
                                        text={article.text}
                                        isUseful={article.isUseful}
                                        price={article.price}
                                        onEdit={(id) => history.push(`/article-show/${id}`)}
                                        image={article.image}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Infinite Scroll */}
                        <IonInfiniteScroll
                            threshold="5%"
                            disabled={disableInfiniteScroll}
                            onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}
                        >
                            <IonInfiniteScrollContent loadingText="Se încarcă mai multe produse..." />
                        </IonInfiniteScroll>

                        {/* Error Message */}
                        {fetchingError && (
                            <div className="error-message">
                                <IonIcon icon={close} />
                                <span>{fetchingError.message || "Eroare la încărcarea produselor"}</span>
                            </div>
                        )}

                        {/* Empty State */}
                        {!fetching && partialListOfArticles.length === 0 && (
                            <div className="empty-state">
                                <div className="empty-icon">
                                    <IonIcon icon={searchOutline} />
                                </div>
                                <h3>Nu am găsit produse</h3>
                                <p>Încearcă să modifici filtrele sau termenul de căutare</p>
                                <button className="reset-filters-button" onClick={resetFilters}>
                                    Resetează filtrele
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </IonContent>

            {/* Filters Overlay */}
            {isFiltersOpen && (
                <div className={`filters-overlay ${isFiltersOpen ? "show" : ""}`} onClick={() => setIsFiltersOpen(false)}></div>
            )}
            <WhatsAppButton />
        </IonPage>
    )
}

export default OptimizedArticleListClient
