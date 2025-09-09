import { CheckupRecord } from "./checkupRecord";
import { Mother } from "./user";

export interface FetalRecord {
    id: string;
    name: string; // Tên thai nhi
    note: string; // Ghi chú
    dateOfPregnancyStart: string; // Ngày bắt đầu thai kỳ
    expectedDeliveryDate: string; // Ngày dự sinh
    actualDeliveryDate: string | null; // Ngày sinh thực tế (nếu có)
    healthStatus: string; // Tình trạng sức khỏe
    status: 'PREGNANT' | 'DELIVERED'; // Trạng thái thai nhi
    isDeleted: number; // Trạng thái xóa
    createdAt: string; // Ngày tạo
    updatedAt: string; // Ngày cập nhật
    checkupRecords: CheckupRecord[]; // Danh sách hồ sơ kiểm tra
    mother: Mother; // Thông tin mẹ
}
