import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import {
  Camera,
  useCameraDevice,
  useFrameProcessor
} from 'react-native-vision-camera'
import { 
  Face,
  useFaceDetector,
  FaceDetectionOptions
} from 'react-native-vision-camera-face-detector'
import { Worklets } from 'react-native-worklets-core'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App'

const DetectFace = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const [faceProfile, setFaceProfile] = useState<string | null>(null)

  const faceDetectionOptions = useRef<FaceDetectionOptions>( {
     performanceMode: 'accurate',
     contourMode: 'all',
     landmarkMode: 'all'
   } ).current

   const device = useCameraDevice('front')
   const { detectFaces } = useFaceDetector( faceDetectionOptions )

   useEffect(() => {
     (async () => {
       const status = await Camera.requestCameraPermission()
       console.log({ status })
     })()
   }, [device])

   const handleDetectedFaces = Worklets.createRunOnJS( (
     faces: Face[]
   ) => { 
     const face = faces[0]
     if (face.yawAngle > -30 && face.yawAngle < 30) {
       setFaceProfile('Facing Straight')
     } else if (face.yawAngle > -90 && face.yawAngle < -30) {
       setFaceProfile('Facing Left')
     } else if (face.yawAngle > 30 && face.yawAngle < 90) {
       setFaceProfile('Facing Right')
     }
   })

   const frameProcessor = useFrameProcessor((frame) => {
     'worklet'
     const faces = detectFaces(frame)
     // ... chain frame processors
     // ... do something with frame
     handleDetectedFaces(faces)
   }, [handleDetectedFaces])

   return (
     <View style={styles.container}>
       {!!device? <Camera
         style={StyleSheet.absoluteFill}
         device={device}
         isActive={true}
         frameProcessor={frameProcessor}
       /> : <Text>
         No Device
       </Text>}
       { faceProfile && (<Text style={styles.overlayText}>{faceProfile}</Text>)}
     </View>
   )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  overlayText: {
    color: 'grey',
    fontSize: 24,
    fontWeight: 'bold'
  }
})

export default DetectFace
