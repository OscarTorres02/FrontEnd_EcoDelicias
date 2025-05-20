// src/components/screens/reportsScreen/ReportsScreen.tsx
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
  ResponsiveContainer,
} from "recharts";
import useReports from "../../../hooks/useReports";
import type { AdminReportData } from "../../../hooks/useReports";

const { Title, Text } = Typography;
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
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

  const { totalUsers, totalCategories, totalCountries, totalDifficulties } =
    data as AdminReportData;

  // Datos para los dos pasteles
  const countriesData = [{ name: "Países", value: totalCountries }];
  const difficultiesData = [{ name: "Dificultades", value: totalDifficulties }];

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Title level={3}>Reporte General</Title>
        <Button onClick={refresh}>Refrescar</Button>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <ReportCard title="Total de Usuarios" value={totalUsers} />
        </Col>
        <Col xs={24} md={6}>
          <ReportCard title="Total Categorías" value={totalCategories} />
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
        <Col xs={24} md={12}>
          <Card title="Total Países (Pastel)">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={countriesData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={40}
                  outerRadius={80}
                  label
                >
                  {countriesData.map((_, idx) => (
                    <Cell
                      key={`cell-country-${idx}`}
                      fill={COLORS[idx % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Total Dificultades (Pastel)">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={difficultiesData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={40}
                  outerRadius={80}
                  label
                >
                  {difficultiesData.map((_, idx) => (
                    <Cell
                      key={`cell-diff-${idx}`}
                      fill={COLORS[(idx + 1) % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ReportsScreen;
