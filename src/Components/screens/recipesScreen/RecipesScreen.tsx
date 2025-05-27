import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  message,
  Modal,
  Form,
  Card,
  Row,
  Col,
  Collapse,
  Empty,
  Space,
  Select,
  Tag,
} from "antd";
import { RightOutlined, DownOutlined, PlusOutlined } from "@ant-design/icons";
import useRecipes from "../../../hooks/useRecipes";
import type { Recipe } from "../../../hooks/useRecipes";
import { useAuth } from "../../../Context/AuthContext";

const { Panel } = Collapse;
const { Meta } = Card;
const { Option } = Select;

interface Category { categoryId: number; category: string; }
interface Difficulty { difficultyId: number; difficulty: string; }

const RecipesScreen: React.FC = () => {
  const { recipes, deleteRecipe, updateRecipe, createRecipe } = useRecipes();
  const { state } = useAuth();

  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);

  useEffect(() => {
    const base = import.meta.env.VITE_REACT_APP_API_URL || "https://ecodelicias.somee.com/api";

    fetch(`${base}/ControllerCategory`)
      .then((res) => res.json())
      .then((data: Category[]) => setCategories(data))
      .catch(console.error);

    fetch(`${base}/ControllerDifficulty`)
      .then((res) => res.json())
      .then((data: Difficulty[]) => setDifficulties(data))
      .catch(console.error);
  }, []);

  const filteredRecipes = recipes.filter((r) => {
    const matchesText = r.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory ? r.categoryId === selectedCategory : true;
    const matchesDifficulty = selectedDifficulty ? r.difficultyId === selectedDifficulty : true;
    return matchesText && matchesCategory && matchesDifficulty;
  });

  const showEditModal = (r?: Recipe) => {
    if (r) {
      setIsEditing(true);
      setEditingRecipe(r);
      form.setFieldsValue(r);
    } else {
      setIsEditing(false);
      setEditingRecipe(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingRecipe(null);
  };

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      const ok = await createRecipe({
        ...values,
        creationDate: new Date().toISOString(),
        userId: state.user?.id,
      });
      ok ? message.success("Receta agregada") : message.error("Error al agregar");
      closeModal();
    } catch {}
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecipe) {
        const ok = await updateRecipe({ ...editingRecipe, ...values });
        ok
          ? message.success("Receta actualizada")
          : message.error("Error al actualizar");
        closeModal();
      }
    } catch {}
  };

  const handleDelete = async (id: number) => {
    const ok = await deleteRecipe(id);
    ok ? message.success("Receta eliminada") : message.error("Error al eliminar");
  };

  const getCategoryName = (id: number) =>
    categories.find((c) => c.categoryId === id)?.category || "—";
  const getDifficultyName = (id: number) =>
    difficulties.find((d) => d.difficultyId === id)?.difficulty || "—";

  return (
    <div style={{ padding: 24 }}>
      <Space wrap style={{ marginBottom: 24 }}>
        <Input.Search
          placeholder="Buscar recetas"
          allowClear
          onSearch={(v) => setSearchText(v)}
          style={{ width: 300 }}
        />
        <Select
          placeholder="Filtrar por categoría"
          allowClear
          style={{ width: 200 }}
          onChange={(value) => setSelectedCategory(value)}
          value={selectedCategory}
        >
          {categories.map((c) => (
            <Option key={c.categoryId} value={c.categoryId}>
              {c.category}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Filtrar por dificultad"
          allowClear
          style={{ width: 200 }}
          onChange={(value) => setSelectedDifficulty(value)}
          value={selectedDifficulty}
        >
          {difficulties.map((d) => (
            <Option key={d.difficultyId} value={d.difficultyId}>
              {d.difficulty}
            </Option>
          ))}
        </Select>
        {(state.user?.userType === 1 || state.user?.userType === 5) && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showEditModal()}
          >
            Nueva Receta
          </Button>
        )}
      </Space>

      {filteredRecipes.length === 0 ? (
        <Empty description="No hay recetas" style={{ marginTop: 100 }} />
      ) : (
        <Row gutter={[24, 24]}>
          {filteredRecipes.map((rec) => (
            <Col key={rec.recipesId} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={
                  rec.image && (
                    <img
                      alt={rec.title}
                      src={rec.image}
                      style={{
                        height: 160,
                        objectFit: "cover",
                        borderTopLeftRadius: 4,
                        borderTopRightRadius: 4,
                      }}
                      loading="lazy"
                    />
                  )
                }
                actions={
                  state.user &&
                  (state.user.userType === 1 || state.user.userType === 5)
                    ? [
                        <Button type="link" onClick={() => showEditModal(rec)}>
                          Editar
                        </Button>,
                        <Button
                          type="link"
                          danger
                          onClick={() => handleDelete(rec.recipesId)}
                        >
                          Eliminar
                        </Button>,
                      ]
                    : []
                }
                style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
              >
                <Meta
                  title={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>{rec.title}</span>
                      <span style={{ fontWeight: 500, color: "#555" }}>
                        {rec.time}
                      </span>
                    </div>
                  }
                  description={
                    <div style={{ marginTop: 8, color: "#666", fontSize: 14 }}>
                      {rec.description.length > 80
                        ? rec.description.slice(0, 80) + "..."
                        : rec.description}
                    </div>
                  }
                />
                <div style={{ marginTop: 12 }}>
                  <Tag color="blue">{getCategoryName(rec.categoryId)}</Tag>
                  <Tag color="green">{getDifficultyName(rec.difficultyId)}</Tag>
                </div>
                <Collapse
                  expandIconPosition="right"
                  bordered={false}
                  style={{ marginTop: 16 }}
                  expandIcon={({ isActive }) =>
                    isActive ? <DownOutlined /> : <RightOutlined />
                  }
                >
                  <Panel header="Ver detalles" key="1">
                    <div style={{ marginBottom: 12 }}>
                      <strong>Ingredientes:</strong>
                      <ul style={{ paddingLeft: 16, margin: "8px 0" }}>
                        {rec.ingredients.split("\n").map((ing, i) => (
                          <li key={i}>{ing.trim()}</li>
                        ))}
                      </ul>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <strong>Pasos:</strong>
                      <ol style={{ paddingLeft: 16, margin: "8px 0" }}>
                        {rec.steps.split("\n").map((st, i) => (
                          <li key={i}>{st.trim()}</li>
                        ))}
                      </ol>
                    </div>
                    <div>
                      <strong>Tips:</strong>
                      <p style={{ margin: "8px 0", color: "#444" }}>
                        {rec.tips || <i>— Sin tips —</i>}
                      </p>
                    </div>
                  </Panel>
                </Collapse>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title={isEditing ? "Editar Receta" : "Agregar Receta"}
        open={isModalOpen}
        onOk={isEditing ? handleUpdate : handleAdd}
        onCancel={closeModal}
        okText={isEditing ? "Actualizar" : "Agregar"}
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Título" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="image"
            label="URL de Imagen"
            extra="Pegue aquí el link directo a la imagen"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Descripción"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="time" label="Tiempo" rules={[{ required: true }]}>
            <Input placeholder="Ej: 30 min" />
          </Form.Item>
          <Form.Item
            name="ingredients"
            label="Ingredientes"
            rules={[{ required: true }]}
            extra="Cada línea será un ítem de la lista"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="steps"
            label="Pasos"
            rules={[{ required: true }]}
            extra="Cada línea será un paso numerado"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="tips" label="Tips">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="categoryId"
                label="Categoría"
                rules={[{ required: true, message: "Selecciona una categoría" }]}
              >
                <Select placeholder="Categoría">
                  {categories.map((c) => (
                    <Option key={c.categoryId} value={c.categoryId}>
                      {c.category}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="difficultyId"
                label="Nivel de dificultad"
                rules={[{ required: true, message: "Selecciona un nivel" }]}
              >
                <Select placeholder="Dificultad">
                  {difficulties.map((d) => (
                    <Option key={d.difficultyId} value={d.difficultyId}>
                      {d.difficulty}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default RecipesScreen;
