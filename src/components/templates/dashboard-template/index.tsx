import { Button, Form, Input, message, Modal, Popconfirm, Table } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../config/api";
// import UploadFileComponent from "../../atoms/upload-file";
import moment from "moment";

export interface Column {
  title: string;
  dataIndex: string;
  key: string;
  render?: (value: any, record: any, arr: any) => JSX.Element;
}

export interface RecordData {
  id: string;
  code: string;
  name: string;
  dateFrom: string; // Adjust types as necessary
  dateTo: string; // Adjust types as necessary
  status: string; // Adjust types as necessary
}

export interface DashboardTemplateProps {
  isImport?: boolean;
  title: string;
  columns: Column[];
  formItems: React.ReactNode;
  apiURI: string;
  isCustom?: boolean;
  isReload?: boolean;
  isConfig?: boolean;
  isRequest?: boolean;
  isNotDelete?: boolean;
}

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  isImport = false,
  isCustom = false,
  isConfig = false,
  isNotDelete = false,
  isRequest = false,
  isReload,
  columns,
  title,
  formItems,
  apiURI,
}) => {
  const [dataSource, setDataSource] = useState<RecordData[]>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [formTag] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [tableColumns, setTableColumns] = useState<Column[]>([]);

  useEffect(() => {
    const newColumns: Column[] = [
      ...columns,
      ...(isCustom
        ? []
        : [
          {
            title: "Action",
            dataIndex: "id",
            key: "id",
            render: (id: string, record: any) => (
              <div style={{ gap: "10px", display: "flex" }}>
                {!isNotDelete && (
                  <>
                    <Popconfirm
                      title={`Delete ${title}`}
                      onConfirm={() => handleDelete(id)}
                    >
                      <Button type="primary" danger>
                        Delete
                      </Button>
                    </Popconfirm>
                    <span style={{ margin: "10px 5px" }}>|</span>
                  </>
                )}
                <Button
                  type="primary"
                  style={{ backgroundColor: "orange" }}
                  onClick={() => {
                    setIsUpdate(true);
                    if (record?.dateTo && record.dateFrom) {
                      formTag.setFieldsValue({
                        ...record,
                        dateFrom: moment(record.dateFrom),
                        dateTo: moment(record.dateTo),
                      });
                    } else {
                      formTag.setFieldsValue({ ...record, id });
                    }
                    handleOpenModal();
                  }}
                >
                  Update
                </Button>
              </div>
            ),
          },
        ]),
    ];
    setTableColumns(newColumns);
  }, [columns, title, formTag, isCustom]);

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const response = await api.get(apiURI);
      console.log(apiURI);
      let formatData = response.data.data.content || response.data.data;
      console.log("formatData: ", formatData)
      if (!Array.isArray(formatData)) {
        formatData = [formatData];
      }

      // Filter data only when the apiURI is 'admin'
      if (apiURI === "admin") {
        formatData = formatData.filter((item: any) => item?.role !== "ADMIN"); // Ensure the condition matches only 'ADMIN' role
      }

      setDataSource(formatData);
    } catch (err: any) {
      message.error(err.response?.data || "An error occurred");
    } finally {
      setIsFetching(false);
    }
  };

  // useEffect(() => {
  //   fetchData();
  // }, [isReload]);

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const handleSubmitForm = async (values: any) => {
    setLoading(true);
    if (values.minTimeSlotDuration) {
      values.minTimeSlotDuration = `PT${values.minTimeSlotDuration}M`;
    }
    try {
      const formattedValues = {
        ...values,
        dateFrom: values.dateFrom
          ? values.dateFrom.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
          : null,
        dateTo: values.dateTo
          ? values.dateTo.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
          : null,
      };

      const apiData =
        values.dateFrom && values.dateTo ? formattedValues : values;

      const apiCall = values.id
        ? api.put(`${apiURI}/${values.id}`, apiData)
        : api.post(apiURI, apiData);

      await apiCall;
      message.success(values.id ? "Chỉnh sửa thành công" : "Thêm thành công !!");

      formTag.resetFields();
      handleCloseModal();
      fetchData();
    } catch (error: any) {
      const errorMessage = error.response?.data || "Failed to submit form";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`${apiURI}/${id}`);
      message.success("Deleted successfully");
      fetchData();
    } catch (err: any) {
      message.error(err.response?.data || "Failed to delete item");
    }
  };

  const handleAccept = async (record: any) => {
    try {
      await api.post(`${apiURI}/${record.id}/accept`); // Giả sử endpoint để Accept là như thế này
      toast.success("Accepted successfully");
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data || "Failed to accept");
    }
  };

  const handleReject = async (record: any) => {
    try {
      await api.post(`${apiURI}/${record.id}/reject`); // Giả sử endpoint để Reject là như thế này
      toast.success("Rejected successfully");
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data || "Failed to reject");
    }
  };

  return (
    <div>
      {/* {isImport ? (
        <UploadFileComponent fetchData={fetchData} />
      ) : (
        !isRequest && (
          <Button onClick={() => handleOpenModal()} type="primary">
            Thiết lập {title}
          </Button>
        )
      )} */}

      {
        !isRequest && (
          <Button onClick={() => handleOpenModal()} type="primary">
            Thiết lập {title}
          </Button>
        )
      }

      <Table
        columns={tableColumns}
        dataSource={dataSource}
        loading={isFetching}
      />
      <Modal
        open={isOpenModal}
        title={`${isUpdate ? "Edit" : "Thiết lập "} ${title}`}
        onCancel={handleCloseModal}
        footer={[
          <Button key="back" onClick={handleCloseModal}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => formTag.submit()}
          >
            Save
          </Button>,
        ]}
      >
        <Form form={formTag} onFinish={handleSubmitForm}>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          {formItems}
        </Form>
      </Modal>
    </div>
  );
};

export default DashboardTemplate;
