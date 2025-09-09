import axios from "axios";
import SECRECT from "../secret";

export const generateTimeSlots = () => {
    const slots = [];
    const startHour = 7; // Bắt đầu từ 7:00
    const endHour = 16; // Kết thúc tại 16:00
    let hour = startHour;
    let minute = 0;

    while (hour < endHour || (hour === endHour && minute === 0)) {
        const start = `${hour}:${minute === 0 ? '00' : minute}`;
        const end = `${hour}:${minute === 0 ? '30' : '00'}`;

        slots.push({
            value: `${start}-${end}`,
            label: `${start} - ${end}`,
        });

        minute = minute === 0 ? 30 : 0;
        if (minute === 0) {
            hour++;
        }
    }

    return slots;
};

export const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", SECRECT.CLOUDINARY_UPLOAD_PRESET); // Tạo trong Cloudinary
    formData.append("cloud_name", `${SECRECT.CLOUDINARY_NAME}`);

    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${SECRECT.CLOUDINARY_NAME}/image/upload`,
            formData
        );
        console.log("response.data.secure_url: ", response.data.secure_url)
        return response.data.secure_url; // URL ảnh sau khi upload
    } catch (error) {
        console.error("Upload failed:", error);
        return null;
    }
};

export const tableText = () => {
    return "text-lg"
}


export const getUserDataFromLocalStorage = () => {
    const user = localStorage.getItem("USER");
    console.log(user);
    if (user) {
        const userData = JSON.parse(user)
        return userData;
    }
}