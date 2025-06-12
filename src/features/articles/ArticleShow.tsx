"use client"

import type React from "react"
import { useContext, useEffect, useState } from "react"
import { IonContent, IonHeader, IonPage, IonToolbar, IonIcon, IonFooter } from "@ionic/react"
import {
    arrowBackOutline,
    sparkles,
    locate,
    logoInstagram,
    logoFacebook,
    cartOutline,
    starOutline,
    chatbubblesOutline,
    imageOutline,
    searchOutline,
    checkmarkCircleOutline,
    shieldCheckmarkOutline,
    timeOutline,
    constructOutline,
    heartOutline,
    shareOutline,
    eyeOutline,
    pricetagOutline, menu, close, layersOutline, grid,
} from "ionicons/icons"
import { getLogger } from "../core"
import { ArticleContext } from "./ArticleProvider"
import type { RouteComponentProps } from "react-router"
import type { IArticleProps } from "./ArticleProps"
import { AuthContext } from "../auth"
import { MyModal } from "../shared/components/MyModal"
import "../shared/theme/article-show-css.css"
import "../shared/theme/enhanced-filters-styles.css"
import WhatsAppButton from "../shared/components/WhatsAppButton";
const log = getLogger("ArticleShow")

interface IArticleShowProps extends RouteComponentProps<{ id?: string }> {}

