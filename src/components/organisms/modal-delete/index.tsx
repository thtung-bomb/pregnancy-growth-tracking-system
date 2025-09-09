import { Button, Modal } from 'antd';

export interface ModalDeleteProps {
    name: string;
    isModalOpenDelete: boolean;
    handleOkModalDelete: () => Promise<void>;
    handleCancelModalDelete: () => void;
}

const ModalDelete = ({ name, isModalOpenDelete, handleOkModalDelete, handleCancelModalDelete }: ModalDeleteProps) => {
    return (
        <Modal
            footer={
                <>
                    <Button onClick={handleOkModalDelete} type="primary" >
                        Xoá
                    </Button>
                </>
            }
            title={`Xóa ${name}`}
            open={isModalOpenDelete}
            onCancel={handleCancelModalDelete}
        >
            <p>Bạn có chắc chắn muốn xóa {name}?</p>
        </Modal>
    );
}

export default ModalDelete;