import { toast } from 'react-toastify';

export const pushToast = (content) => {
    toast.info(content, { icon: false, autoClose: true });
};
