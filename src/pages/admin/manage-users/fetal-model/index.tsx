import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import useFetalService from "../../../../services/useFetalService";
import { formatDate } from "../../../../utils/formatDate";

// Define the expected shape of fetal profile data (adjust based on your API)
interface FetalProfileData {
	name: string;
	age: number;
	details: string;
	dateOfPregnancyStart: string;
	expectedDeliveryDate: string;
	healthStatus: string;
}

interface FetalProfileModalProps {
	visible: boolean;
	onCancel: () => void;
	userId: string | null;
}

const FetalProfileModal: React.FC<FetalProfileModalProps> = ({ visible, onCancel, userId }) => {
	const [fetalProfile, setFetalProfile] = useState<FetalProfileData | null>(null);
	const [loading, setLoading] = useState(false);
	const { getFetalsByMotherId } = useFetalService();

	useEffect(() => {
		if (userId && visible) {
			setLoading(true);
			getFetalsByMotherId(userId)
				.then((data) => {
					// Assuming getFetalsByMotherId returns FetalProfileData[]
					if (Array.isArray(data) && data.length > 0) {
						setFetalProfile(data[0]); // Take the first profile
					} else {
						setFetalProfile(null); // No profiles found
					}
					setLoading(false);
				})
				.catch((error) => {
					console.error("Error fetching fetal profile:", error);
					setFetalProfile(null);
					setLoading(false);
				});
		}
	}, [userId, visible]);

	return (
		<Modal
			title="Hồ Sơ Thai Nhi"
			visible={visible}
			onCancel={onCancel}
			footer={null}
		>
			{loading ? (
				<p>Đang tải...</p>
			) : fetalProfile ? (
				<div>
					<p><strong>Tên:</strong> {fetalProfile.name}</p>
					<p><strong>Tuổi:</strong> {fetalProfile.age} tuần</p>
					<p><strong>Chi tiết:</strong> {fetalProfile.details}</p>
					<p>Ngày mang thai: {formatDate(fetalProfile.dateOfPregnancyStart)}</p>
					<p>Ngày dự sinh: {formatDate(fetalProfile.expectedDeliveryDate)}</p>
					<p>Tình trạng sức khỏe: {fetalProfile.healthStatus.toLowerCase() == 'healthy' ? 'Sức khỏe tốt' : 'Yếu'}</p>
				</div>
			) : (
				<p>Không có hồ sơ thai nhi cho người dùng này.</p>
			)}
		</Modal>
	);
};

export default FetalProfileModal;