import { Spin } from "antd"
import { LoadingOutlined } from '@ant-design/icons';

const Loading = () => {
  return (
    <div className="flex justify-center min-h-screen items-center">
      <Spin indicator={<LoadingOutlined spin />} size="large" />
    </div>
  )
}

export default Loading
