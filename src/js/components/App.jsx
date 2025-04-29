import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faBackward,
  faForward,
  faVolumeUp
} from "@fortawesome/free-solid-svg-icons";

import '../styles/App.css';

function App() {
  

  const [songData, setSongData] = useState(null); // Estado para almacenar los datos de las canciones

  useEffect(() => {
    // Llamar a la función SongData al cargar el componente
    SongData();
  }, []);

  // Función para obtener los datos de las canciones desde la API
  function SongData() {
    fetch('https://playground.4geeks.com/sound/songs', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        console.log(response); 
        return response.json(); // Convertir la respuesta a JSON
      })
    
      .then ((responseJson) => {
        console.log(responseJson);
        setSongData(responseJson.songs); // Almacenar los datos de las canciones en el estado 
        
      })
    
      // .catch((error) => {
      //   console.error('Error en la solicitud:', error);
      //  });
  }
    

  // const [songs] = useState([
  //   {
  //     id: 1,
  //     name: "Mario Castle",
  //     url: "/sound/files/mario/songs/castle.mp3",
  //     category: "category",
  //   },
  //   {
  //     id: 2,
  //     name: "Mario Star",
  //     url: "/sound/files/mario/songs/hurry-starman.mp3",
  //     category: "category",
  //   },
  //   {
  //     id: 3,
  //     name: "Mario Overworld",
  //     url: "/sound/files/mario/songs/overworld.mp3",
  //     category: "category",
  //   },
  //   {
  //     id: 4,
  //     name: "Mario Stage 1",
  //     url: "/sound/files/mario/songs/stage1.mp3",
  //     category: "category",
  //   },
  //   {
  //     id: 5,
  //     name: "Mario Stage 2",
  //     url: "/sound/files/mario/songs/stage2.mp3",
  //     category: "category",
  //   },
  // ]);

  const [currentSongIndex, setCurrentSongIndex] = useState(0); // Índice de la canción actual
  const audioRef = useRef(null); // Referencia para la etiqueta <audio>
  const [currentVolume, setCurrentVolume] = useState(0.5); // Volumen actual (0 a

  const [dominio] = useState("https://playground.4geeks.com"); // Dominio base para las URL de las canciones

  const playAudio = (index) => {
    if (audioRef.current) {
      audioRef.current.pause(); // Pausa el audio actual si está reproduciéndose
      audioRef.current.currentTime = 0; // Reinicia el tiempo de reproducción
    }

    audioRef.current.src = `${dominio}${songData[index].url}`; // Cambia la fuente del audio
    console.log("URL audio:", songData[index].url);
    audioRef.current.play(); // Reproduce el nuevo audio
  };

  const handlePrevious = () => {
    const previousIndex = currentSongIndex === 0 ? songData.length - 1 : currentSongIndex - 1;
    setCurrentSongIndex(previousIndex);
    playAudio(previousIndex); // Reproduce la canción anterior
  };

  const handleNext = () => {
    const nextIndex = currentSongIndex === songData.length - 1 ? 0 : currentSongIndex + 1;
    setCurrentSongIndex(nextIndex);
    playAudio(nextIndex); // Reproduce la siguiente canción
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value); // Obtiene el nuevo volumen del slider lo convierte de string a float
    setCurrentVolume(newVolume); // Actualiza el estado del volumen
    if (audioRef.current) {
      audioRef.current.volume = newVolume; // Cambia el volumen del audio
    }
  };

  return (
    <div className="container-fluid align-items-center">
      {/* Etiqueta <audio> oculta para manejar el audio */}
      <audio ref={audioRef} style={{ display: "none" }}></audio>

      <ol className="list-group custom-list list-group-numbered">
        {songData !== null && songData.map((song, index) => ( //&& se asegura de que songData no sea null
          <li
            key={index}
            id = "item"
            className={`list-group-item list-group-item-action ${
              index === currentSongIndex ? "active" : ""
            }`}
          >
            <span>{song.name}</span>
          </li>
        ))}
      </ol>
      <div className="container-fluid d-flex justify-content-center align-items-center fixed-bottom">
        <div className="d-flex justify-content-center align-items-center">
          <button
            className="btn btn-primary me-2"
            onClick={handlePrevious} // Botón para la canción anterior
          >
            <FontAwesomeIcon icon={faBackward} />
          </button>
          <button
            className="btn btn-primary me-2"
            onClick={() => playAudio(currentSongIndex)} // Botón para reproducir la canción actual
          >
            <FontAwesomeIcon icon={faPlay} />
          </button>
          <button
            className="btn btn-primary me-2"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.pause(); // Botón para pausar la canción actual
              }
            }}
          >
            <FontAwesomeIcon icon={faPause} />
          </button>
          <button
            className="btn btn-primary me-2"
            onClick={handleNext} // Botón para la siguiente canción
          >
            <FontAwesomeIcon icon={faForward} />
          </button>
          <div className="d-flex align-items-center ms-3">
          <FontAwesomeIcon icon={faVolumeUp} className="me-2" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={currentVolume}
            onChange={handleVolumeChange} // Control deslizante para ajustar el volumen
          />
        </div>
        </div>
      </div>
    </div>
  );
}

export default App;