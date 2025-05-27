// src/Components/screens/reportsScreen/ReportsScreen.tsx

import React from "react";
import {
  Spin,
  Alert,
  Row,
  Col,
  Card,
  Typography,
  Button,
} from "antd";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useReports from "../../../hooks/useReports";
import type { AdminReportData } from "../../../hooks/useReports";

const { Title, Text } = Typography;
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF4D4F"];

const ReportCard = ({ title, value }: { title: string; value: number }) => (
  <Card
    style={{
      textAlign: "center",
      borderRadius: 12,
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    }}
  >
    <Text type="secondary">{title}</Text>
    <Title level={2}>{value}</Title>
  </Card>
);

const ReportsScreen: React.FC = () => {
  const { data, loading, error, refresh } = useReports();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        message="Error al cargar reportes"
        description={error}
        showIcon
        style={{ margin: 20 }}
      />
    );
  }

  if (!data) return null;

  const {
    totalUsers,
    totalCategories,
    totalCountries,
    totalDifficulties,
    recipes,
    categories,
    difficulties,
    countries,
    users
  } = data as AdminReportData;

  // Dificultades
  const difficultyCounts: { [key: number]: number } = {};
  recipes.forEach((rec) => {
    difficultyCounts[rec.difficultyId] = (difficultyCounts[rec.difficultyId] || 0) + 1;
  });

  const difficultiesData = difficulties
    .filter((d) => difficultyCounts[d.difficultyId])
    .map((d) => ({
      name: d.difficulty,
      value: difficultyCounts[d.difficultyId],
    }));

  // Países: se vinculan recetas con usuarios para obtener el país
  const userMap = new Map(users.map(user => [user.userId, user.countryId]));
  const countryCounts: { [key: number]: number } = {};
  recipes.forEach((rec) => {
    const countryId = userMap.get(rec.userId);
    if (countryId !== undefined) {
      countryCounts[countryId] = (countryCounts[countryId] || 0) + 1;
    }
  });

  const countriesData = Object.entries(countryCounts).map(([id, count]) => {
    const country = countries.find(c => c.countryId === Number(id));
    return {
      name: country ? country.country : `País ${id}`,
      value: count
    };
  });

  // Categorías
  const categoryBarData = categories.map((cat) => ({
    name: cat.category,
    cantidad: recipes.filter((rec) => rec.categoryId === cat.categoryId).length,
  }));

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Title level={3}>Dashboard de Reportes</Title>
        <Button onClick={refresh}>Refrescar</Button>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}><ReportCard title="Total de Usuarios" value={totalUsers} /></Col>
        <Col xs={24} md={6}><ReportCard title="Total Categorías" value={totalCategories} /></Col>
        <Col xs={24} md={6}><ReportCard title="Total Países" value={totalCountries} /></Col>
        <Col xs={24} md={6}><ReportCard title="Total Dificultades" value={totalDifficulties} /></Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
        <Col xs={24} md={12}>
          <Card title="Recetas por País (Pastel)">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={countriesData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80} label>
                  {countriesData.map((_, idx) => (
                    <Cell key={`cell-country-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Recetas por Dificultad (Pastel)">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={difficultiesData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80} label>
                  {difficultiesData.map((_, idx) => (
                    <Cell key={`cell-diff-${idx}`} fill={COLORS[(idx + 1) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 32 }}>
        <Col span={24}>
          <Card title="Cantidad de Recetas por Categoría (Barras)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryBarData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="cantidad" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ReportsScreen;
