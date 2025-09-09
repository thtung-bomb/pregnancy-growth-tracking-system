import { useEffect, useState } from 'react';
import usePackageService from '../../../services/usePackageService';
import ServicePackage from '../../molecules/service-package';
import { Package } from '../../../model/Pakage';
import useOrderService from '../../../services/useOrderService';
import { getUserDataFromLocalStorage } from '../../../constants/function';

const ServicesPackageList = () => {
    const [servicePackages, setServicePackages] = useState<Package[]>([]);
    const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
    const { getPackages } = usePackageService();
    const { getOrderByUserId, getOrdersOfUser } = useOrderService();
    const user = getUserDataFromLocalStorage()

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Lấy user từ localStorage
                const user = JSON.parse(localStorage.getItem("USER") || "{}");

                if (!user || !user.id) {
                    // Nếu không có user, chỉ lấy tất cả packages mà không lọc
                    const packages = await getPackages();
                    setServicePackages(packages);
                    setFilteredPackages(packages); // Hiển thị tất cả packages
                    console.error("Không tìm thấy userId trong localStorage.");
                    return;
                }

                const userId = user.id;

                // Gọi API lấy danh sách gói dịch vụ & đơn hàng của user
                const [packages, orders] = await Promise.all([
                    getPackages(),
                    getOrderByUserId(userId),
                ]);

                setServicePackages(packages);

                // Lấy danh sách ID các package đã mua
                const purchasedPackageIds = new Set(
                    orders.map((order: any) => order.package.id)
                );

                // Lọc ra các package chưa được mua
                const availablePackages = packages.filter(
                    (pkg: Package) => !purchasedPackageIds.has(pkg.id)
                );

                setFilteredPackages(availablePackages);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='flex flex-col gap-3 justify-center'>
            <div className='w-full rounded-e-md rounded-s-lg bg-[#cdbbfd] bg-gradient-to-r from-[#eaafc8] to-[#654ea3]'>
                <p className='text-4xl font-bold font-sans py-10 text-center text-slate-100'>
                    Các gói dịch vụ
                </p>
            </div>
            <div className='grid grid-cols-3 gap-5'>
                {filteredPackages.map((item: Package) => (
                    <div key={item.id}>
                        <ServicePackage servicePackage={item} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServicesPackageList;
