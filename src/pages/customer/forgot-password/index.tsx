import React, { useState } from 'react'
import { Button, Col, Form, Input, Row } from 'antd'
import { useNavigate } from 'react-router-dom'
import { USER_ROUTES } from '../../../constants/routes';
import { useForm } from 'antd/es/form/Form';

function ForgotPassword() {
	const [loading, setLoading] = useState(false)
	const [form] = useForm()
	const onFinish = (values: any) => {
		{
			setLoading(true)
			setTimeout(() => {
				setLoading(false)
				console.log('====================================');
				console.log("Success:", values);
				console.log('====================================');
				form.resetFields()
			}, 1500)
		}
	}

	const navigate = useNavigate();

	return (
		<Row justify="center" gutter={[60, 100]} style={{ padding: '40px 0', minWidth: '100%' }}>
			<Col>
				<Row justify="space-between">
					<Button type='primary' style={{ marginBottom: '20px' }} onClick={() => navigate("/auth/login")}>Trở về đăng nhập</Button>
					<img
						className="inline-block h-36 w-40 cursor-pointer"
						src="/nestCareLogo.png"
						alt=""
						onClick={() => navigate(USER_ROUTES.HOME)}
					/>
				</Row>
				<div style={{ padding: '40px', backgroundColor: '#fff', gap: '20px', borderRadius: '20px' }}>
					<p className="text-3xl font-bold py-3">Quên mật khẩu ?</p>
					<p className='py-3 text-lg'>Nhập email của bạn để chúng tôi giúp bạn lấy lại mật khẩu.</p>
					<Form form={form} layout="vertical" onFinish={onFinish}>
						<Form.Item
							label="Email" name="email"
							rules={[
								{ required: true, message: 'Vui lòng nhập email' },
								{ type: 'email', message: 'Email không hợp lệ' },
							]}
						>
							<Input type="email" placeholder="Email" style={{ borderRadius: "40px", padding: "10px 15px" }} />
						</Form.Item>
						<Form.Item className='w-1/2'>
							<Button className='rounded-lg' style={{ borderRadius: "40px" }} type="primary" danger htmlType="submit" block loading={loading}>
								Gửi lại mật khẩu cho bạn
							</Button>
						</Form.Item>
					</Form>
				</div>
			</Col>
		</Row>
	)
}

export default ForgotPassword
