import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faBullseye, faInfoCircle, faHistory } from "@fortawesome/free-solid-svg-icons";
import './HomeScreen.css';
import { useAuth } from "../../../Context/AuthContext";
import { useState } from "react";

interface WorkoutRoom {
  nombre: string;
  descripcion: string;
  resumen: string;
  icon: any; // Ajusta el tipo si tienes un tipo específico para el ícono
  image?: string;
}

const workoutRooms: WorkoutRoom[] = [

  {
    nombre: "Visión",
    descripcion: "Ser la plataforma digital de referencia para la comunidad hispanohablante que busca inspiración culinaria deliciosa y sostenible, fomentando la reducción y reutilización de residuos orgánicos y domésticos, comenzando por el aceite de cocina usado.",
    resumen: "Visualizamos una comunidad que disfruta de la cocina creativa y a la vez es consciente y activa en la gestión responsable de sus residuos, liderando con el ejemplo del aprovechamiento del aceite usado.",
    icon: faEye,
  },
  {
    nombre: "Misión",
    descripcion: "Inspirar y capacitar a nuestros usuarios a través de una amplia variedad de recetas creativas y fáciles de seguir, al mismo tiempo que proporcionamos información práctica y soluciones innovadoras para la gestión responsable de residuos, con un enfoque inicial en cómo reciclar y reutilizar el aceite de cocina usado de manera segura y efectiva.",
    resumen: "Ofrecemos un espacio integral con recetas deliciosas y guías detalladas para el manejo de residuos, priorizando el reciclaje y la reutilización del aceite de cocina para un hogar más sostenible.",
    icon: faBullseye,
  },
  {
    nombre: "Introducción",
    descripcion: "¡Bienvenidos a un espacio donde la cocina se encuentra con la conciencia ambiental! En CookDev, creemos que disfrutar de una buena comida y cuidar nuestro planeta van de la mano.",
    resumen: "Descubre recetas inspiradoras y consejos prácticos para reducir y reutilizar residuos, comenzando por el aceite de cocina. Cocina con sabor y responsabilidad en nuestra comunidad.",
    icon: faInfoCircle,
  },
  {
    nombre: "Historia",
    descripcion: "CookDev nació de la pasión compartida por la gastronomía y la preocupación por el impacto ambiental de nuestros hábitos cotidianos. Nos enfocamos en el aceite usado como punto de partida, investigando métodos seguros y creativos para su reutilización.",
    resumen: "Desde nuestros inicios, hemos evolucionado de compartir recetas a construir una plataforma que promueve la cocina sostenible y el aprovechamiento de residuos, con el aceite usado como nuestro primer gran paso.",
    icon: faHistory,
  }
];

const workoutRoomImages = [
  { nombre: "Visión", image: "https://elviajerofeliz.com/wp-content/uploads/2020/05/Comida-t%C3%ADpica-de-Alemania.-10-platos-imprescindibles.jpg" },
  { nombre: "Misión", image: "https://elsouvenir.com/wp-content/uploads/2014/09/Comida-Mineira.jpg" },
  { nombre: "Introducción", image: "https://ddc-site.s3.us-east-2.amazonaws.com/sites/diariodecuyo/img/2017/05/06/f1_p28.jpg" },
  { nombre: "Historia", image: "https://boasnovasmg.com.br/wp-content/uploads/2024/04/culinaria_mineira_capa.jpg" },
];

const workoutRoomsXImage = workoutRooms.map((workoutRoom) => ({
  ...workoutRoom,
  image: workoutRoomImages.find((image) => image.nombre === workoutRoom.nombre)?.image,
}));

const HomeScreen: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<WorkoutRoom | null>(null);
  const {state}=useAuth()
  console.log(state);
  
  const handleRoomClick = (workoutRoom: WorkoutRoom) => {
    setSelectedRoom(workoutRoom);
  };

  const closeModal = () => {
    setSelectedRoom(null);
  };

  return (
    <div className="home-screen">
      <div className="welcome-section">
        <h1 className="welcome-title">BIENVENIDOS A COOKDEV </h1>
        <p className="welcome-subtitle">
          MEJORA TUS HABITOS DE VIDA DESDE HOY.
        </p>
      </div>

      <h2 className="title">CONOCE MÁS DE NOSOTROS</h2>
      <div className="workout-rooms-container">
        {workoutRoomsXImage.map((workoutRoom) => (
          <div
            className="workout-room-card"
            key={workoutRoom.nombre}
            onClick={() => handleRoomClick(workoutRoom)}
          >
            <img src={workoutRoom.image} alt={workoutRoom.nombre} className="workout-room-image" />
            <div className="workout-room-info">
              <h3 className="workout-room-title">
                <FontAwesomeIcon icon={workoutRoom.icon} /> {workoutRoom.nombre.charAt(0).toUpperCase() + workoutRoom.nombre.slice(1)}
              </h3>
              <p className="workout-room-description">{workoutRoom.descripcion}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Ventana emergente para mostrar el resumen */}
            {selectedRoom && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedRoom.nombre}</h3> {/* Muestra el resumen en lugar del nombre */}
            <p>{selectedRoom.descripcion}</p> {/* Muestra la descripción en el cuerpo del modal */}
            <button onClick={closeModal} className="close-modal">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