const ArticleShow: React.FC<IArticleShowProps> = ({ history, match }) => {
    const { token } = useContext(AuthContext)
    const [sortField, setSortField] = useState<"time" | "score">("time")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
    const { articles } = useContext(ArticleContext)
    const [reviews, setReviews] = useState<any[]>([])
    const [article, setArticle] = useState<IArticleProps | undefined>()
    const [found, setFound] = useState<boolean>(true)
    const [isFavorite, setIsFavorite] = useState<boolean>(false)
    const [isExtrasOpen, setIsExtrasOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const handlePreview = () => setIsImageModalOpen(true);

    const fetchReviews = async () => {
        if (!article?._id) return

        try {
            const res = await fetch(
                `http://192.168.1.149:3000/api/reviews/gate/${article._id}?sortField=${sortField}&sortOrder=${sortOrder}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )

            const data = await res.json()
            if (Array.isArray(data.reviews)) {
                setReviews(data.reviews)
            } else {
                setReviews([])
                console.error("Reviewurile nu sunt un array:", data)
            }
        } catch (error) {
            console.error("Eroare la încărcarea review-urilor:", error)
            setReviews([])
        }
    }

    useEffect(() => {
        const routeId = match.params.id || ""
        const foundArticle = articles?.find((article) => String(article._id) === String(routeId))

        if (foundArticle) {
            setArticle(foundArticle)
            setFound(true)
        } else {
            setFound(false)
        }
    }, [match.params.id, articles])

    useEffect(() => {
        if (article?._id) {
            fetchReviews()
        }
    }, [article?._id, sortField, sortOrder])

    const handleAddToCart = () => {
        if (article) {
            history.push(`/order-create/${article._id}`)
        }
    }

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite)
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: article?.text,
                text: `Verifică acest produs: ${article?.text}`,
                url: window.location.href,
            })
        }
    }

    log("render")

    return (
        <IonPage className="modern-product-page">
            {/* Modern Header */}
            <IonHeader className="modern-product-header">
                <IonToolbar className="articles-toolbar">
                    <div className="modern-toolbar-content">

                        <button className="modern-back-btn" onClick={() => history.goBack()}>
                            <IonIcon icon={arrowBackOutline} />
                            <span>Înapoi</span>
                        </button>
                        {/* Logo */}


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
                            {/* Cart Button */}
                            <button className="action-button" onClick={() => history.push("/cart")}>
                                <IonIcon icon={cartOutline}/>
                            </button>

                            {/* Settings Modal */}
                            <MyModal />

                        </div>


                    </div>
                </IonToolbar>
            </IonHeader>
            {isExtrasOpen && (
                <>
                    {/* Background transparent overlay to close on outside click */}
                    <div
                        className="extras-backdrop"
                        onClick={() => setIsExtrasOpen(false)}
                    ></div>
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
            <IonContent className="modern-product-content">
                {article && found ? (
                    <div className="modern-product-container">
                        {/* Hero Section */}
                        <section className="product-hero-section">
                            <div className="product-hero-grid">
                                {/* Image Side */}
                                <div className="product-image-side">
                                    <div className="product-image-wrapper">
                                        {article.image ? (
                                            <img
                                                src={article.image || "/placeholder.svg"}
                                                alt={article.text}
                                                className="product-hero-image"
                                            />
                                        ) : (
                                            <div className="product-image-empty">
                                                <IonIcon icon={imageOutline} />
                                                <span>Fără imagine</span>
                                            </div>
                                        )}

                                        {/* Image Overlay Actions */}
                                        <div className="image-overlay-actions">
                                            <button className="overlay-action-btn" onClick={handleShare}>
                                                <IonIcon icon={shareOutline} />
                                            </button>
                                            <button className="overlay-action-btn" onClick={handlePreview}>
                                                <IonIcon icon={eyeOutline} />
                                            </button>

                                        </div>


                                    </div>
                                </div>
                                {isImageModalOpen && (
                                    <div className="image-modal-backdrop" onClick={() => setIsImageModalOpen(false)}>
                                        <div className="image-modal-content" onClick={e => e.stopPropagation()}>
                                            <img
                                                src={article.image || "/placeholder.svg"}
                                                alt={article.text}
                                            />
                                            <button className="close-modal-btn" onClick={() => setIsImageModalOpen(false)}>
                                                &times;
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Info Side */}
                                <div className="product-info-side">
                                    <div className="product-info-content">
                                        {/* Product Header */}
                                        <div className="product-info-header">
                                            <h1 className="product-hero-title">{article.text}</h1>

                                            <div className="product-price-section">
                                                <div className="price-main">
                                                    <IonIcon icon={pricetagOutline} />
                                                    <span className="price-amount">{article.price}</span>
                                                    <span className="price-currency">RON m²</span>
                                                </div>
                                                <p className="price-note">Preț final, TVA inclus</p>
                                            </div>
                                        </div>

                                        {/* Product Description */}
                                        <div className="product-description-card">
                                            <h3>Descriere produs</h3>
                                            <p>
                                                {article.description ||
                                                    "Acest produs este realizat din materiale de înaltă calitate, cu atenție la detalii și finisaje premium. Fiecare piesă este fabricată manual de meșterii noștri cu experiență îndelungată în domeniul confecțiilor metalice."}
                                            </p>
                                        </div>

                                        {/* Product Benefits */}
                                        <div className="product-benefits">
                                            <h3>Beneficii incluse</h3>
                                            <div className="benefits-grid">
                                                <div className="benefit-item">
                                                    <IonIcon icon={shieldCheckmarkOutline} />
                                                    <span>Garanție 10 ani</span>
                                                </div>
                                                <div className="benefit-item">
                                                    <IonIcon icon={constructOutline} />
                                                    <span>Montaj rapid</span>
                                                </div>
                                                <div className="benefit-item">
                                                    <IonIcon icon={checkmarkCircleOutline} />
                                                    <span>Calitate premium</span>
                                                </div>
                                                <div className="benefit-item">
                                                    <IonIcon icon={timeOutline} />
                                                    <span>Livrare rapidă</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Product Options */}
                                        {(article.option1 || article.option2 || article.option3 || article.option4 || article.option5) && (
                                            <div className="product-options-card">
                                                <h3>Opțiuni disponibile</h3>
                                                <div className="options-grid">
                                                    {article.option1 && (
                                                        <div className="option-item">
                                                            <span className="option-label">Automatizare poartă</span>
                                                            <span className="option-price">{article.option1} RON</span>
                                                        </div>
                                                    )}
                                                    {article.option2 && (
                                                        <div className="option-item">
                                                            <span className="option-label">Poartă Culisantă (Role + Șină)</span>
                                                            <span className="option-price">{article.option2} RON</span>
                                                        </div>
                                                    )}
                                                    {article.option3 && (
                                                        <div className="option-item">
                                                            <span className="option-label">Electroyală + Interfon</span>
                                                            <span className="option-price">{article.option3} RON</span>
                                                        </div>
                                                    )}
                                                    {article.option4 && (
                                                        <div className="option-item">
                                                            <span className="option-label">Sistem iluminare LED</span>
                                                            <span className="option-price">{article.option4} RON</span>
                                                        </div>
                                                    )}
                                                    {article.option5 && (
                                                        <div className="option-item">
                                                            <span className="option-label">Acces Remote/Smart pentru automatizare</span>
                                                            <span className="option-price">{article.option5} RON</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* CTA Button */}
                                        <button className="product-cta-button" onClick={handleAddToCart}>
                                            <IonIcon icon={cartOutline} />
                                            <span>Comandă acum</span>
                                            <div className="button-shine"></div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Reviews Section */}
                        <section className="reviews-section">
                            <div className="reviews-container">
                                <div className="reviews-header">
                                    <div className="reviews-title-section">
                                        <h2>Recenzii clienți</h2>
                                        <span className="reviews-count">({reviews.length} recenzii)</span>
                                    </div>

                                    <div className="reviews-controls">
                                        <label className="sort-label">Sortează:</label>
                                        <select
                                            className="sort-select"
                                            value={`${sortField}-${sortOrder}`}
                                            onChange={(e) => {
                                                const [field, order] = e.target.value.split("-")
                                                setSortField(field as "time" | "score")
                                                setSortOrder(order as "asc" | "desc")
                                            }}
                                        >
                                            <option value="time-desc">Cele mai recente</option>
                                            <option value="time-asc">Cele mai vechi</option>
                                            <option value="score-desc">Scor mare</option>
                                            <option value="score-asc">Scor mic</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="reviews-content">
                                    {reviews.length === 0 ? (
                                        <div className="no-reviews-state">
                                            <div className="no-reviews-icon">
                                                <IonIcon icon={chatbubblesOutline} />
                                            </div>
                                            <h3>Încă nu există recenzii</h3>
                                            <p>Fii primul care lasă o recenzie pentru acest produs!</p>
                                        </div>
                                    ) : (
                                        <div className="reviews-grid">
                                            {reviews.map((review) => (
                                                <div key={review.id} className="review-card">
                                                    <div className="review-card-header">
                                                        <div className="review-stars">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <IonIcon
                                                                    key={star}
                                                                    icon={starOutline}
                                                                    className={star <= review.score ? "star-filled" : "star-empty"}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="review-date">{new Date(review.time).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="review-content">
                                                        <p>{review.text}</p>
                                                    </div>
                                                    <div className="review-score">
                                                        <span>Scor: {review.score}/5</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                ) : (
                    <div className="product-not-found">
                        <div className="not-found-content">
                            <div className="not-found-icon">
                                <IonIcon icon={searchOutline} />
                            </div>
                            <h2>Produs negăsit</h2>
                            <p>Ne pare rău, produsul pe care îl căutați nu a fost găsit în catalogul nostru.</p>
                            <button className="back-to-catalog-btn" onClick={() => history.push("/articlesClient")}>
                                Înapoi la catalog
                            </button>
                        </div>
                    </div>
                )}
            </IonContent>


            <WhatsAppButton />
        </IonPage>
    )
}

export default ArticleShow
