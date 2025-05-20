import { useState } from "react";
import { Table, Input, Button, Popconfirm, message, Modal, Form } from "antd";
import useEcologicalBlogs from "../../../hooks/useEcologicalBlog";
import type { EcologicalBlog } from "../../../hooks/useEcologicalBlog";
import { useAuth } from "../../../Context/AuthContext";

const EcologicalBlogTable = () => {
  const { blogs, deleteBlog, updateBlog, createBlog } = useEcologicalBlogs();
  const { state } = useAuth();
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [editingBlog, setEditingBlog] = useState<EcologicalBlog | null>(null);

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const showEditModal = (blog: EcologicalBlog) => {
    setEditingBlog(blog);
    setIsEditing(true);
    setIsModalOpen(true);
    form.setFieldsValue(blog);
  };

  const handleUpdateBlog = async () => {
    try {
      const updated = await form.validateFields();
      if (editingBlog) {
        const success = await updateBlog({ ...editingBlog, ...updated });
        if (success) {
          message.success("Blog actualizado");
          closeModal();
        } else {
          message.error("Error al actualizar");
        }
      }
    } catch {
      message.error("Por favor completa todos los campos");
    }
  };

  const showModal = () => {
    setIsEditing(false);
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleAddBlog = async () => {
    try {
      const newBlog = await form.validateFields();
      const success = await createBlog({
        ...newBlog,
        userId: state.user?.id ?? 0,
        postDate: new Date().toISOString()
      });
      if (success) {
        message.success("Blog creado");
        closeModal();
      } else {
        message.error("Error al crear el blog");
      }
    } catch {
      message.error("Por favor completa todos los campos");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingBlog(null);
  };

  const handleDelete = async (id: number) => {
    const success = await deleteBlog(id);
    if (success) {
      message.success("Blog eliminado");
    } else {
      message.error("No se pudo eliminar");
    }
  };

  const columns = [
    { title: "Título", dataIndex: "title", key: "title" },
    { title: "Descubrimiento", dataIndex: "discover", key: "discover" },
    { title: "Descripción", dataIndex: "description", key: "description" },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: EcologicalBlog) => (
        <>
          {state.user?.userType === 1 && (
            <>
              <Button type="link" onClick={() => showEditModal(record)}>Editar</Button>
              <Popconfirm
                title="¿Eliminar blog?"
                onConfirm={() => handleDelete(record.ecologicalBlogId)}
                okText="Sí" cancelText="No"
              >
                <Button type="link" danger>Eliminar</Button>
              </Popconfirm>
            </>
          )}
        </>
      )
    }
  ];

  return (
    <div>
      <Input
        placeholder="Buscar blog por título"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 300, marginBottom: 20 }}
      />
      {state.user?.userType === 1 && (
        <Button type="primary" onClick={showModal} style={{ marginBottom: 20 }}>
          Agregar Blog
        </Button>
      )}
      <Table
        columns={columns}
        dataSource={filteredBlogs}
        rowKey="ecologicalBlogId"
        pagination={{ pageSize: 5 }}
      />
      <Modal
        title={isEditing ? "Editar Blog" : "Agregar Nuevo Blog"}
        open={isModalOpen}
        onOk={isEditing ? handleUpdateBlog : handleAddBlog}
        onCancel={closeModal}
        okText={isEditing ? "Actualizar" : "Agregar"}
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Título" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="image" label="URL Imagen" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="discover" label="Descubrimiento" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Descripción" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EcologicalBlogTable;
