import { notification, Modal } from 'antd';
import { toLogin } from './index';

const ERROR_SERVER = 'The system is deserted, please try again later or contact the administrator!';
const ERROR_NOT_FOUND = 'The resource you are accessing does not exist!';
const ERROR_FORBIDDEN = "You don't have access to it!";
const ERROR_UNKNOWN = 'Unknown error';
const TIP_TITLE = 'Tips';
const TIP = 'fail';

function getErrorTip(error, tip) {
    if (tip && tip !== true) return tip;

    // HTTP status code
    if (error?.response) {
        const { status } = error.response;

        if (status === 401) return toLogin();
        if (status === 403) return ERROR_FORBIDDEN;
        if (status === 404) return ERROR_NOT_FOUND;
        if (status >= 500) return ERROR_SERVER;
    }

    // Backend custom information
    const data = error?.response?.data || error;

    if (typeof data === 'string') return data;
    if (data?.message) return data.message;
    if (data?.msg) return data.msg;

    return ERROR_UNKNOWN;
}

export default function handleError({ error, tip, options = {} }) {
    const description = getErrorTip(error, tip);
    const { errorModal } = options;

    if (!description && !errorModal) return;

    // Avoid stuttering
    setTimeout(() => {
        // A pop-up prompt
        if (errorModal) {
            // Detailed configuration
            if (typeof errorModal === 'object') {
                return Modal.error({
                    title: TIP_TITLE,
                    content: description,
                    ...errorModal,
                });
            }

            return Modal.error({
                title: TIP_TITLE,
                content: description,
            });
        }

        // Slide out the tip in the top right corner
        notification.error({
            message: TIP,
            description,
            duration: 2,
        });
    });
}
