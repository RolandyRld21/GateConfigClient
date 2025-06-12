"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { IonPage, IonHeader, IonToolbar, IonContent, IonIcon, IonCard, IonCardContent, IonModal } from "@ionic/react"
import { useHistory } from "react-router-dom"
import {
    locate,
    logoFacebook,
    logoInstagram,
    chevronBackOutline,
    chevronForwardOutline,
    closeOutline,
    imagesOutline,
    sparkles,
    starOutline,
    layersOutline,
    grid,
    cartOutline,
    arrowBackOutline,
    playOutline,
    pauseOutline,
    expandOutline,
} from "ionicons/icons"
import "../shared/theme/our-work-styles.css"
import "../shared/theme/enhanced-filters-styles.css"
import {MyModal} from "../shared/components/MyModal";
import WhatsAppButton from "../shared/components/WhatsAppButton";

interface Project {
    id: number
    title: string
    category: string
    description: string
    images: string[]
    year: string
    location: string
}

const OurWork: React.FC = () => {
    const history = useHistory()
    const [isExtrasOpen, setIsExtrasOpen] = useState(false)
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isAutoPlay, setIsAutoPlay] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState("Toate")

    // Date de test pentru proiecte
    const projects: Project[] = [
        {
            id: 1,
            title: "Poartă Modernă Rezidențială",
            category: "Porți",
            description: "Poartă automată cu design modern pentru o vilă din Cluj-Napoca",
            images: [
                "https://qpvdjklmliwunjimrtpg.supabase.co/storage/v1/object/public/gates-images//466929436_607707128584975_2948680190966573568_n.jpg",
            ],
            year: "2024",
            location: "Cluj-Napoca",
        },
        {
            id: 2,
            title: "Gard Decorativ Industrial",
            category: "Garduri",
            description: "Gard metalic decorativ pentru complex industrial",
            images: [
                "https://qpvdjklmliwunjimrtpg.supabase.co/storage/v1/object/public/gates-images//se1.jpg",
                "https://qpvdjklmliwunjimrtpg.supabase.co/storage/v1/object/public/gates-images//se3.jpg",
                "https://qpvdjklmliwunjimrtpg.supabase.co/storage/v1/object/public/gates-images//se.jpg",
            ],
            year: "2024",
            location: "Sebeș",
        },
        {
            id: 3,
            title: "Balustradă Elegantă",
            category: "Balustrade",
            description: "Balustradă pentru scară interioară cu design elegant",
            images: [
                "https://qpvdjklmliwunjimrtpg.supabase.co/storage/v1/object/public/gates-images//b1.jpg",
                "https://qpvdjklmliwunjimrtpg.supabase.co/storage/v1/object/public/gates-images//b2.jpg",
                "https://qpvdjklmliwunjimrtpg.supabase.co/storage/v1/object/public/gates-images//b3.jpg",
            ],
            year: "2023",
            location: "Alba Iulia",
        },
        {
            id: 4,
            title: "Structură Metalică Garaj",
            category: "Structuri",
            description: "Structură metalică pentru centru comercial",
            images: [
                "https://qpvdjklmliwunjimrtpg.supabase.co/storage/v1/object/public/gates-images//g1.jpg",
                "https://qpvdjklmliwunjimrtpg.supabase.co/storage/v1/object/public/gates-images//g2.jpg",

            ],
            year: "2023",
            location: "Deva",
        },
        {
            id: 5,
            title: "Mobilier Metalic Exterior",
            category: "Mobilier",
            description: "Set de mobilier metalic pentru terasă",
            images: [
                "https://qpvdjklmliwunjimrtpg.supabase.co/storage/v1/object/public/gates-images//m2.jpg",
                "https://qpvdjklmliwunjimrtpg.supabase.co/storage/v1/object/public/gates-images//m1.jpg",

            ],
            year: "2024",
            location: "Sibiu",
        },
        {
            id: 6,
            title: "Poartă Clasică Ornamentală",
            category: "Porți",
            description: "Poartă cu ornamente clasice pentru casă de patrimoniu",
            images: [
                "https://qpvdjklmliwunjimrtpg.supabase.co/storage/v1/object/public/gates-images//p1.jpg",
                "https://qpvdjklmliwunjimrtpg.supabase.co/storage/v1/object/public/gates-images//p2.jpg",

            ],
            year: "2023",
            location: "Brașov",
        },
    ]

    const categories = ["Toate", "Porți", "Garduri", "Balustrade", "Structuri", "Mobilier"]

    const filteredProjects =
        selectedCategory === "Toate" ? projects : projects.filter((project) => project.category === selectedCategory)

    // Auto-play pentru sliderul din modal
    useEffect(() => {
        if (isModalOpen && selectedProject && isAutoPlay) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % selectedProject.images.length)
            }, 3000)
            return () => clearInterval(interval)
        }
    }, [isModalOpen, selectedProject, isAutoPlay, currentImageIndex])

    const openProjectModal = (project: Project) => {
        setSelectedProject(project)
        setCurrentImageIndex(0)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedProject(null)
        setCurrentImageIndex(0)
    }

    const nextImage = () => {
        if (selectedProject) {
            setCurrentImageIndex((prev) => (prev + 1) % selectedProject.images.length)
        }
    }

    const prevImage = () => {
        if (selectedProject) {
            setCurrentImageIndex((prev) => (prev - 1 + selectedProject.images.length) % selectedProject.images.length)
        }
    }

    return (
        <IonPage className="work-page">
            {/* Background Elements */}
            <div className="work-background">
                <div className="background-overlay"></div>
                <div className="floating-element floating-element-1"></div>
                <div className="floating-element floating-element-2"></div>
                <div className="particle particle-1"></div>
                <div className="particle particle-2"></div>
            </div>

            <IonHeader className="modern-product-header">
                <IonToolbar className="articles-toolbar">
                    <div className="modern-toolbar-content">

                        <button className="modern-back-btn" onClick={() => history.push("/articlesClient")}>
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

            <IonContent className="work-content">
                <div className="work-container">



                    {/* Projects Grid */}
                    <div className="projects-grid">
                        {filteredProjects.map((project) => (
                            <IonCard key={project.id} className="project-card" onClick={() => openProjectModal(project)}>
                                <div className="project-image-container">
                                    <img src={project.images[0] || "/placeholder.svg"} alt={project.title} className="project-image" />
                                    <div className="project-overlay">
                                        <div className="overlay-content">
                                            <IonIcon icon={expandOutline} className="expand-icon" />
                                            <span className="image-count">{project.images.length} imagini</span>
                                        </div>
                                    </div>
                                </div>
                                <IonCardContent className="project-content">
                                    <div className="project-header">
                                        <h3 className="project-title">{project.title}</h3>
                                        <span className="project-category">{project.category}</span>
                                    </div>
                                    <p className="project-description">{project.description}</p>
                                    <div className="project-meta">
                                        <span className="project-year">{project.year}</span>
                                        <span className="project-location">{project.location}</span>
                                    </div>
                                </IonCardContent>
                            </IonCard>
                        ))}
                    </div>

                    {filteredProjects.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <IonIcon icon={imagesOutline} />
                            </div>
                            <h3>Nu s-au găsit proiecte</h3>
                            <p>Nu există proiecte în categoria selectată</p>
                        </div>
                    )}
                </div>

                {/* Project Modal */}
                <IonModal isOpen={isModalOpen} onDidDismiss={closeModal} className="project-modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="modal-title-section">
                                <h2>{selectedProject?.title}</h2>
                                <span className="modal-category">{selectedProject?.category}</span>
                            </div>
                            <div className="modal-controls">
                                <button
                                    className="control-btn"
                                    onClick={() => setIsAutoPlay(!isAutoPlay)}
                                    title={isAutoPlay ? "Oprește autoplay" : "Pornește autoplay"}
                                >
                                    <IonIcon icon={isAutoPlay ? pauseOutline : playOutline} />
                                </button>
                                <button className="control-btn close-btn" onClick={closeModal}>
                                    <IonIcon icon={closeOutline} />
                                </button>
                            </div>
                        </div>

                        {selectedProject && (
                            <div className="modal-slider">
                                <div className="slider-container">
                                    <button className="slider-btn prev-btn" onClick={prevImage}>
                                        <IonIcon icon={chevronBackOutline} />
                                    </button>

                                    <div className="slider-image-container">
                                        <img
                                            src={selectedProject.images[currentImageIndex] || "/placeholder.svg"}
                                            alt={`${selectedProject.title} - Imagine ${currentImageIndex + 1}`}
                                            className="slider-image"
                                            style={{
                                                width: '100%',
                                                height: '400px',
                                                objectFit: 'contain',
                                                objectPosition: 'center',
                                                backgroundColor: '#f5f5f5',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <div className="image-counter">
                                            {currentImageIndex + 1} / {selectedProject.images.length}
                                        </div>
                                    </div>

                                    <button className="slider-btn next-btn" onClick={nextImage}>
                                        <IonIcon icon={chevronForwardOutline} />
                                    </button>
                                </div>

                                <div className="slider-dots">
                                    {selectedProject.images.map((_, index) => (
                                        <button
                                            key={index}
                                            className={`dot ${index === currentImageIndex ? "active" : ""}`}
                                            onClick={() => setCurrentImageIndex(index)}
                                        />
                                    ))}
                                </div>

                                <div className="project-details">
                                    <p className="project-description-modal">{selectedProject.description}</p>
                                    <div className="project-meta-modal">
                                        <div className="meta-item">
                                            <span className="meta-label">An:</span>
                                            <span className="meta-value">{selectedProject.year}</span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-label">Locație:</span>
                                            <span className="meta-value">{selectedProject.location}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="thumbnail-strip">
                                    {selectedProject.images.map((image, index) => (
                                        <button
                                            key={index}
                                            className={`thumbnail ${index === currentImageIndex ? "active" : ""}`}
                                            onClick={() => setCurrentImageIndex(index)}
                                        >
                                            <img
                                                src={image || "/placeholder.svg"}
                                                alt={`Thumbnail ${index + 1}`}
                                                style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    objectFit: 'cover',
                                                    objectPosition: 'center'
                                                }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </IonModal>
            </IonContent>
            <WhatsAppButton />
        </IonPage>
    )
}

export default OurWork