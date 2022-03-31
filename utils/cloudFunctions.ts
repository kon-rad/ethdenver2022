import app from './firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions(app);

export const authUser = httpsCallable(functions, 'authUser');

// export const authUser = async (data) => {
//     const callAuthUser = functions.https.onRequest('authUser');
//     const result = await callAuthUser(data);
//     console.log('auth user result: ', result);
//     return result;
// }