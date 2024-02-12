import axios from 'axios';

import { authService } from '../security/authService';

const service = async (url) => {
    const headers = {Authorization: `${authService.getToken()}`};
    const instance = axios.create({
        baseURL: `http://localhost:8091/${url}`,
        timeout: 15000,
        headers
    });
    return instance;
}

export async function genericGet(url) {
    const instance = await service(url);
    return instance.get('');
}

export async function genericPost(url, body) {
    const instance = await service(url);
    return instance.post('', body);
}

export async function genericPut(url, body) {
    const instance = await service(url);
    return instance.put('', body);
}

export async function genericPatch(url) {
    const instance = await service(url);
    return instance.patch('');
}

export async function genericDelete(url) {
    const instance = await service(url);
    return instance.delete('');
}