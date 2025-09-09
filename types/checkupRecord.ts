export interface CheckupRecord {
    id: string;
    motherWeight: string; // Cân nặng của mẹ
    motherBloodPressure: string; // Huyết áp của mẹ
    motherHealthStatus: string; // Tình trạng sức khỏe của mẹ
    fetalWeight: string | null; // Cân nặng thai nhi
    fetalHeight: string | null; // Chiều cao thai nhi
    fetalHeartbeat: string | null; // Nhịp tim thai nhi
    warning: string | null; // Cảnh báo
    createdAt: string; // Ngày tạo hồ sơ kiểm tra
}