"use client"

import type React from "react"
import { memo, useCallback, useContext, useEffect, useState } from "react"
import {
    IonActionSheet,
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonInput,
    IonLoading,
    IonPage,
    IonTextarea,
    IonToolbar,
} from "@ionic/react"
import type { RouteComponentProps } from "react-router"
import {
    sparkles,
    grid,
    menu,
    close,
    arrowBackOutline,
    saveOutline,
    trashOutline,
    cameraOutline,
    imageOutline,
    pricetagOutline,
    documentTextOutline,
    checkmarkCircleOutline,
    starOutline,
    layersOutline,
    locate,
    camera,
} from "ionicons/icons"
import { getLogger } from "../core"
import { ArticleContext } from "./ArticleProvider"
import type { IArticleProps } from "./ArticleProps"
import { usePhotos } from "../core/usePhotos"
import { deleteArticle } from "./articleApi"
import { AuthContext } from "../auth"
import { MyModal } from "../shared/components/MyModal"
import { logoInstagram, logoFacebook } from "ionicons/icons"
import "../shared/theme/enhanced-filters-styles.css"
import {MyModalAdmin} from "../shared/components/MyModalAdmin";
import "../shared/theme/article=edit-style.css"
import WhatsAppButton from "../shared/components/WhatsAppButton";
const log = getLogger("ArticleEdit")

interface IArticleEditProps extends RouteComponentProps<{ id?: string }> {}

