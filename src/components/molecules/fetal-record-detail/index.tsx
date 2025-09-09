import React from 'react';
import { Modal, Descriptions, Tag, Divider, Button } from 'antd';
import { formatDate } from '../../../utils/formatDate';

export enum PregnancyStatus {
	PREGNANT = 'PREGNANT',
	BORN = 'BORN',
	MISSED = 'MISSED',
	STILLBIRTH = 'STILLBIRTH',
	ABORTED = 'ABORTED',
	MISCARRIAGE = 'MISCARRIAGE',
}

interface CheckupRecord {
	id: string;
	motherWeight: string | null;
	motherBloodPressure: string | null;
	motherHealthStatus: string | null;
	fetalWeight: string | null;
	fetalHeight: string | null;
	fetalHeartbeat: string | null;
	warning: string | null;
	createdAt: string;
	appointment: { id: string; appointmentDate: string; status: string } | null;
}

interface Mother {
	id: string;
	username: string;
	email: string;
	fullName: string;
	phone: string;
	role: string;
	isDeleted: boolean;
}

interface Fetal {
	id: string;
	name: string;
	note: string;
	dateOfPregnancyStart: string;
	expectedDeliveryDate: string;
	actualDeliveryDate: string | null;
	healthStatus: string;
	status: PregnancyStatus;
	isDeleted: number;
	createdAt: string;
	updatedAt: string;
	checkupRecords: CheckupRecord[];
	mother: Mother;
}

// Chỉ giữ một khai báo statusLabels
const statusLabels: Record<PregnancyStatus, string> = {
	[PregnancyStatus.PREGNANT]: 'Đang mang thai',
	[PregnancyStatus.BORN]: 'Đã sinh',
	[PregnancyStatus.MISSED]: 'Mất thai không có dấu hiệu',
	[PregnancyStatus.STILLBIRTH]: 'Thai chết lưu',
	[PregnancyStatus.ABORTED]: 'Phá thai',
	[PregnancyStatus.MISCARRIAGE]: 'Sảy thai',
};

const statusColors: Record<PregnancyStatus, string> = {
	[PregnancyStatus.PREGNANT]: 'blue',
	[PregnancyStatus.BORN]: 'green',
	[PregnancyStatus.MISSED]: 'orange',
	[PregnancyStatus.STILLBIRTH]: 'red',
	[PregnancyStatus.ABORTED]: 'purple',
	[PregnancyStatus.MISCARRIAGE]: 'volcano',
};

const FetalDetailModal = ({
	visible,
	onCancel,
	fetal,
}: {
	visible: boolean;
	onCancel: () => void;
	fetal: Fetal | null;
}) => {
	if (!fetal) return null;

	// Tìm bản ghi kiểm tra sức khỏe mới nhất
	const latestCheckup = fetal.checkupRecords.sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
	)[0];

	return (
		<Modal
			title={`Chi tiết thai kỳ: ${fetal.name}`}
			open={visible}
			onCancel={onCancel}
			footer={[
				<Button key="close" onClick={onCancel}>
					Đóng
				</Button>,
			]}
			width={800}
		>
			<Divider orientation="left">Thông tin mẹ</Divider>
			<Descriptions column={1} bordered>
				<Descriptions.Item label="Tên">{fetal.mother.fullName}</Descriptions.Item>
				<Descriptions.Item label="Email">{fetal.mother.email}</Descriptions.Item>
				<Descriptions.Item label="Số điện thoại">{fetal.mother.phone}</Descriptions.Item>
			</Descriptions>

			<Divider orientation="left">Thông tin thai nhi</Divider>
			<Descriptions column={1} bordered>
				<Descriptions.Item label="Tên thai kỳ">{fetal.name}</Descriptions.Item>
				<Descriptions.Item label="Ghi chú">{fetal.note}</Descriptions.Item>
				<Descriptions.Item label="Ngày cuối kỳ kinh">
					{formatDate(fetal.dateOfPregnancyStart)}
				</Descriptions.Item>
				<Descriptions.Item label="Ngày dự sinh">
					{formatDate(fetal.expectedDeliveryDate)}
				</Descriptions.Item>
				<Descriptions.Item label="Ngày sinh thực tế">
					{fetal.actualDeliveryDate ? formatDate(fetal.actualDeliveryDate) : 'Chưa có'}
				</Descriptions.Item>
				<Descriptions.Item label="Tình trạng sức khỏe">{fetal.healthStatus}</Descriptions.Item>
				<Descriptions.Item label="Trạng thái">
					<Tag color={statusColors[fetal.status]}>{statusLabels[fetal.status]}</Tag>
				</Descriptions.Item>
				<Descriptions.Item label="Ngày tạo">{formatDate(fetal.createdAt)}</Descriptions.Item>
			</Descriptions>

			<Divider orientation="left">Hồ sơ kiểm tra sức khỏe mới nhất</Divider>
			{latestCheckup ? (
				<Descriptions column={1} bordered>
					<Descriptions.Item label="Cân nặng mẹ">{latestCheckup.motherWeight || 'N/A'} kg</Descriptions.Item>
					<Descriptions.Item label="Huyết áp mẹ">
						{latestCheckup.motherBloodPressure || 'N/A'} mmHg
					</Descriptions.Item>
					<Descriptions.Item label="Tình trạng sức khỏe mẹ">
						{latestCheckup.motherHealthStatus || 'N/A'}
					</Descriptions.Item>
					<Descriptions.Item label="Cân nặng thai nhi">
						{latestCheckup.fetalWeight || 'N/A'} kg
					</Descriptions.Item>
					<Descriptions.Item label="Chiều cao thai nhi">
						{latestCheckup.fetalHeight || 'N/A'} cm
					</Descriptions.Item>
					<Descriptions.Item label="Nhịp tim thai nhi">
						{latestCheckup.fetalHeartbeat || 'N/A'} lần/phút
					</Descriptions.Item>
					<Descriptions.Item label="Cảnh báo">{latestCheckup.warning || 'N/A'}</Descriptions.Item>
					<Descriptions.Item label="Ngày kiểm tra">
						{formatDate(latestCheckup.createdAt)}
					</Descriptions.Item>
				</Descriptions>
			) : (
				<p>Chưa có hồ sơ kiểm tra sức khỏe nào.</p>
			)}
		</Modal>
	);
};

export default FetalDetailModal;