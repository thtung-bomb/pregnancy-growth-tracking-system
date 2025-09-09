const statusMessages = {
    AWAITING_DEPOSIT: "Chờ đặt cọc",
    PENDING: "Đang chờ",
    CONFIRMED: "Đã xác nhận",
    CHECKED_IN: "Đã đến",
    IN_PROGRESS: "Đang tiến hành",
    COMPLETED: "Hoàn thành",
    CANCELED: "Đã hủy",
    FAIL: "Thất bại",
    NO_SHOW: 'Không đến', // Bệnh nhân không đến
    REFUNDED: 'Đã hoàn tiền', // Đã hoàn tiền
    DEPOSIT_FAILED: 'Đặt cọc thất bại', // Đặt cọc thất bại
    PAYMENT_FAILED: 'Thanh toán thất bại', // Thanh toán thất bại
};

export const getStatusAppointment = (status: string): string => {
    switch (status) {
        case 'AWAITING_DEPOSIT':
            return statusMessages.AWAITING_DEPOSIT;
        case 'PENDING':
            return statusMessages.PENDING;
        case 'CONFIRMED':
            return statusMessages.CONFIRMED;
        case 'CHECKED_IN':
            return statusMessages.CHECKED_IN;
        case 'IN_PROGRESS':
            return statusMessages.IN_PROGRESS;
        case 'COMPLETED':
            return statusMessages.COMPLETED;
        case 'CANCELED':
            return statusMessages.CANCELED;
        case 'FAIL':
            return statusMessages.FAIL;
        case 'NO_SHOW':
            return statusMessages.NO_SHOW;
        case 'REFUNDED':
            return statusMessages.REFUNDED;
        case 'DEPOSIT_FAILED':
            return statusMessages.DEPOSIT_FAILED;
        case 'PAYMENT_FAILED':
            return statusMessages.PAYMENT_FAILED;
        default:
            return 'Trạng thái không hợp lệ'; // Trả về thông báo mặc định nếu không có trạng thái nào khớp
    }
};