const ArticleEdit: React.FC<IArticleEditProps> = ({ history, match }) => {
    const { articles, saving, savingError, saveArticle, refetchArticles } = useContext(ArticleContext)
    const { token } = useContext(AuthContext)

    const [text, setText] = useState("")
    const [price, setPrice] = useState<number | undefined>(undefined)
    const [option1, setOption1] = useState<number | undefined>(undefined)
    const [option2, setOption2] = useState<number | undefined>(undefined)
    const [option3, setOption3] = useState<number | undefined>(undefined)
    const [option4, setOption4] = useState<number | undefined>(undefined)
    const [option5, setOption5] = useState<number | undefined>(undefined)
    const [description, setDescription] = useState<string>("")
    const [article, setArticle] = useState<IArticleProps>()
    const [attachmentPanel, setAttachmentPanel] = useState(false)
    const [found, setFound] = useState<boolean>(true)
    const [isExtrasOpen, setIsExtrasOpen] = useState(false)
    const [isFiltersOpen, setIsFiltersOpen] = useState(false)

    const { currentPhoto, takePhoto } = usePhotos()

    const isEditMode = Boolean(match.params.id)

    useEffect(() => {
        log(`useEffect - ${match.params.id}`)
        const routeId = match.params.id || ""
        const foundArticle = articles?.find((article) => String(article._id) === String(routeId))

        if (foundArticle && isEditMode) {
            setArticle(foundArticle)
            setText(foundArticle.text)
            setPrice(foundArticle.price)
            setDescription(foundArticle.description || "")
            setOption1(foundArticle.option1)
            setOption2(foundArticle.option2)
            setOption3(foundArticle.option3)
            setOption4(foundArticle.option4)
            setOption5(foundArticle.option5)
            setFound(true)
        } else if (isEditMode) {
            setFound(false)
        } else {
            // Create mode - reset all fields
            setText("")
            setPrice(undefined)
            setDescription("")
            setOption1(undefined)
            setOption2(undefined)
            setOption3(undefined)
            setOption4(undefined)
            setOption5(undefined)
            setFound(true)
        }
    }, [match.params.id, articles, isEditMode])

    const handleSave = useCallback(() => {
        const editedArticle = article
            ? {
                ...article,
                text,
                price,
                description,
                option1,
                option2,
                option3,
                option4,
                option5,
                image: currentPhoto ? currentPhoto.webviewPath : article.image,
            }
            : {
                text,
                price,
                description,
                option1,
                option2,
                option3,
                option4,
                option5,
                image: currentPhoto?.webviewPath,
            }

        saveArticle && saveArticle(editedArticle).then(() => history.goBack())
    }, [
        article,
        text,
        price,
        description,
        option1,
        option2,
        option3,
        option4,
        option5,
        currentPhoto,
        saveArticle,
        history,
    ])

    const handleDelete = useCallback(() => {
        if (article && article._id) {
            if (token) {
                deleteArticle(token, article._id)
                    .then(() => {
                        console.log("Article deleted successfully")
                        if (refetchArticles) {
                            refetchArticles()
                        }
                        history.replace("/admin-dashboard")
                    })
                    .catch((error) => {
                        console.error("Error deleting article:", error)
                    })
            } else {
                console.error("Token is missing")
            }
        } else {
            console.error("Article ID is missing")
        }
    }, [article, token, history, refetchArticles])

    const isFormValid = text.trim() !== "" && price !== undefined && price > 0

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
                        <div className="toolbar-logo-admin-no-exapnd" onClick={() => history.push("/articles")}>
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
                            <span className="logo-text">{isEditMode ? "Editează Produs" : "Produs Nou"}</span>
                        </div>

                        {/* Right Actions */}
                        <div className="toolbar-actions">
                            {/* Save Button */}
                            <button
                                className="action-button with-text"
                                onClick={handleSave}
                                disabled={!isFormValid}
                                style={{
                                    background: isFormValid ? "linear-gradient(135deg, #22c55e, #16a34a)" : "rgba(100, 116, 139, 0.5)",
                                    color: "white",
                                    fontWeight: "600",
                                    boxShadow: isFormValid ? "0 4px 12px rgba(34, 197, 94, 0.3)" : "none",
                                }}
                            >
                                <IonIcon icon={saveOutline} />
                                <span>Salvează</span>
                            </button>

                            {/* Delete Button - only in edit mode */}
                            {isEditMode && (
                                <button
                                    className="action-button with-text"
                                    onClick={handleDelete}
                                    style={{
                                        background: "linear-gradient(135deg, #ef4444, #dc2626)",
                                        color: "white",
                                        fontWeight: "600",
                                        boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                                    }}
                                >
                                    <IonIcon icon={trashOutline} />
                                    <span>Șterge</span>
                                </button>
                            )}



                            <MyModalAdmin />
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
                    {/* Enhanced Sidebar */}
                    <div className={`enhanced-filters-sidebar ${isFiltersOpen ? "filters-open show" : ""}`}>
                        <div className="enhanced-filters-content">
                            {/* Header */}
                            <div className="enhanced-filters-header">
                                <div className="filters-title-section">
                                    <div className="filters-icon-wrapper">
                                        <IonIcon icon={documentTextOutline} />
                                    </div>
                                    <div className="filters-title-text">
                                        <h2>{isEditMode ? "Editare Produs" : "Produs Nou"}</h2>
                                        <p>Completează toate câmpurile obligatorii</p>
                                    </div>
                                </div>
                            </div>

                            {/* Image Preview */}
                            <div className="enhanced-filter-section">

                                <div
                                    className="div-image-article-edit"
                                >
                                    {currentPhoto || article?.image ? (
                                        <div style={{ position: "relative" }}>
                                            <img
                                                src={currentPhoto ? currentPhoto.webviewPath : article?.image}
                                                alt="Product preview"
                                                className="img-image-article-edit"
                                            />
                                            <button
                                                onClick={() => takePhoto()}
                                                className="image-preview-btn"
                                            >
                                                <IonIcon icon={cameraOutline} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => takePhoto()}
                                            className="add-image-card"
                                        >
                                            <IonIcon icon={cameraOutline} style={{ fontSize: "3rem", color: "#64748b" }} />
                                            <span style={{ color: "#64748b", fontWeight: "500" }}>Adaugă imagine</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="enhanced-filter-section">

                                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                    <button
                                        className="apply-filters-btn"
                                        onClick={() => takePhoto()}
                                        style={{
                                            background: "linear-gradient(135deg, #3b82f6, #1e40af)",
                                        }}
                                    >
                                        <IonIcon icon={cameraOutline} />
                                        <span>Fă o poză</span>
                                    </button>
                                    <button
                                        className="apply-filters-btn"
                                        onClick={() => history.goBack()}
                                        style={{
                                            background: "linear-gradient(135deg, #64748b, #475569)",
                                        }}
                                    >
                                        <IonIcon icon={arrowBackOutline} />
                                        <span>Anulează</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="articles-main">
                        {/* Form Header */}
                        <div className="results-header">
                            <div className="results-info">
                                <h1 className="results-title">{isEditMode ? `Editează: ${text || "Produs"}` : "Creează Produs Nou"}</h1>
                                <p className="results-subtitle">
                                    {isEditMode ? "Modifică informațiile produsului" : "Completează detaliile pentru noul produs"}
                                </p>
                            </div>
                        </div>

                        {/* Loading */}
                        <IonLoading isOpen={saving} message="Se salvează produsul..." />

                        {/* Form Content */}
                        <div className="articles-grid" style={{ gridTemplateColumns: "1fr", gap: "2rem" }}>
                            {/* Basic Information Card */}
                            <div className="article-card">
                                <div className="article-content">
                                    <div className="article-header">
                                        <h3 className="article-title">
                                            <IonIcon icon={documentTextOutline} style={{ marginRight: "0.5rem" }} />
                                            Informații de bază
                                        </h3>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "1rem" }}>
                                        {/* Title */}
                                        <div>
                                            <label className="label-title-options-article-edit">
                                                Nume produs *
                                            </label>
                                            <IonInput
                                                value={text}
                                                onIonChange={(e: any) => setText(e.detail.value || "")}
                                                placeholder="Ex: Poartă auto premium"
                                                                                                className="input-options-article-edit"

                                            />
                                        </div>

                                        {/* Price */}
                                        <div>
                                            <label
                                                className="label-price-options-article-edit"
                                                
                                            >
                                                Preț pe m² (RON) *
                                            </label>
                                            <IonInput
                                                type="number"
                                                value={price !== undefined && price !== null ? price.toString() : ""}
                                                onIonChange={(e: any) => {
                                                    const val = e.detail.value
                                                    setPrice(val && val !== "" ? Number.parseFloat(val) : undefined)
                                                }}
                                                placeholder="Ex: 250"
                                                                                                className="input-options-article-edit"

                                            />
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label
                                                className="label-price-options-article-edit"
                                            >
                                                Descriere produs
                                            </label>
                                            <IonTextarea
                                                value={description}
                                                onIonChange={(e: any) => setDescription(e.detail.value || "")}
                                                placeholder="Descriere detaliată a produsului..."
                                                rows={4}
                                                                                                className="input-options-article-edit"

                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Options Card */}
                            <div className="article-card">
                                <div className="article-content">
                                    <div className="article-header">
                                        <h3 className="article-title">
                                            <IonIcon icon={pricetagOutline} style={{ marginRight: "0.5rem" }} />
                                            Opțiuni suplimentare
                                        </h3>

                                    </div>

                                    <div
                                        className="div-price-options-article-edit"
                                    >
                                        {/* Option 1 */}
                                        <div>
                                            <label
                                                className="label-price-options-article-edit"
                                            >
                                                Automatizare
                                            </label>
                                            <IonInput
                                                type="number"
                                                value={option1 !== undefined && option1 !== null ? option1.toString() : ""}
                                                onIonChange={(e: any) => {
                                                    const val = e.detail.value
                                                    setOption1(isNaN(Number.parseFloat(val)) ? undefined : Number.parseFloat(val))
                                                }}
                                                placeholder="Ex: 50"
                                                                                                className="input-options-article-edit"

                                            />
                                        </div>

                                        {/* Option 2 */}
                                        <div>
                                            <label
                                                className="label-price-options-article-edit"
                                            >
                                                Poartă Culisantă
                                            </label>
                                            <IonInput
                                                type="number"
                                                value={option2 !== undefined && option2 !== null ? option2.toString() : ""}
                                                onIonChange={(e: any) => {
                                                    const val = e.detail.value
                                                    setOption2(isNaN(Number.parseFloat(val)) ? undefined : Number.parseFloat(val))
                                                }}
                                                placeholder="Ex: 75"
                                                                                                className="input-options-article-edit"

                                            />
                                        </div>

                                        {/* Option 3 */}
                                        <div>
                                            <label
                                                className="label-price-options-article-edit"
                                            >
                                                Electroyală + Interfon
                                            </label>
                                            <IonInput
                                                type="number"
                                                value={option3 !== undefined && option3 !== null ? option3.toString() : ""}
                                                onIonChange={(e: any) => {
                                                    const val = e.detail.value
                                                    setOption3(isNaN(Number.parseFloat(val)) ? undefined : Number.parseFloat(val))
                                                }}
                                                placeholder="Ex: 100"
                                                                                                className="input-options-article-edit"

                                            />
                                        </div>

                                        {/* Option 4 */}
                                        <div>
                                            <label
                                                className="label-price-options-article-edit"
                                            >
                                                Sistem iluminare LED
                                            </label>
                                            <IonInput
                                                type="number"
                                                value={option4 !== undefined && option4 !== null ? option4.toString() : ""}
                                                onIonChange={(e: any) => {
                                                    const val = e.detail.value
                                                    setOption4(isNaN(Number.parseFloat(val)) ? undefined : Number.parseFloat(val))
                                                }}
                                                placeholder="Ex: 125"
                                                                                                className="input-options-article-edit"

                                            />
                                        </div>

                                        {/* Option 5 */}
                                        <div>
                                            <label
                                                className="label-price-options-article-edit"
                                            >
                                                Acces Remote
                                            </label>
                                            <IonInput
                                                type="number"
                                                value={option5 !== undefined && option5 !== null ? option5.toString() : ""}
                                                onIonChange={(e: any) => {
                                                    const val = e.detail.value
                                                    setOption5(isNaN(Number.parseFloat(val)) ? undefined : Number.parseFloat(val))
                                                }}
                                                placeholder="Ex: 150"
                                                                                                className="input-options-article-edit"

                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Error Message */}
                            {savingError && (
                                <div className="article-card" style={{ background: "linear-gradient(135deg, #fef2f2, #fee2e2)" }}>
                                    <div className="article-content">
                                        <div style={{ color: "#dc2626", fontWeight: "600" }}>
                                            Eroare: {savingError.message || "Nu s-a putut salva produsul"}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Form Validation Info */}
                            {!isFormValid && (
                                <div className="article-card" style={{ background: "linear-gradient(135deg, #fffbeb, #fef3c7)" }}>
                                    <div className="article-content">
                                        <div style={{ color: "#d97706", fontWeight: "600" }}>
                                            <IonIcon icon={documentTextOutline} style={{ marginRight: "0.5rem" }} />
                                            Completează câmpurile obligatorii: nume produs și preț
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Sheet for Camera */}
                <IonActionSheet
                    isOpen={attachmentPanel}
                    buttons={[
                        {
                            text: "Fă o poză",
                            role: "select",
                            icon: camera,
                            handler: () => takePhoto(),
                        },
                        {
                            text: "Anulează",
                            icon: close,
                            role: "cancel",
                        },
                    ]}
                    onDidDismiss={() => setAttachmentPanel(false)}
                />

                {/* Floating Action Button for Camera */}

            </IonContent>

            {/* Filters Overlay */}
            {isFiltersOpen && (
                <div className={`filters-overlay ${isFiltersOpen ? "show" : ""}`} onClick={() => setIsFiltersOpen(false)}></div>
            )}

        </IonPage>
    )
}

export default memo(ArticleEdit)
