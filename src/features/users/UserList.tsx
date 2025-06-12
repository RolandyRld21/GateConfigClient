"use client"

import type React from "react"
import { useContext, useEffect, useState } from "react"
import { IonContent, IonHeader, IonIcon, IonLoading, IonPage, IonToast, IonToolbar } from "@ionic/react"
import {
    sparkles,
    grid,
    menu,
    close,
    arrowBackOutline,
    peopleOutline,
    checkmarkCircleOutline,
    trashOutline,
    filterOutline,
    swapVerticalOutline,
    personOutline,
    mailOutline,
    starOutline,
    layersOutline,
    locate,
    statsChartOutline,
    alertCircleOutline,
    checkmarkOutline,
} from "ionicons/icons"
import { AuthContext } from "../auth"
import { getAllUsers, safeDeleteUser, type IUser } from "./UserApi"
import { MyModal } from "../shared/components/MyModal"
import { logoInstagram, logoFacebook } from "ionicons/icons"
import "../shared/theme/enhanced-filters-styles.css"
import "../shared/theme/article=edit-style.css"

const UserListAdmin: React.FC<{ history: any }> = ({ history }) => {
    const { token } = useContext(AuthContext)
    const [users, setUsers] = useState<IUser[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState("")
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState("")
    const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false)
    const [isExtrasOpen, setIsExtrasOpen] = useState(false)
    const [filter, setFilter] = useState<"all" | "active" | "deleted">("all")
    const [sortByEmail, setSortByEmail] = useState<"asc" | "desc" | "none">("none")

    const filteredUsers = users.filter((user) => {
        if (filter === "all") return true
        if (filter === "active") return !user.is_deleted
        if (filter === "deleted") return user.is_deleted
        return true
    })

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (sortByEmail === "asc") {
            return a.email.localeCompare(b.email)
        }
        if (sortByEmail === "desc") {
            return b.email.localeCompare(a.email)
        }
        return 0
    })

    useEffect(() => {
        if (token) {
            setLoading(true)
            getAllUsers(token)
                .then((data) => {
                    setUsers(data)
                    setError("")
                })
                .catch((err) => {
                    setError(err.message || "Eroare la încărcarea utilizatorilor")
                })
                .finally(() => setLoading(false))
        }
    }, [token])

    const handleDelete = async (email: string) => {
        if (!token) return

        try {
            await safeDeleteUser(token, email)
            setUsers((prev) => prev.map((u) => (u.email === email ? { ...u, is_deleted: true } : u)))
            setToastMessage("Utilizator șters cu succes")
            setShowToast(true)
        } catch (e: any) {
            setError(e.message || "Eroare la ștergerea utilizatorului")
            setToastMessage("Eroare la ștergerea utilizatorului")
            setShowToast(true)
        }
    }

    const getStats = () => {
        const total = users.length
        const active = users.filter((u) => !u.is_deleted).length
        const deleted = users.filter((u) => u.is_deleted).length

        return { total, active, deleted }
    }

    const stats = getStats()

    const filterOptions = [
        { value: "all", label: "Toți utilizatorii", icon: peopleOutline, color: "#64748b" },
        { value: "active", label: "Utilizatori activi", icon: checkmarkCircleOutline, color: "#22c55e" },
        { value: "deleted", label: "Utilizatori șterși", icon: trashOutline, color: "#ef4444" },
    ]

    const sortOptions = [
        { value: "none", label: "Fără sortare", icon: swapVerticalOutline },
        { value: "asc", label: "Email A-Z", icon: swapVerticalOutline },
        { value: "desc", label: "Email Z-A", icon: swapVerticalOutline },
    ]

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
                        {/* Logo with Back Button */}
                        <div className="toolbar-logo">
                            <button
                                className="action-button"
                                onClick={() => history.goBack()}
                                style={{
                                    background: "rgba(255, 255, 255, 0.2)",
                                    color: "white",
                                    marginRight: "1rem",
                                }}
                            >
                                <IonIcon icon={arrowBackOutline} />
                            </button>
                            <div className="logo-icon">
                                <IonIcon icon={sparkles} />
                            </div>
                            <span className="logo-text">Administrare Utilizatori</span>
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

                            {/* Settings Modal */}
                            <button className="action-button" onClick={() => setIsExtrasOpen(!isExtrasOpen)}>
                                <IonIcon icon={grid} />
                            </button>

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
                                        <IonIcon icon={statsChartOutline} />
                                    </div>
                                    <div className="filters-title-text">
                                        <h2>Statistici Utilizatori</h2>
                                        <p>{sortedUsers.length} utilizatori găsiți</p>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Section */}
                            <div className="enhanced-filter-section">
                                <div className="section-header">
                                    <h3 className="section-title">
                                        <IonIcon icon={statsChartOutline} />
                                        Statistici
                                    </h3>
                                </div>
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(3, 1fr)",
                                        gap: "0.75rem",
                                        padding: "0.5rem 0",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                            padding: "1rem 0.5rem",
                                            background: "rgba(255, 255, 255, 0.8)",
                                            borderRadius: "1rem",
                                            border: "1px solid rgba(0, 0, 0, 0.1)",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "2rem",
                                                height: "2rem",
                                                background: "#64748b",
                                                borderRadius: "0.75rem",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "white",
                                            }}
                                        >
                                            <IonIcon icon={peopleOutline} style={{ fontSize: "1rem" }} />
                                        </div>
                                        <span
                                            style={{
                                                fontSize: "1.25rem",
                                                fontWeight: "700",
                                                color: "#000",
                                                lineHeight: "1",
                                            }}
                                        >
                      {stats.total}
                    </span>
                                        <span
                                            style={{
                                                fontSize: "0.75rem",
                                                color: "#606060",
                                                textAlign: "center",
                                                lineHeight: "1.2",
                                            }}
                                        >
                      Total
                    </span>
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                            padding: "1rem 0.5rem",
                                            background: "rgba(255, 255, 255, 0.8)",
                                            borderRadius: "1rem",
                                            border: "1px solid rgba(0, 0, 0, 0.1)",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "2rem",
                                                height: "2rem",
                                                background: "#22c55e",
                                                borderRadius: "0.75rem",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "white",
                                            }}
                                        >
                                            <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: "1rem" }} />
                                        </div>
                                        <span
                                            style={{
                                                fontSize: "1.25rem",
                                                fontWeight: "700",
                                                color: "#000",
                                                lineHeight: "1",
                                            }}
                                        >
                      {stats.active}
                    </span>
                                        <span
                                            style={{
                                                fontSize: "0.75rem",
                                                color: "#606060",
                                                textAlign: "center",
                                                lineHeight: "1.2",
                                            }}
                                        >
                      Activi
                    </span>
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                            padding: "1rem 0.5rem",
                                            background: "rgba(255, 255, 255, 0.8)",
                                            borderRadius: "1rem",
                                            border: "1px solid rgba(0, 0, 0, 0.1)",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "2rem",
                                                height: "2rem",
                                                background: "#ef4444",
                                                borderRadius: "0.75rem",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "white",
                                            }}
                                        >
                                            <IonIcon icon={trashOutline} style={{ fontSize: "1rem" }} />
                                        </div>
                                        <span
                                            style={{
                                                fontSize: "1.25rem",
                                                fontWeight: "700",
                                                color: "#000",
                                                lineHeight: "1",
                                            }}
                                        >
                      {stats.deleted}
                    </span>
                                        <span
                                            style={{
                                                fontSize: "0.75rem",
                                                color: "#606060",
                                                textAlign: "center",
                                                lineHeight: "1.2",
                                            }}
                                        >
                      Șterși
                    </span>
                                    </div>
                                </div>
                            </div>

                            {/* Filter Section */}
                            <div className="enhanced-filter-section">
                                <div className="section-header">
                                    <h3 className="section-title">
                                        <IonIcon icon={filterOutline} />
                                        Filtrează utilizatori
                                    </h3>
                                </div>
                                <div className="enhanced-category-grid">
                                    {filterOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            className={`enhanced-category-card ${filter === option.value ? "active" : ""}`}
                                            onClick={() => setFilter(option.value as "all" | "active" | "deleted")}
                                        >
                                            <div className="category-card-icon" style={{ background: option.color }}>
                                                <IonIcon icon={option.icon} />
                                            </div>
                                            <div className="category-card-content">
                                                <span className="category-card-label">{option.label}</span>
                                            </div>
                                            {filter === option.value && (
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
                                            className={`enhanced-sort-option ${sortByEmail === option.value ? "active" : ""}`}
                                            onClick={() => setSortByEmail(option.value as "asc" | "desc" | "none")}
                                        >
                                            <div className="sort-option-icon">
                                                <IonIcon icon={option.icon} />
                                            </div>
                                            <span className="sort-option-label">{option.label}</span>
                                            {sortByEmail === option.value && (
                                                <div className="sort-option-check">
                                                    <IonIcon icon={checkmarkOutline} />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Apply Filters Button */}
                            <div className="filters-apply-section">
                                <button className="apply-filters-btn" onClick={() => setIsFiltersOpen(false)}>
                                    <IonIcon icon={checkmarkOutline} />
                                    <span>Aplică Filtrele ({sortedUsers.length} utilizatori)</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="articles-main">
                        {/* Results Header */}
                        <div className="results-header">
                            <div className="results-info">
                                <h1 className="results-title">Administrare Utilizatori</h1>
                                <p className="results-subtitle">
                                    {sortedUsers.length} utilizatori găsiți
                                    {filter !== "all" && ` (${filterOptions.find((f) => f.value === filter)?.label})`}
                                </p>
                            </div>
                        </div>

                        {/* Loading */}
                        <IonLoading isOpen={loading} message="Se încarcă utilizatorii..." />

                        {/* Error Message */}
                        {error && (
                            <div className="article-card" style={{ background: "linear-gradient(135deg, #fef2f2, #fee2e2)" }}>
                                <div className="article-content">
                                    <div
                                        style={{
                                            color: "#dc2626",
                                            fontWeight: "600",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                        }}
                                    >
                                        <IonIcon icon={alertCircleOutline} />
                                        <span>{error}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Users Grid */}
                        {sortedUsers.length > 0 ? (
                            <div className="articles-grid grid-view">
                                {sortedUsers.map((user) => (
                                    <div key={user.email} className="article-card-wrapper">
                                        <div className="article-card">
                                            {/* Status Badge */}
                                            <div
                                                className="article-status-badge"
                                                style={{
                                                    background: user.is_deleted
                                                        ? "linear-gradient(135deg, #ef4444, #dc2626)"
                                                        : "linear-gradient(135deg, #22c55e, #16a34a)",
                                                    color: "white",
                                                }}
                                            >
                                                <IonIcon icon={user.is_deleted ? trashOutline : checkmarkCircleOutline} />
                                                <span>{user.is_deleted ? "Șters" : "Activ"}</span>
                                            </div>

                                            <div className="article-content">
                                                {/* User Header */}
                                                <div className="article-header">
                                                    <h3 className="article-title">
                                                        <IonIcon icon={personOutline} style={{ marginRight: "0.5rem" }} />
                                                        {user.username}
                                                    </h3>
                                                </div>

                                                {/* User Details */}
                                                <div style={{ margin: "1rem 0", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                                    {/* Email */}
                                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                        <div
                                                            style={{
                                                                width: "2rem",
                                                                height: "2rem",
                                                                background: "linear-gradient(135deg, #3b82f6, #1e40af)",
                                                                borderRadius: "0.5rem",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                color: "white",
                                                            }}
                                                        >
                                                            <IonIcon icon={mailOutline} style={{ fontSize: "1rem" }} />
                                                        </div>
                                                        <div>
                                                            <span style={{ fontWeight: "600", color: "#000" }}>Email:</span>
                                                            <span style={{ marginLeft: "0.5rem", color: "#606060" }}>{user.email}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="article-footer">
                                                    {user.is_deleted ? (
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "0.5rem",
                                                                color: "#64748b",
                                                                fontWeight: "600",
                                                            }}
                                                        >
                                                            <IonIcon icon={alertCircleOutline} />
                                                            <span>Utilizator șters</span>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            className="article-view-button"
                                                            onClick={() => handleDelete(user.email)}
                                                            style={{
                                                                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                gap: "0.5rem",
                                                            }}
                                                        >
                                                            <IonIcon icon={trashOutline} />
                                                            <span>Șterge Utilizator</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="empty-state">
                                <div className="empty-icon">
                                    <IonIcon icon={peopleOutline} />
                                </div>
                                <h3>Nu am găsit utilizatori</h3>
                                <p>Încearcă să modifici filtrele pentru a vedea mai mulți utilizatori</p>
                                <button className="reset-filters-button" onClick={() => setFilter("all")}>
                                    Resetează filtrele
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Toast */}
                <IonToast
                    isOpen={showToast}
                    message={toastMessage}
                    duration={3000}
                    onDidDismiss={() => setShowToast(false)}
                    color={error ? "danger" : "success"}
                />
            </IonContent>

            {/* Filters Overlay */}
            {isFiltersOpen && (
                <div className={`filters-overlay ${isFiltersOpen ? "show" : ""}`} onClick={() => setIsFiltersOpen(false)}></div>
            )}
        </IonPage>
    )
}

export default UserListAdmin
