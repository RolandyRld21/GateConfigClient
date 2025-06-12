import { useEffect, useState } from 'react';
import { useCamera } from './useCamera';
import { useFilesystem } from './useFilesystem';
import { setPreferences, getPreferences, removePreferences } from './preferences';

export interface MyPhoto {
    filepath: string;
    webviewPath?: string;
}

const PHOTOS = 'photos';

export function usePhotos() {
    const [currentPhoto, setCurrentPhoto] = useState<MyPhoto>();
    const { getPhoto } = useCamera();
    const { readFile, writeFile, deleteFile } = useFilesystem();
    // const { get, set } = usePreferences();
    // useEffect(loadPhotos, [get, readFile, setPhotos]);
    return {
        currentPhoto,
        takePhoto,
        deletePhoto,
    };

    async function takePhoto() {
        const data = await getPhoto();
        if (currentPhoto){
            await deletePhoto(currentPhoto);
        }
        const filepath = new Date().getTime() + '.jpeg';
        await writeFile(filepath, data.base64String!);

        const webviewPath = `data:image/jpeg;base64,${data.base64String}`
        const newPhoto = { filepath, webviewPath };
        var photos = (await getPreferences(PHOTOS)) as MyPhoto[] || [] as MyPhoto[];
        const newPhotos = [newPhoto, ...photos];
        await setPreferences(PHOTOS, newPhotos.map(p => ({ filepath: p.filepath })));
        setCurrentPhoto(newPhoto);
    }

    async function deletePhoto(photo: MyPhoto) {
        var photos = await getPreferences(PHOTOS) as MyPhoto[];
        if (!photos){
            photos = [] as MyPhoto[];
        }
        // console.log('delete', typeof(photos), photos);
        const newPhotos = photos.filter(p => p.filepath !== photo.filepath);
        await setPreferences(PHOTOS, newPhotos);
        await deleteFile(photo.filepath);
        // setPhotos(newPhotos);
    }

}
