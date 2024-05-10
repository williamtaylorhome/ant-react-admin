import { notification, Modal } from 'antd';

const TIP_TITLE = 'Tips';
const TIP = 'success';

export default function handleSuccess({ tip, options = {} }) {
    const { successModal } = options;

    if (!tip && !successModal) return;

    // Avoid stuttering
    setTimeout(() => {
        // A pop-up box is displayed
        if (successModal) {
            // Detailed configuration
            if (typeof successModal === 'object') {
                return Modal.success({
                    title: TIP_TITLE,
                    content: tip,
                    ...successModal,
                });
            }

            return Modal.success({
                title: TIP_TITLE,
                content: successModal,
            });
        }

        notification.success({
            message: TIP,
            description: tip,
            duration: 2,
        });
    });
}
