import React, { useContext, useEffect, useState, useRef } from 'react';
import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem,
    IonLabel, IonList, IonButton, IonFooter, IonText, IonLoading, IonIcon
} from '@ionic/react';
import { useParams } from 'react-router';
import { AuthContext } from '../auth';
import { useHistory } from "react-router-dom"
import { getMessages, sendMessage, Message } from './messageApi';
import "../shared/theme/enhanced-filters-styles.css"
import {
    arrowBackOutline,
    cartOutline,
    grid,
    layersOutline, locate,
    logoFacebook,
    logoInstagram,
    sparkles,
    starOutline
} from "ionicons/icons";
import {MyModal} from "../shared/components/MyModal";
import "../shared/theme/message-style-css.css"
import WhatsAppButton from "../shared/components/WhatsAppButton";
const MessagePage: React.FC = () => {
    const { token } = useContext(AuthContext);
    const { id } = useParams<{ id: string }>();
    const finalCartId = Number(id);
    const history = useHistory()

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const bottomRef = useRef<HTMLDivElement>(null);
    const [isExtrasOpen, setIsExtrasOpen] = useState(false);

    const fetchMessages = async () => {
        try {
            const data = await getMessages(token, finalCartId);
            if (data.length !== messages.length || JSON.stringify(data) !== JSON.stringify(messages)) {
                setMessages(data);
            }
        } catch (err) {
            console.error('Error fetching messages', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!newMessage.trim()) return;
        try {
            const sent = await sendMessage(token, finalCartId, newMessage);
            setNewMessage('');
            setMessages(prev => [...prev, sent]);

            setTimeout(() => {
                bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (err) {
            console.error('Error sending message', err);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 500);
        return () => clearInterval(interval);
    }, [finalCartId, token]);

    return (
        <IonPage>
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
            <IonContent>
                <div className="message-header-container">
                <div className="message-header-number">

                    <div className="message=header-info">
                        <h1 className="message-page-title">Mesagerie - Comandă {finalCartId} </h1>
                        <p className="message-page-subtitle">Descoperă dorințele clienților </p>
                    </div>


                </div>
                </div>
                <IonLoading isOpen={loading} message="Se încarcă mesajele..." />
                <div className="chat-messages-container">
                    {messages.map(msg => (
                        <div
                            key={msg.id}
                            className={`chat-bubble ${msg.sender === 'admin' ? 'left' : 'right'} ${msg.sender === 'admin' ? 'light' : 'primary'}`}
                        >
                            <div className="bubble-header">
                                <span className="bubble-sender">{msg.sender === 'admin' ? 'Admin' : 'Client'}</span>
                            </div>
                            <div className="bubble-text">{msg.text}</div>
                            <div className="bubble-time">{new Date(msg.timestamp).toLocaleString()}</div>
                        </div>
                    ))}
                    <div ref={bottomRef}></div>
                </div>
            </IonContent>
            <IonFooter>
                <IonToolbar className="chat-toolbar">
                    <form
                        className="chat-input-row"
                        onSubmit={e => {
                            e.preventDefault();
                            handleSend();
                        }}
                        autoComplete="off"
                    >
                        <input
                            className="chat-input"
                            value={newMessage}
                            placeholder="Scrie un mesaj..."
                            onChange={e => setNewMessage(e.target.value)}
                            autoComplete="off"
                        />
                        <IonButton
                            className="chat-send-btn"
                            type="submit"
                            disabled={!newMessage.trim()}
                            expand="block"
                        >
                            Trimite
                        </IonButton>
                    </form>
                </IonToolbar>

            </IonFooter>
            <WhatsAppButton />
        </IonPage>
    );
};

export default MessagePage;
