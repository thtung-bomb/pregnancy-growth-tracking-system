// validators.ts
export const validateFullName = (_: any, value: string) => {
    if (!value || value.trim().split(' ').length < 2) {
        return Promise.reject(new Error('Họ tên phải có ít nhất 2 chữ!'));
    }
    return Promise.resolve();
};

export const validatePassword = (_: any, value: string) => {
    if (!value || value.length < 6) {
        return Promise.reject(new Error('Mật khẩu phải có ít nhất 6 ký tự!'));
    }
    return Promise.resolve();
};

export const validatePhoneNumber = (_: any, value: string) => {
    const phoneRegex = /^\d{10}$/; // Biểu thức chính quy để kiểm tra 10 chữ số
    if (!value || !phoneRegex.test(value)) {
        return Promise.reject(new Error('Số điện thoại phải là 10 chữ số!'));
    }
    return Promise.resolve();
};

export const validateUsername = (_: any, value: string) => {
    const usernameRegex = /^[a-zA-Z0-9._]{3,}$/; // Tên người dùng phải có ít nhất 3 ký tự và chỉ chứa chữ cái, số, dấu gạch dưới và dấu chấm
    if (!value || !usernameRegex.test(value)) {
        return Promise.reject(new Error('Tên người dùng phải có ít nhất 3 ký tự và chỉ chứa chữ cái, số, dấu gạch dưới và dấu chấm!'));
    }
    return Promise.resolve();
};

// validators.ts
export const validateBloodPressure = async (value: string) => {
    if (!value) {
        return Promise.reject('Vui lòng nhập huyết áp của người mẹ!');
    }

    // Kiểm tra định dạng huyết áp (ví dụ: 120/80)
    const regex = /^\d{1,3}\/\d{1,3}$/;
    if (!regex.test(value)) {
        return Promise.reject('Huyết áp không hợp lệ! Vui lòng nhập theo định dạng: 120/80');
    }

    return Promise.resolve();
};
// validators.ts
import { Rule } from 'antd/lib/form';

export const validatePrice: Rule = {
    required: true,
    validator: (_, value) => {
        if (value === undefined || value === null) {
            return Promise.reject(new Error("Vui lòng nhập giá"));
        } else if (value < 1000) {
            return Promise.reject(new Error("Giá phải lớn hơn hoặc bằng 1000"));
        }
        return Promise.resolve();
    },
};

