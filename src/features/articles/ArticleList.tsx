
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
    sparkles,
    menu,
    close,
    checkmarkOutline,
    pricetagOutline,
    layersOutline,
    swapVerticalOutline,
    funnel,
    refreshOutline,
    addOutline,
} from "ionicons/icons"
import Article from "./Article"
import { getLogger } from "../core"
import { ArticleContext } from "./ArticleProvider"
import type { IArticleProps } from "./ArticleProps"
import { useNetwork } from "../core/useNetwork"
import { AuthContext } from "../auth"
import "../shared/theme/enhanced-filters-styles.css"
import { MyModalAdmin } from "../shared/components/MyModalAdmin"
import { useLocalStorageCache, useArticleCache } from "../shared/hooks/use-local-storage-cache"

const log = getLogger("ArticleList")

interface FilterState {
    searchArticle: string
    sortOrder: string
    categoryFilter: string
    priceRange: [number, number]
    viewMode: "grid" | "list"
    articlesIndex: number
}

const defaultFilterState: FilterState = {
    searchArticle: "",
    sortOrder: "none",
    categoryFilter: "all",
    priceRange: [0, 10000],
    viewMode: "grid",
    articlesIndex: 30,
}

const OptimizedArticleList: React.FC<RouteComponentProps> = ({ history }) => {
    const { articles, fetching, fetchingError } = useContext(ArticleContext)
    const { logout, isAuthenticated, email } = useContext(AuthContext)
    const { networkStatus } = useNetwork()
    const { getCachedArticles, setCachedArticles, clearCache } = useArticleCache()

    const [filterState, setFilterState] = useLocalStorageCache<FilterState>("article_filters", defaultFilterState)

    const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false)
    const [isFiltersOpen, setIsFiltersOpen] = useLocalStorageCache("filters_sidebar_open", false)
    const [isExtrasOpen, setIsExtrasOpen] = useState(false)

    const { searchArticle, sortOrder, categoryFilter, priceRange, viewMode, articlesIndex } = filterState

    const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        setFilterState((prev) => ({ ...prev, [key]: value }))
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
            key: "pietonala",
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


    const filteredArticles = useMemo(() => {
        if (!articles) return []
        let selectedArticles = [...articles]
        if (searchArticle) {
            selectedArticles = selectedArticles.filter((article) =>
                article.text.toLowerCase().includes(searchArticle.toLowerCase()),
            )
        }
        if (categoryFilter !== "all") {
            selectedArticles = selectedArticles.filter((article) =>
                article.text.toLowerCase().includes(categoryFilter.toLowerCase()),
            )
        }

        selectedArticles = selectedArticles.filter((article) => {
            const price = article.price || 0
            return price >= priceRange[0] && price <= priceRange[1]
        })


        if (sortOrder === "asc") {
            selectedArticles.sort((a, b) => (a.price || 0) - (b.price || 0))
        } else if (sortOrder === "desc") {
            selectedArticles.sort((a, b) => (b.price || 0) - (a.price || 0))
        } else if (sortOrder === "name") {
            selectedArticles.sort((a, b) => a.text.localeCompare(b.text))
        }

        return selectedArticles
    }, [articles, searchArticle, sortOrder, categoryFilter, priceRange])

    const partialListOfArticles = useMemo(() => {
        return filteredArticles.slice(0, articlesIndex)
    }, [filteredArticles, articlesIndex])

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
                        <div className="toolbar-logo">
                            <div className="logo-icon">
                                <IonIcon icon={sparkles} />
                            </div>
                            <span className="logo-text">Confectii Metalice DN - Admin</span>
                        </div>

                        {/* Right Actions */}
                        <div className="toolbar-actions">
                            {/* Refresh Cache Button */}
                            <button className="action-button" onClick={handleRefresh} title="Reîmprospătează cache-ul">
                                <IonIcon icon={refreshOutline} />
                            </button>

                            {/* Add Product Button */}
                            <button
                                className="action-button with-text"
                                onClick={() => history.push("/article")}
                                style={{
                                    background: "linear-gradient(135deg, #22c55e, #16a34a)",
                                    color: "white",
                                    fontWeight: "600",
                                    boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
                                }}
                            >
                                <IonIcon icon={addOutline} />
                                <span>Adaugă Produs</span>
                            </button>

                            <MyModalAdmin />
                            <button className="mobile-menu-button" onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
                                <IonIcon icon={isFiltersOpen ? close : menu} />
                            </button>
                        </div>
                    </div>
                </IonToolbar>
            </IonHeader>

            {/* Rest of your component remains the same, but using the optimized state management */}
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
                                <h1 className="results-title">Confecții Metalice DN - Administrare</h1>
                                <p className="results-subtitle">
                                    {partialListOfArticles.length} produse găsite
                                    {categoryFilter !== "all" &&
                                        ` în categoria "${categories.find((c) => c.key === categoryFilter)?.label}"`}
                                </p>
                            </div>
                            <div className="results-actions">
                                <button
                                    className={`view-toggle-btn ${viewMode === "grid" ? "active" : ""}`}
                                    onClick={() => updateFilter("viewMode", "grid")}
                                >
                                    <IonIcon icon={gridOutline} />
                                </button>
                                <button
                                    className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
                                    onClick={() => updateFilter("viewMode", "list")}
                                >
                                    <IonIcon icon={listOutline} />
                                </button>
                            </div>
                        </div>

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
                                        onEdit={(id) => history.push(`/article/${id}`)}
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
                                <p>Încearcă să modifici filtrele sau să adaugi produse noi</p>
                                <button className="reset-filters-button" onClick={() => history.push("/article")}>
                                    Adaugă primul produs
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
        </IonPage>
    )
}

export default OptimizedArticleList
