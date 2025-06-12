import { IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { logoWhatsapp } from "ionicons/icons";

const whatsappPhone = "40751095008";
const message = "Buna ziua!";

const WhatsAppButton: React.FC = () => {
    const url = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;

    return (
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton color="success" href={url} target="_blank" rel="noopener noreferrer">
                <IonIcon icon={logoWhatsapp} />
            </IonFabButton>
        </IonFab>
    );
};

export default WhatsAppButton;
