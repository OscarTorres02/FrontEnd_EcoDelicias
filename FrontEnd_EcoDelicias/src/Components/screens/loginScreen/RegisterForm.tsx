// src/components/screens/loginScreen/RegisterForm.tsx
import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  message,
  Checkbox,
  Modal,
} from 'antd';
import { ZodError } from 'zod';
import { registerSchema } from '../../../assets/lib/zod/register';
import axios from 'axios';
import './LoginScreen.css';

const { Option } = Select;

interface Gender {
  genderId: number;
  gender: string;
}
interface Country {
  countryId: number;
  country: string;
}
interface UserType {
  userTypeId: number;
  userType: string;
}

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [genders, setGenders] = useState<Gender[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [userTypes, setUserTypes] = useState<UserType[]>([]);

  useEffect(() => {
    axios.get<Gender[]>('http://ecodelicias.somee.com/api/ControllerGender')
      .then(r => setGenders(r.data))
      .catch(() => message.error('Error al cargar los géneros'));

    axios.get<Country[]>('http://ecodelicias.somee.com/api/ControllerCountry')
      .then(r => setCountries(r.data))
      .catch(() => message.error('Error al cargar los países'));

    axios.get<UserType[]>('http://ecodelicias.somee.com/api/ControllerUserType')
      .then(r => setUserTypes(r.data))
      .catch(() => message.error('Error al cargar tipos de usuario'));
  }, []);

  const onFinish = async (values: any) => {
  console.log("📥 onFinish values:", values);

  // Construye el payload
  const userData = {
    names: values.nombres,
    lastnames: values.apellidos,      // OJO: coincide con lo que tu API espera (“lastnames” en minúscula)
    email: values.email,
    phone: Number(values.contacto),
    genderId: Number(values.genero),
    countryId: Number(values.pais),
    userTypeId: Number(values.tipoUsuario),
    password: values.password,
    creationDate: new Date().toISOString(),
  };
  console.log("📤 userData a enviar:", userData);

  try {
    const resp = await axios.post(
      'https://ecodelicias.somee.com/api/ControllerUser',
      userData,
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log("✅ respuesta del servidor:", resp.status, resp.data);
    message.success('Registro exitoso');
    form.resetFields();
    setAcceptedTerms(false);
    onSuccess?.();
  } catch (err: any) {
    console.error("❌ Error en Axios:", err);
    if (axios.isAxiosError(err)) {
      message.error(err.response?.data?.message || err.message);
    } else {
      message.error('Error inesperado, inténtalo de nuevo');
    }
  }
};

  return (
    <>
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        className="register-form"
      >
        <Form.Item
          label="Nombres"
          name="nombres"
          rules={[{ required: true, message: 'Por favor ingrese sus nombres' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Apellidos"
          name="apellidos"
          rules={[{ required: true, message: 'Por favor ingrese sus apellidos' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Género"
          name="genero"
          rules={[{ required: true, message: 'Por favor seleccione su género' }]}
        >
          <Select placeholder="Seleccione su género">
            {genders.map(g => (
              <Option key={g.genderId} value={g.genderId.toString()}>
                {g.gender}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="País"
          name="pais"
          rules={[{ required: true, message: 'Por favor seleccione su país' }]}
        >
          <Select placeholder="Seleccione su país">
            {countries.map(c => (
              <Option key={c.countryId} value={c.countryId.toString()}>
                {c.country}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Tipo de Usuario"
          name="tipoUsuario"
          rules={[{ required: true, message: 'Seleccione su tipo de usuario' }]}
        >
          <Select placeholder="Seleccione tipo de usuario">
            {userTypes.map(u => (
              <Option key={u.userTypeId} value={u.userTypeId.toString()}>
                {u.userType}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: 'email', message: 'Por favor ingrese un correo válido' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Contraseña"
          name="password"
          rules={[{ required: true, message: 'Por favor ingrese una contraseña segura' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Confirmar Contraseña"
          name="confirmPassword"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Por favor confirme su contraseña' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Las contraseñas no coinciden'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Contacto"
          name="contacto"
          rules={[{ required: true, message: 'Por favor ingrese su número de contacto' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="terminos"
          valuePropName="checked"
          rules={[{ validator: (_, val) => val ? Promise.resolve() : Promise.reject('Debes aceptar los términos') }]}
        >
          <Checkbox onChange={e => setAcceptedTerms(e.target.checked)}>
            Acepto los{' '}
            <a onClick={() => setTermsModalVisible(true)}>
              términos y condiciones
            </a>
            .
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={!acceptedTerms}>
            Registrarse
          </Button>
        </Form.Item>
      </Form>

      <Modal
        title="Términos y Condiciones"
        open={termsModalVisible}
        footer={null}
        onCancel={() => setTermsModalVisible(false)}
        width={700}
      >
        {/* ...aquí va tu texto largo de términos y condiciones... */}
      </Modal>
    </>
  );
};

export default RegisterForm;
