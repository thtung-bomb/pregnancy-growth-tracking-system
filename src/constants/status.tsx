export enum AppointmentStatus {
    PENDING = 'PENDING', // Đang chờ xác nhận
    CONFIRMED = 'CONFIRMED', // Đã xác nhận
    CHECKED_IN = 'CHECKED_IN', // Bệnh nhân đã đến bệnh viện
    IN_PROGRESS = 'IN_PROGRESS', // Đang được khám
    COMPLETED = 'COMPLETED', // Đã hoàn tất
    CANCELED = 'CANCELED', // Đã hủy
    AWAITING_DEPOSIT = "AWAITING_DEPOSIT",
    NO_SHOW = "NO_SHOW",
}

export enum PregnancyStatus {
    PREGNANT = 'PREGNANT', // Đang mang thai
    BORN = 'BORN', // Đã sinh
    MISSED = 'MISSED', // Mất thai không có dấu hiệu
    STILLBIRTH = 'STILLBIRTH', // Thai chết lưu
    ABORTED = 'ABORTED', // Phá thai
    MISCARRIAGE = 'MISCARRIAGE', // Thai chết lưu tự nhiên
}