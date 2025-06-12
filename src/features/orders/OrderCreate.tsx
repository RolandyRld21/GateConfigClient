"use client"

import type React from "react"
import { useContext, useEffect, useState } from "react"
import {
    IonPage,
    IonHeader,
    IonContent,
    IonInput,
    IonButton,
    IonCheckbox,
    IonLoading,
    IonIcon,
    IonToolbar
} from "@ionic/react"
import type { RouteComponentProps } from "react-router"
import { getGateById } from "../articles/articleApi"
import { createOrder } from "./orderApi"
import { AuthContext } from "../auth"
import type { IArticleProps } from "../articles/ArticleProps"
import "../shared/theme/order-create-styles.css"
import { ArticleListClientToolbar } from "../articles/ArticleListClientToolbar"

import {
    resizeOutline,
    colorPaletteOutline,
    optionsOutline,
    calculatorOutline,
    cartOutline,
    arrowBackOutline, sparkles, starOutline, layersOutline, grid, logoInstagram, logoFacebook, locate
} from "ionicons/icons"
import {MyModal} from "../shared/components/MyModal";
import "../shared/theme/enhanced-filters-styles.css"
import WhatsAppButton from "../shared/components/WhatsAppButton";
const OrderCreate: React.FC<RouteComponentProps<{ id: string }>> = ({ match, history }) => {
    const { token } = useContext(AuthContext)
    const [gate, setGate] = useState<IArticleProps | null>(null)
    const [width, setWidth] = useState<number>(1)
    const [height, setHeight] = useState<number>(1)
    const [color, setColor] = useState<string>("#000000")
    const [options, setOptions] = useState<boolean[]>([false, false, false, false, false])
    const [loading, setLoading] = useState<boolean>(true)
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [totalPrice, setTotalPrice] = useState<number>(0)
    const [isExtrasOpen, setIsExtrasOpen] = useState(false);
    const text = gate?.text?.toLowerCase() || "";
    const visibleOptionIndices = text.includes("auto")
        ? [0, 1, 2, 3, 4]
        : text.includes("pieton")
            ? [2, 3]
            : text.includes("gard") || text.includes("balustr")
                ? [3]
                : [];

    const optionList = [
        {
            key: "option1",
            name: "Automatizare poartă",
            desc: "Sistem motorizat cu telecomandă pentru deschiderea automată a porții."
        },
        {
            key: "option2",
            name: "Poartă Culisantă (Role + Șină)",
            desc: "Transformă poarta batantă în poartă culisantă cu șină și role."
        },
        {
            key: "option3",
            name: "Electroyală + Interfon",
            desc: "Acces securizat cu interfon și încuietoare electrică."
        },
        {
            key: "option4",
            name: "Sistem iluminare LED",
            desc: "Iluminare ambientală pentru vizibilitate și design modern."
        },
        {
            key: "option5",
            name: "Acces Remote/Smart pentru automatizare",
            desc: "Control poartă prin aplicație mobilă, Google Home, RFID sau amprentă."
        }
    ];

    useEffect(() => {
        const fetchGate = async () => {
            const idParam = match.params.id
            if (!idParam) return
            setLoading(true)
            try {
                const parsedId = Number.parseInt(idParam)
                const data = await getGateById(token!, parsedId)
                setGate(data)
            } catch (e) {
                console.error("❌ Failed to load gate", e)
            }
            setLoading(false)
        }
        fetchGate()
    }, [match.params.id, token])

    useEffect(() => {
        if (gate) {
            const base = (gate.price || 1) * width * height
            const extras = [gate.option1, gate.option2, gate.option3, gate.option4, gate.option5]
                .map((p, i) => (options[i] ? (p ?? 0) : 0))
                .reduce((sum, val) => sum + val, 0)
            setTotalPrice(base/10000 + extras)
        }
    }, [gate, width, height, options])

    const handleSubmit = async () => {
        if (!token || !gate) return
        setSubmitting(true)

        try {
            await createOrder(token, {
                gate_id: gate._id ? Number.parseInt(gate._id as string) : 0,
                width,
                height,
                total_price: totalPrice,
                color,
                option1: options[0],
                option2: options[1],
                option3: options[2],
                option4: options[3],
                option5: options[4],
            })
            alert("Produs adăugat în coș!")
            history.replace("/articlesClient")
        } catch (e) {
            console.error("Eroare la salvarea comenzii:", e)
            alert("A apărut o eroare. Încearcă din nou.")
        }
        setSubmitting(false)
    }
    useEffect(() => {
        if (!options[0] && options[4]) {
            const newOptions = [...options];
            newOptions[4] = false;
            setOptions(newOptions);
        }
    }, [options[0]]);

    return (
        <IonPage className="order-page">
            {/* Background Elements */}
            <div className="order-background">
                <div className="background-overlay"></div>
                <div className="floating-element floating-element-1"></div>
                <div className="floating-element floating-element-2"></div>
                <div className="particle particle-1"></div>
                <div className="particle particle-2"></div>
            </div>

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

            <IonContent className="order-content">
                <IonLoading isOpen={loading || submitting} message="Se procesează..." />

                {gate && (
                    <div className="order-container">
                        {/* Product Header */}
                        <div className="order-product-header">
                            <div className="product-info">
                                <h1 className="product-title">{gate.text || "Configurare Produs"}</h1>
                                <p className="product-subtitle">Personalizează produsul conform nevoilor tale</p>
                            </div>
                            <div className="product-price-badge">
                                <span className="price-label">Preț de bază</span>
                                <span className="price-value">{gate.price || 0} RON/m²</span>
                            </div>
                        </div>

                        <div className="order-form-wrapper">
                            {/* Dimensions Section */}
                            <div className="order-section">
                                <div className="section-header">
                                    <div className="section-icon">
                                        <IonIcon icon={resizeOutline} />
                                    </div>
                                    <div className="section-title">
                                        <h3>Dimensiuni</h3>
                                        <p>Specifică dimensiunile dorite</p>
                                    </div>
                                </div>

                                <div className="dimensions-grid">
                                    <div className="dimension-field">
                                        <label className="field-label">Lățime (cm)</label>
                                        <div className="input-wrapper">
                                            <IonInput
                                                className="enhanced-input"
                                                type="number"
                                                value={width}
                                                onIonChange={(e) => setWidth(Number.parseFloat(e.detail.value!) || 1)}
                                                placeholder="1.0"
                                                min="0.1"
                                                step="0.1"
                                            />
                                            <span className="input-unit">cm</span>
                                        </div>
                                    </div>

                                    <div className="dimension-field">
                                        <label className="field-label">Înălțime (cm)</label>
                                        <div className="input-wrapper">
                                            <IonInput
                                                className="enhanced-input"
                                                type="number"
                                                value={height}
                                                onIonChange={(e) => setHeight(Number.parseFloat(e.detail.value!) || 1)}
                                                placeholder="1.0"
                                                min="0.1"
                                                step="0.1"
                                            />
                                            <span className="input-unit">m</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="area-display">
                                    <span className="area-label">Suprafață totală:</span>
                                    <span className="area-value">{((width * height)/10000).toFixed(2)} m²</span>
                                </div>
                            </div>

                            {/* Color Section */}
                            <div className="order-section">
                                <div className="section-header">
                                    <div className="section-icon">
                                        <IonIcon icon={colorPaletteOutline} />
                                    </div>
                                    <div className="section-title">
                                        <h3>Culoare</h3>
                                        <p>Alege culoarea dorită</p>
                                    </div>
                                </div>

                                <div className="color-selector">
                                    <div className="color-preview" style={{ backgroundColor: color }}>
                                        <input
                                            type="color"
                                            value={color}
                                            onChange={(e) => setColor(e.target.value)}
                                            className="color-input"
                                        />
                                    </div>
                                    <div className="color-info">
                                        <span className="color-label">Culoare selectată</span>
                                        <span className="color-code">{color.toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Options Section */}
                            {visibleOptionIndices.length > 0 && (
                                <div className="order-section">
                                <div className="section-header">
                                    <div className="section-icon">
                                        <IonIcon icon={optionsOutline} />
                                    </div>
                                    <div className="section-title">
                                        <h3>Opțiuni Suplimentare</h3>
                                        <p>Selectează funcționalitățile dorite</p>
                                    </div>
                                </div>

                                <div className="options-grid">
                                    {optionList
                                        .map((opt, idx) => ({ ...opt, idx }))
                                        .filter(opt => visibleOptionIndices.includes(opt.idx))
                                        .map(({ key, name, desc, idx }) => {
                                            const optionPrice = (gate?.[key as keyof IArticleProps] as number) ?? 0;
                                            const isDisabled = idx === 4 && !options[0];

                                            const handleOptionClick = () => {
                                                if (isDisabled) return;
                                                const newOptions = [...options];
                                                newOptions[idx] = !options[idx];
                                                setOptions(newOptions);
                                            };

                                            return (
                                                <div
                                                    key={key}
                                                    className={`option-card ${options[idx] ? "selected" : ""} ${isDisabled ? "disabled" : ""}`}
                                                    onClick={handleOptionClick}
                                                    style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
                                                >
                                                    <div className="option-content">
                                                        <div className="option-info">
                                                            <h4 className="option-name">{name}</h4>
                                                            <p className="option-desc">{desc}</p>
                                                            <p className="option-price">+{optionPrice} RON</p>
                                                            {isDisabled && (
                                                                <span style={{ color: "#dc2626", fontSize: 12 }}>Necesită Automatizare</span>
                                                            )}
                                                        </div>
                                                        <div className="option-toggle" onClick={e => e.stopPropagation()}>
                                                            <IonCheckbox
                                                                checked={options[idx]}
                                                                disabled={isDisabled}
                                                                onIonChange={(e) => {
                                                                    if (isDisabled) return;
                                                                    const newOptions = [...options];
                                                                    newOptions[idx] = e.detail.checked;
                                                                    setOptions(newOptions);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}


                                </div>


                            </div>
                            )}
                            {/* Summary Section */}
                            <div className="order-section order-summary">
                                <div className="summary-header">
                                    <div className="section-icon">
                                        <IonIcon icon={calculatorOutline} />
                                    </div>
                                    <div className="section-title">
                                        <h3>Rezumat Comandă</h3>
                                        <p>Verifică detaliile înainte de finalizare</p>
                                    </div>
                                </div>

                                <div className="summary-details">
                                    <div className="summary-row">
                    <span className="summary-label">
                      Preț de bază ({width} × {height} cm²)
                    </span>
                                        <span className="summary-value">{((gate.price || 0) * width * height/10000).toFixed(2)} RON</span>
                                    </div>

                                    {options.some((opt) => opt) && (
                                        <div className="summary-row">
                                            <span className="summary-label">Opțiuni suplimentare</span>
                                            <span className="summary-value">
                        +
                                                {[gate.option1, gate.option2, gate.option3, gate.option4, gate.option5]
                                                    .map((p, i) => (options[i] ? (p ?? 0) : 0))
                                                    .reduce((sum, val) => sum + val, 0)
                                                    .toFixed(2)}{" "}
                                                RON
                      </span>
                                        </div>
                                    )}

                                    <div className="summary-divider"></div>

                                    <div className="summary-row summary-total">
                                        <span className="summary-label">Total</span>
                                        <span className="summary-value">{(totalPrice).toFixed(2)} RON</span>
                                    </div>
                                </div>

                                <IonButton expand="block" className="order-submit-button" onClick={handleSubmit} disabled={submitting}>
                                    <IonIcon icon={cartOutline} slot="start" />
                                    {submitting ? "Se procesează..." : "Adaugă în Coș"}
                                </IonButton>
                            </div>
                        </div>
                    </div>
                )}
            </IonContent>
            <WhatsAppButton />
        </IonPage>
    )
}

export default OrderCreate
