export interface Mother {
    id: string;
    username: string; // Tên đăng nhập
    password: string; // Mật khẩu
    email: string; // Địa chỉ email
    fullName: string; // Họ và tên
    image: string | null; // Hình ảnh (nếu có)
    phone: string; // Số điện thoại
    role: 'user'; // Vai trò
    isDeleted: boolean; // Trạng thái xóa
}

export interface Doctor {
    id: string;
    username: string; // Tên đăng nhập
    password: string; // Mật khẩu
    email: string; // Địa chỉ email
    fullName: string; // Họ và tên
    image: string; // Hình ảnh
    phone: string; // Số điện thoại
    role: 'doctor'; // Vai trò
    isDeleted: boolean; // Trạng thái xóa
}