"use client"

import type React from "react"
import { memo } from "react"
import { IonIcon } from "@ionic/react"
import { pricetagOutline, checkmarkCircle, closeCircle, eyeOutline } from "ionicons/icons"
import type { IArticleProps } from "./ArticleProps"
import "../shared/theme/enhanced-filters-styles.css"
interface IArticlePropsExt extends IArticleProps {
    onEdit: (_id?: string) => void
    price?: number
    description?: string
}

const Article: React.FC<IArticlePropsExt> = ({ _id, text, isUseful, onEdit, image = "", price }) => {
    return (
        <div className="article-card-wrapper" onClick={() => onEdit(_id)}>
            <div className="article-card">
                {/* Image Section */}
                <div className="article-image-container">
                    {image ? (
                        <img src={image || "/placeholder.svg"} alt={text} className="article-image" />
                    ) : (
                        <div className="article-image-placeholder">
                            <IonIcon icon={pricetagOutline} />
                        </div>
                    )}


                    {/* Status Badge */}
                    <div className={`article-status-badge ${isUseful ? "status-available" : "status-unavailable"}`}>
                        <IonIcon icon={isUseful ? checkmarkCircle : closeCircle} />
                    </div>

                    {/* Hover Overlay */}
                    <div className="article-hover-overlay">
                        <div className="hover-content">
                            <IonIcon icon={eyeOutline} />
                            <span>Vezi Detalii</span>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="article-content">
                    <div className="article-header">
                        <h3 className="article-title">{text}</h3>
                    </div>

                    <div className="article-footer">
                        <div className="article-price">
                            <IonIcon icon={pricetagOutline} />
                            <span className="price-value">RON {price !== undefined && !isNaN(price) ? price.toFixed(2) : "N/A"}</span>
                        </div>
                        <button className="article-view-button">
                            <span>Vezi Detalii</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(Article)
