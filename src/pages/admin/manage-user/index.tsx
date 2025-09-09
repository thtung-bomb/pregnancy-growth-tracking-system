import DashboardTemplate, {
  Column,
} from "../../../components/templates/dashboard-template";
import { Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
// import { ADMIN_API } from "../../../constants/endpoints";

function ManageUser() {
  const title = "user";
  const columns: Column[] = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => <span>{index + 1}</span>,
    },
    {
      title: "FullName",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "StudentCode",
      dataIndex: "studentCode",
      key: "studentCode",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    // {
    //   title: "Role",
    //   dataIndex: "role",
    //   key: "role",
    //   filters: [
    //     { text: "MENTOR", value: "MENTOR" },
    //     { text: "STUDENT", value: "STUDENT" },
    //   ],
    //   onFilter: (value, record) => record.role === value,
    // },
  ];

  const formItems = (
    <>
      <Form.Item label="Enter name" name={"name"}>
        <Input />
      </Form.Item>
      <Form.Item label="Enter description" name={"description"}>
        <TextArea />
      </Form.Item>
    </>
  );

  return (
    <div>
      <DashboardTemplate
        isCustom
        isImport
        // apiURI={ADMIN_API.ADMIN}
        apiURI={"users"}
        formItems={formItems}
        title={title}
        columns={columns}
      />
    </div>
  );
}

export default ManageUser;
