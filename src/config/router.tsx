import { ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminLayout from "../components/layouts/admin-layout";
import AuthLayout from "../components/layouts/auth-layout";
import CustomerLayout from "../components/layouts/customer-layout";
import NurseLayout from "../components/layouts/nurse-layout";
import PackageDetail from "../components/molecules/package-detail";
import { ADMIN_ROUTES, DOCTOR_ROUTES, NURSE_ROUTES, USER_ROUTES } from "../constants/routes";
import ManageOverview from "../pages/admin/manage-overview";
import ManagePackage from "../pages/admin/manage-package";
import ManagerServices from "../pages/admin/manage-services";
import ManageUsers from "../pages/admin/manage-users";
import About from "../pages/customer/about";
import Contact from "../pages/customer/contact";
import AdmissionAndDischargeProcess from "../pages/customer/guides/admission_and_discharge_process";
import MedicalExaminationProcess from "../pages/customer/guides/medical-examination-process";
import MethodOfPayingHospitalFees from "../pages/customer/guides/method-of-paying-hospital-fees/inddx";
import PrivacyPolicy from "../pages/customer/guides/privacy-policy";
import RightsOfPaitents from "../pages/customer/guides/rights-of-paitents";
import HomePage from "../pages/customer/home";
import Knowledge from "../pages/customer/knowledge";
import News from "../pages/customer/news";
import NewsDetail from "../pages/customer/news-detail";
import PurchasedHistory from "../pages/customer/purchased-history";
import Recruitment from "../pages/customer/recruitment";
import ResultPayment from "../pages/customer/result-payment";
import PaymentCancel from "../pages/customer/result-payment/payment-cancel";
import PaymentFailure from "../pages/customer/result-payment/payment-failure";
import PaymentSuccess from "../pages/customer/result-payment/payment-success";
import FullBirthPackage from "../pages/customer/services-detail/full-birth-package";
import PregnancyCheckUpPackage from "../pages/customer/services-detail/pregnancy-checkup-package";
import ServicesPage from "../pages/customer/services-page";
import Specialty from "../pages/customer/specialty";
import TeamOfDoctor from "../pages/customer/team-of-doctors";
import LoginPage from "../pages/login";
import FetalDetail from "../pages/nurse/fetal-detail";
import NurseManageOrders from "../pages/nurse/manage-orders";
import NurseManageUsers from "../pages/nurse/manage-users";
import RegisterPage from "../pages/register";
import DoctorLayout from "../components/layouts/doctor-layout";
import DoctorManageAppointments from "../pages/doctor/manage-appointments";
import FetailDetail from "../pages/doctor/fetal-detail";
import BookingDoctor from "../pages/customer/booking-doctor";
import AppointmentHistory from "../pages/customer/appointment-history";
import AdminManageMedicines from "../pages/admin/manage-medicines";
import NurseCheckIn from "../pages/nurse/checkin-appointment";
import WeekCheckup from "../pages/admin/week-checkup";
import FetalChart from "../pages/customer/fetal-chart";
import BlogPage from "../pages/customer/blog";
import BlogDetail from "../pages/customer/blog-detail";
import { message } from "antd";
import AdminManageCategory from "../pages/admin/manage-category";
import AdminManageBlogs from "../pages/admin/manage-blog";
import ManageSlot from "../pages/admin/manage-slot";
import Profile from "../pages/customer/profile";
import AvailableService from "../pages/customer/available-service";
import Reminder from "../pages/customer/reminder";
import DoctorManageCheckinAppointments from "../pages/doctor/check-in-appoinment";
import DoctorManageInprogressAppointments from "../pages/doctor/in-progress-appointment";
import AllFetail from "../pages/customer/all-fetail";
import NurseDashboard from "../pages/nurse/dashboard";
import AppoinmentDetail from "../pages/doctor/appointment-detail";
import NotFoundPage from "../pages/404";
import CancelAppointment from "../pages/nurse/cancel-appointment";
import PaymentBooking from "../components/molecules/payment-layout";
import ForgotPassword from "../pages/customer/forgot-password";
import Dashboard from "../pages/doctor/dashboard";
import NurseUpdateMotherRecord from "../pages/nurse/update-mother-record";
import ServicePurchasedHistory from "../pages/customer/service-purchased-history";



interface ProtectedRouteByRoleProps {
  children: ReactNode;
  allowedRoles: Array<"admin" | "user" | "nurse" | "doctor">; // Các vai trò cho phép
}

interface ProtectedRouteAuthProps {
  children: ReactNode;
}

const ProtectedRouteAuth: React.FC<ProtectedRouteAuthProps> = ({
  children,
}) => {
  const user = localStorage.getItem("USER");

  if (!user) {
    message.info("Bạn cần phải đăng nhập trước");
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

const getRedirectPathByRole = (role: string) => {
  switch (role) {
    case "admin":
      return "/admin";
    case "doctor":
      return "/doctor";
    case "nurse":
      return "/nurse";
    case "user":
      return "/";
    default:
      return "/";
  }
};

const ProtectedRouteByRole: React.FC<ProtectedRouteByRoleProps> = ({
  children,
  allowedRoles,
}) => {
  const user = localStorage.getItem("USER");

  if (!user) {
    message.info("Bạn cần đăng nhập trước");
    return <Navigate to="/auth/login" replace />;
  }

  const userData = JSON.parse(user);
  console.log("test", userData);

  if (!allowedRoles.includes(userData.role)) {
    const correctPath = getRedirectPathByRole(userData.role);
    message.warning("Bạn không có quyền truy cập, đang chuyển hướng...");
    return <Navigate to={correctPath} replace />;
  }

  return children;
};


export const router = createBrowserRouter([
  {
    path: USER_ROUTES.HOME,
    element: (
      <CustomerLayout />
    ),
    children: [
      {
        path: USER_ROUTES.HOME_PAGE,
        element: <HomePage />,
      },
      {
        path: USER_ROUTES.DOCTORS,
        element: <TeamOfDoctor />,
      },
      {
        path: USER_ROUTES.CONTACT,
        element: <Contact />,
      },
      {
        path: USER_ROUTES.ABOUT_PAGE,
        element: <About />,
      },
      {
        path: USER_ROUTES.SERVICES_PAGE,
        element: <ServicesPage />,
      },
      {
        path: USER_ROUTES.PACKAGE_DETAIL,
        element: <PackageDetail />,
      },
      {
        path: USER_ROUTES.SPECIALTY,
        element: <Specialty />,
      },
      {
        path: USER_ROUTES.NEWS_PAGE,
        element: <News />,
      },
      {
        path: USER_ROUTES.RECRUITMENT_PAGE,
        element: <Recruitment />,
      },
      {
        path: USER_ROUTES.MEDICAL_EXAMINATION_PROCESS,
        element: <MedicalExaminationProcess />,
      },
      {
        path: USER_ROUTES.ADMISSION_AND_DISCHARGE_PROCESS,
        element: <AdmissionAndDischargeProcess />,
      },
      {
        path: USER_ROUTES.RIGHTS_OF_PATIENTS_PAGE,
        element: <RightsOfPaitents />,
      },
      {
        path: USER_ROUTES.KNOWLEDGE_PAGE,
        element: <Knowledge />,
      },
      {
        path: USER_ROUTES.PRIVACY_POLICY_PAGE,
        element: <PrivacyPolicy />,
      },
      {
        path: USER_ROUTES.METHOD_OF_PAYING_HOSPITAL_FEES,
        element: <MethodOfPayingHospitalFees />,
      },
      {
        path: USER_ROUTES.PREGNANCY_CHECK_UP_PACKAGE,
        element: <PregnancyCheckUpPackage />,
      },
      {
        path: USER_ROUTES.FULL_BIRTH_PACKAGE,
        element: <FullBirthPackage />,
      },
      {
        path: USER_ROUTES.NEWS_DETAIL_PAGE,
        element: <NewsDetail />,
      },
      {
        path: USER_ROUTES.PURCHASED_HISTORY,
        element: <ProtectedRouteByRole allowedRoles={["user"]}>
          <PurchasedHistory />
        </ProtectedRouteByRole>,
      },
      {
        path: USER_ROUTES.SERVICES_PURCHASEED,
        element: <ProtectedRouteByRole allowedRoles={["user"]}>
          <ServicePurchasedHistory />
        </ProtectedRouteByRole>,
      },
      {
        path: '/reminders',
        element: <ProtectedRouteByRole allowedRoles={["user"]}>
          <Reminder />
        </ProtectedRouteByRole>,
      },
      {
        path: USER_ROUTES.BOOKING_DOCTOR,
        element: <ProtectedRouteByRole allowedRoles={["user"]}>
          <BookingDoctor />
        </ProtectedRouteByRole>,
      },
      {
        path: USER_ROUTES.APPOINTMENT_HISTORY,
        element: <ProtectedRouteByRole allowedRoles={["user"]}>
          <AppointmentHistory />
        </ProtectedRouteByRole>,
      },
      {
        path: USER_ROUTES.FETAL_CHART,
        element: <ProtectedRouteByRole allowedRoles={["user"]}>
          <FetalChart />
        </ProtectedRouteByRole>,
      },
      {
        path: USER_ROUTES.BLOG_PAGE,
        element: <BlogPage />,
      },
      {
        path: USER_ROUTES.BLOG_DETAIL,
        element: <BlogDetail />,
      },
      {
        path: USER_ROUTES.PROFILE,
        element: <ProtectedRouteAuth>
          <Profile />
        </ProtectedRouteAuth>,
      },
      {
        path: USER_ROUTES.MY_SERVICES,
        element: <ProtectedRouteByRole allowedRoles={["user"]}>
          <AvailableService />
        </ProtectedRouteByRole>,
      },
      {
        path: USER_ROUTES.ALL_FETAIL,
        element: <ProtectedRouteByRole allowedRoles={["user"]}>
          <AllFetail />
        </ProtectedRouteByRole>,
      },
    ],
  },
  {
    path: USER_ROUTES.AUTH,
    element: <AuthLayout />,
    children: [
      {
        path: USER_ROUTES.REGISTER,
        element: <RegisterPage />,
      },
      {
        path: USER_ROUTES.LOGIN,
        element: <LoginPage />,
      },
      {
        path: USER_ROUTES.FORGOT_PASSWORD,
        element: <ForgotPassword />,
      },
    ],
  },
  {
    path: "/test",
    element: (
      <ProtectedRouteByRole allowedRoles={["admin"]}>
        <div className="text-3xl font-bold underline ">Hi ADMIN</div>
      </ProtectedRouteByRole>
    ),
  },
  {
    path: ADMIN_ROUTES.ADMIN,
    element: (
      <ProtectedRouteByRole allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRouteByRole>
    ),
    children: [
      {
        path: ADMIN_ROUTES.USER,
        element: <ManageUsers />,
      },
      {
        path: ADMIN_ROUTES.OVERVIEW,
        element: <ManageOverview />,
      },
      {
        path: ADMIN_ROUTES.SERVICES,
        element: <ManagerServices />,
      },
      {
        path: ADMIN_ROUTES.PACKAGES,
        element: <ManagePackage />,
      },
      {
        path: ADMIN_ROUTES.MEDICINES,
        element: <AdminManageMedicines />,
      },
      {
        path: ADMIN_ROUTES.WEEK_CHECKUPS,
        element: <WeekCheckup />,
      },
      {
        path: ADMIN_ROUTES.CATEGORIES,
        element: <AdminManageCategory />,
      },
      {
        path: ADMIN_ROUTES.BLOGS,
        element: <AdminManageBlogs />,
      },
      {
        path: ADMIN_ROUTES.SLOTS,
        element: <ManageSlot />,
      },
    ],
  },
  {
    path: NURSE_ROUTES.NURSE,
    element: (
      <ProtectedRouteByRole allowedRoles={["nurse"]}>
        <NurseLayout />
      </ProtectedRouteByRole>
    ),
    children: [
      {
        path: NURSE_ROUTES.USER,
        element: <NurseManageUsers />,
      },
      {
        path: NURSE_ROUTES.ORDER,
        element: <NurseManageOrders />,
      },
      {
        path: NURSE_ROUTES.FETALS_DETAIL,
        element: <FetalDetail />,
      },
      {
        path: NURSE_ROUTES.NURSE_APPOINTMENT,
        element: <NurseCheckIn />,
      },
      {
        path: NURSE_ROUTES.NURSE_CANCEL_APPOINTMENT,
        element: <CancelAppointment />,
      },
      {
        path: NURSE_ROUTES.NURSE_UPDATE_MOTHER_RECORD,
        element: <NurseUpdateMotherRecord />,
      },
      {
        path: 'dashboard',
        element: <NurseDashboard />,
      },
    ],
  },
  {
    path: USER_ROUTES.BOOKING_RESULT,
    element: <PaymentBooking />,
  },
  {
    path: USER_ROUTES.PAYMENT, //payment/result
    element: <ResultPayment />,
  },
  {
    path: USER_ROUTES.PAYMENT_SUCCESS, //payment/success
    element: <PaymentSuccess />,
  },
  {
    path: USER_ROUTES.PAYMENT_CANCEL, //payment/cancel
    element: <PaymentCancel />,
  },
  {
    path: USER_ROUTES.PAYMENT_FAILURE, //payment/failure
    element: <PaymentFailure />,
  },


  {
    path: DOCTOR_ROUTES.DOCTOR,
    element: (
      <ProtectedRouteByRole allowedRoles={["doctor"]}>
        <DoctorLayout />
      </ProtectedRouteByRole>
    ),
    children: [
      {
        path: DOCTOR_ROUTES.APPOINTMENT,
        element: <DoctorManageAppointments />,
      },
      {
        path: DOCTOR_ROUTES.CHECK_IN_APPOINTMENT,
        element: <DoctorManageCheckinAppointments />,
      },
      {
        path: DOCTOR_ROUTES.IN_PROGRESS_APPOINTMENT,
        element: <DoctorManageInprogressAppointments />,
      },
      {
        path: DOCTOR_ROUTES.FETALS_DETAIL,
        element: <FetailDetail />,
      },
      {
        path: DOCTOR_ROUTES.CHECK_IN_APPOINTMENT_DETAIL,
        element: <AppoinmentDetail />,
      },
      {
        path: DOCTOR_ROUTES.IN_PROGRESS_APPOINTMENT_DETAIL,
        element: <AppoinmentDetail />,
      },

      {
        path: 'dashboard',
        element: <Dashboard />,
      },
    ],

  },
  {
    path: "*",
    element: <NotFoundPage />,
  },

]);
