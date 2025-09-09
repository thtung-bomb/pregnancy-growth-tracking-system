import type React from "react"
import { Modal, Spin } from "antd"
import { ServiceDetails } from "../services-detail"

interface Service {
	id: string
	name: string
	price: number
	isInPackage: boolean
}

interface ServiceResponse {
	services: Service[]
	totalCostWithoutPackage: number
	depositAmount: number
	finalCost: number
}

interface ModalServiceDetailsProps {
	visible: boolean
	title: string
	data: ServiceResponse | null
	loading: boolean
	onCancel: () => void
}

const ModalServiceDetails: React.FC<ModalServiceDetailsProps> = ({ visible, title, data, loading, onCancel }) => {
	return (
		<Modal title={title} open={visible} onCancel={onCancel} footer={null} width={800} centered destroyOnClose>
			{loading ? (
				<div className="flex justify-center items-center p-12">
					<Spin size="large" tip="Đang tải dữ liệu..." />
				</div>
			) : data ? (
				<ServiceDetails data={data} />
			) : (
				<div>Không có dữ liệu</div>
			)}
		</Modal>
	)
}

export default ModalServiceDetails

