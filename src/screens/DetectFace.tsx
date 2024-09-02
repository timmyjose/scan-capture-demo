import { View, Text, StyleSheet, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App'
import React, { useEffect, useRef } from 'react'
import { Camera, Face, FaceDetectionOptions } from 'react-native-vision-camera-face-detector'
import { Frame, useCameraDevice } from 'react-native-vision-camera'

const DetectFace = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const faceDetectionOptions = useRef<FaceDetectionOptions>({
    performanceMode: 'accurate',
    landmarkMode: 'all',
    contourMode: 'all',
    trackingEnabled: false,
  }).current
  const device = useCameraDevice('front')

  useEffect(() => {
    const requestCameraPermissions = async () => {
      const status = await Camera.requestCameraPermission()
      console.log({ status })
    }
    requestCameraPermissions()
  }, [])

  const handleFaceDetection = async (faces: Face[], frame: Frame) => {
    console.log(`faces = ${faces}`)
    console.log(`frame = ${frame}`)
  }

  return (
    <View style={styles.container} >
      {!!device ? 
        <Camera 
          style={StyleSheet.absoluteFill}
          device={device}
          faceDetectionCallback={handleFaceDetection}
          faceDetectionOptions={faceDetectionOptions}
        /> : <Text>No camera device</Text>
      }
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Home')}>
          <Text>Home</Text>
        </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#c0c0c0',
    height: 40,
    width: '40%',
    margin: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default DetectFace
