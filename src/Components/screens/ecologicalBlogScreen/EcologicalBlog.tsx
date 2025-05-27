import React, { useState } from "react";
import {
  Input,
  Button,
  Modal,
  Form,
  Card,
  Row,
  Col,
  message,
  Popconfirm,
  Space,
} from "antd";
import useEcologicalBlogs from "../../../hooks/useEcologicalBlog";
import type { EcologicalBlog } from "../../../hooks/useEcologicalBlog";
import { useAuth } from "../../../Context/AuthContext";

const { Meta } = Card;

const EcologicalBlogCard: React.FC<{
  blog: EcologicalBlog;
  onEdit: (blog: EcologicalBlog) => void;
  onDelete: (id: number) => void;
  isAdmin: boolean;
}> = ({ blog, onEdit, onDelete, isAdmin }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded((prev) => !prev);

  const shortDescription =
    blog.description.length > 120
      ? blog.description.slice(0, 120) + "..."
      : blog.description;

  return (
    <Card
      hoverable
      cover={
        blog.image ? (
          <img
            alt={blog.title}
            src={blog.image}
            style={{ height: 180, objectFit: "cover", borderRadius: "6px 6px 0 0" }}
            loading="lazy"
          />
        ) : null
      }
      actions={
        isAdmin
          ? [
              <Button type="link" key="edit" onClick={() => onEdit(blog)}>
                Editar
              </Button>,
              <Popconfirm
                key="delete"
                title="¿Eliminar blog?"
                onConfirm={() => onDelete(blog.ecologicalBlogId)}
                okText="Sí"
                cancelText="No"
              >
                <Button type="link" danger>
                  Eliminar
                </Button>
              </Popconfirm>,
            ]
          : []
      }
      style={{ borderRadius: 6, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
    >
      <Meta
        title={blog.title}
        description={
          <>
            <p>
              <strong>Descubrimiento:</strong> {blog.discover}
            </p>
            <p style={{ marginTop: 8, color: "#555" }}>
              {expanded ? blog.description : shortDescription}
              {blog.description.length > 120 && (
                <Button
                  type="link"
                  onClick={toggleExpanded}
                  style={{ padding: 0, marginLeft: 4 }}
                >
                  {expanded ? "Ver menos" : "Ver más"}
                </Button>
              )}
            </p>
          </>
        }
      />
    </Card>
  );
};

const EcologicalBlogTable: React.FC = () => {
  const { blogs, deleteBlog, updateBlog, createBlog } = useEcologicalBlogs();
  const { state } = useAuth();
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [editingBlog, setEditingBlog] = useState<EcologicalBlog | null>(null);

  // Filtrar blogs por título
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const showEditModal = (blog: EcologicalBlog) => {
    setEditingBlog(blog);
    setIsEditing(true);
    setIsModalOpen(true);
    form.setFieldsValue(blog);
  };

  const showModal = () => {
    setIsEditing(false);
    setIsModalOpen(true);
    form.resetFields();
    setEditingBlog(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingBlog(null);
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

  const handleAddBlog = async () => {
    try {
      const newBlog = await form.validateFields();
      const success = await createBlog({
        ...newBlog,
        userId: state.user?.id ?? 0,
        postDate: new Date().toISOString(),
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

  const handleDelete = async (id: number) => {
    const success = await deleteBlog(id);
    if (success) {
      message.success("Blog eliminado");
    } else {
      message.error("No se pudo eliminar");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Space
        wrap
        style={{ marginBottom: 24, justifyContent: "space-between", width: "100%" }}
      >
        <Input.Search
          placeholder="Buscar blog por título"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          style={{ width: 300 }}
        />
        {state.user?.userType === 1 && (
          <Button type="primary" onClick={showModal}>
            Agregar Blog
          </Button>
        )}
      </Space>

      {filteredBlogs.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: 100, color: "#999" }}>
          No se encontraron blogs
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {filteredBlogs.map((blog) => (
            <Col key={blog.ecologicalBlogId} xs={24} sm={12} md={8} lg={6}>
              <EcologicalBlogCard
                blog={blog}
                onEdit={showEditModal}
                onDelete={handleDelete}
                isAdmin={state.user?.userType === 1}
              />
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title={isEditing ? "Editar Blog" : "Agregar Nuevo Blog"}
        open={isModalOpen}
        onOk={isEditing ? handleUpdateBlog : handleAddBlog}
        onCancel={closeModal}
        okText={isEditing ? "Actualizar" : "Agregar"}
        cancelText="Cancelar"
        destroyOnClose
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
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EcologicalBlogTable;
