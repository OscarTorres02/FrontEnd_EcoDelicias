import { useState } from "react";
import { Table, Input, Button, Popconfirm, message, Modal, Form } from "antd";
import useRecipes from "../../../hooks/useRecipes";
import type { Recipe } from "../../../hooks/useRecipes";
import { useAuth } from "../../../Context/AuthContext";

const RecipeTable = () => {
  const { recipes, deleteRecipe, updateRecipe, createRecipe } = useRecipes();
  const { state } = useAuth();
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const showEditModal = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsEditing(true);
    setIsModalOpen(true);
    form.setFieldsValue(recipe);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingRecipe(null);
  };

  const handleAddRecipe = async () => {
    try {
      const values = await form.validateFields();
      const success = await createRecipe({
        ...values,
        creationDate: new Date().toISOString(),
        userId: state.user?.id,
      });
      if (success) {
        message.success("Receta agregada correctamente.");
        closeModal();
      } else {
        message.error("Error al agregar la receta.");
      }
    } catch {
      message.error("Por favor complete todos los campos requeridos.");
    }
  };

  const handleUpdateRecipe = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecipe) {
        const success = await updateRecipe({ ...editingRecipe, ...values });
        if (success) {
          message.success("Receta actualizada correctamente.");
          closeModal();
        } else {
          message.error("Error al actualizar la receta.");
        }
      }
    } catch {
      message.error("Por favor complete todos los campos requeridos.");
    }
  };

  const handleDelete = async (id: number) => {
    const success = await deleteRecipe(id);
    if (success) {
      message.success("Receta eliminada correctamente.");
    } else {
      message.error("No se pudo eliminar la receta.");
    }
  };

  const columns = [
    { title: "Título", dataIndex: "title", key: "title" },
    { title: "Descripción", dataIndex: "description", key: "description" },
    { title: "Tiempo", dataIndex: "time", key: "time" },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: Recipe) => (
        <>
          {state.user?.userType === 1 && (
            <>
              <Button type="link" onClick={() => showEditModal(record)}>Editar</Button>
              <Popconfirm
                title="¿Eliminar esta receta?"
                onConfirm={() => handleDelete(record.recipesId)}
                okText="Sí"
                cancelText="No"
              >
                <Button type="link" danger>Eliminar</Button>
              </Popconfirm>
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <div>
      <Input
        placeholder="Buscar por título"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 300, marginBottom: 20 }}
      />

      {(state.user?.userType === 1 || state.user?.userType === 5) && (
        <Button type="primary" onClick={() => { setIsEditing(false); setIsModalOpen(true); form.resetFields(); }} style={{ marginBottom: 20 }}>
          Agregar Receta
        </Button>
      )}

      <Table
        columns={columns}
        dataSource={filteredRecipes}
        rowKey="recipesId"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={isEditing ? "Editar Receta" : "Agregar Receta"}
        open={isModalOpen}
        onOk={isEditing ? handleUpdateRecipe : handleAddRecipe}
        onCancel={closeModal}
        okText={isEditing ? "Actualizar" : "Agregar"}
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Título" rules={[{ required: true, message: "Ingrese el título" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Descripción" rules={[{ required: true }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="time" label="Tiempo" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="ingredients" label="Ingredientes" rules={[{ required: true }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="steps" label="Pasos" rules={[{ required: true }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="tips" label="Consejos">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="image" label="Imagen (URL)">
            <Input />
          </Form.Item>
          <Form.Item name="difficultyId" label="ID de Dificultad" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="categoryId" label="ID de Categoría" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RecipeTable;
