// src/components/screens/reportsScreen/ReportsScreen.tsx
import React from "react";
import { Spin, Alert, Row, Col, Card, Typography, Button } from "antd";
import useReports from "../../../hooks/useReports";
import type { AdminReportData } from "../../../hooks/useReports";

const { Title, Text } = Typography;

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

  const report = data as AdminReportData;

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Title level={3}>Reporte General</Title>
        <Button onClick={refresh}>Refrescar</Button>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <ReportCard title="Total de Usuarios" value={report.totalUsers} />
        </Col>
        <Col xs={24} md={6}>
          <ReportCard title="Total Categorías" value={report.totalCategories} />
        </Col>
        <Col xs={24} md={6}>
          <ReportCard title="Total Países" value={report.totalCountries} />
        </Col>
        <Col xs={24} md={6}>
          <ReportCard title="Total Dificultades" value={report.totalDifficulties} />
        </Col>
      </Row>
    </div>
  );
};

export default ReportsScreen;
