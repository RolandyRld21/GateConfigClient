import { Preferences } from '@capacitor/preferences';

export const setPreferences = async (key: string, value: any) => {
    value = JSON.stringify(value);
    await Preferences.set({ key, value });
};

export const getPreferences = async (key: string) => {
    let value = await Preferences.get({ key });
    if (value.value) {
        return(JSON.parse(value.value));
    }
    console.log('User not found');

    return undefined;
};

export const removePreferences = async (key: string) => {
    await Preferences.remove({ key });
};

export const clearPreferences = async () => {
    await Preferences.clear();
};