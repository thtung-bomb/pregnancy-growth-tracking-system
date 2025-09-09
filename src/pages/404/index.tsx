import { Button } from "antd";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div className="text-center mt-10">
            <h1 className="text-4xl font-bold text-red-500">404 - Không tìm thấy trang</h1>
            <p className="text-lg mt-4">Trang bạn đang tìm kiếm không tồn tại.</p>
            <Link to='/'>
                <Button className="mt-4">
                    Quay lại trang chủ
                </Button>
            </Link>
        </div>
    );
};

export default NotFoundPage;
