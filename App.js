import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [gpsStatus, setGpsStatus] = useState('Verificando GPS...');
  const [loading, setLoading] = useState(true);
  const [statusStyle, setStatusStyle] = useState(styles.status); // Estado para manejar estilos

  useEffect(() => {
    (async () => {
      // Solicitar permisos de ubicación
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso para acceder a la ubicación denegado');
        setLoading(false);
        return;
      }

      // Obtener ubicación continuamente
      const locationWatcher = await Location.watchPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 1,
      }, (loc) => {
        setCurrentLocation(loc); // Actualizar la ubicación actual
        setLoading(false); // Dejar de mostrar el indicador de carga

        // Verificar si la ubicación es simulada 
        if (loc.mocked) {
          setGpsStatus('OJO La ubicación está siendo simulada');
          setStatusStyle(styles.warning); // Cambiar a estilo de advertencia
        } else {
          setGpsStatus('SIIUUU Ubicación real detectada');
          setStatusStyle(styles.success); // Cambiar a estilo de éxito
        }
      });

      return () => {
        // Detener el monitoreo de la ubicación cuando el componente se desmonte
        locationWatcher.remove();
      };
    })();
  }, []);

  return (
    <LinearGradient colors={['#00c6ff', '#0072ff']} style={styles.background}>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/484/484167.png' }} // Icono de GPS
        />
        <Text style={styles.title}>Fake GPS Detector :)</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#ff6347" />
        ) : (
          <>
            <Text style={[statusStyle, { ...styles.status }]}>
              {gpsStatus}
            </Text>
            {currentLocation && (
              <View style={styles.locationBox}>
                <Text style={styles.locationText}>
                  <Text style={styles.locationTitle}>Ubicación actual:</Text>{'\n'}
                  Latitud: {currentLocation.coords.latitude.toFixed(6)}{'\n'}
                  Longitud: {currentLocation.coords.longitude.toFixed(6)}
                </Text>
              </View>
            )}
            {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
          </>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  status: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    padding: 12,
    borderRadius: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  warning: {
    backgroundColor: '#ff6b6b',
    color: '#fff',
    borderColor: '#d9534f',
    borderWidth: 2,
  },
  success: {
    backgroundColor: '#4cd137',
    color: '#fff',
    borderColor: '#2ecc71',
    borderWidth: 2,
  },
  locationBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  locationTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
  },
  error: {
    fontSize: 16,
    color: '#d9534f',
    marginTop: 20,
  },
});
