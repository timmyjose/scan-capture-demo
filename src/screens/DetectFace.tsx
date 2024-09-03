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
import * as MediaLibrary from 'expo-media-library'

type CaptureFrofile = {
  front: boolean
  left: boolean
  right: boolean
}

const DetectFace = () => {
  const camera = useRef<Camera>(null)
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions()
  const [canSaveImageToDevice, setCanSaveImageToDevice] = useState<boolean>(false)

  const [, setFrontProfileCounter] = useState<number>(0)
  const [, setLeftProfileCounter] = useState<number>(0)
  const [, setRightProfileCounter] = useState<number>(0)
  const [capturedProfiles, setCapturedProfiles] = useState<CaptureFrofile>({
    front: false,
    left: false,
    right: false
  })
  const [instruction, setInstruction] = useState<string>('')
  const [processingComplete, setProcessingComplete] = useState<boolean>(false)

  const NUM_STABLE_FRAMES = 5

  useEffect(() => {
    (async () => {
      if (permissionResponse?.status !== 'granted') {
        await requestPermission()
      }
    })()
  }, [])

  useEffect(() => {
    (async () => {
      setCanSaveImageToDevice(await MediaLibrary.isAvailableAsync())
    })()
  }, [])

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

   const getNextProfile = (profiles: CaptureFrofile = capturedProfiles): string => {
    if (profiles.front) {
      if (!profiles.left) {
        return 'Turn LEFT'
      } 

      if (!profiles.right) {
        return 'Turn RIGHT'
      }
      return ''
    } else if (profiles.left) {
      if (!profiles.front) {
        return 'Turn FRONT'
      } 

      if (!profiles.right) {
        return 'Turn RIGHT'
      }
      return ''
    } else  if (profiles.right) {
      if (!profiles.front) {
        return 'Turn FRONT'
      } 
      
      if (!profiles.left) {
        return 'Turn LEFT'
      } 
      return ''
    }
    return ''
   }

   const handleDetectedFaces = Worklets.createRunOnJS( (
     faces: Face[]
   ) => { 
     const face = faces[0]

     if (!face) {
      return
     }

     if (face.yawAngle > -30 && face.yawAngle < 30) {
       if (!capturedProfiles.front) {
        setFrontProfileCounter((prev) => {
         if (prev >= NUM_STABLE_FRAMES) {
           savePhotoToDevice('Front')
           setCapturedProfiles((prev) => {
             const updatedProfiles = { ...prev, front: true }
             const nextProfile = getNextProfile(updatedProfiles)
             setInstruction(`FRONT captured. ${nextProfile}`)
             return updatedProfiles
           })
           return 0
         }
         return prev + 1
        })
        setLeftProfileCounter(0)
        setRightProfileCounter(0)
       }
     } else if (face.yawAngle > -90 && face.yawAngle < -30) {
       if (!capturedProfiles.left) {
        setLeftProfileCounter((prev) => {
         if (prev >= NUM_STABLE_FRAMES) {
           savePhotoToDevice('Left')
           setCapturedProfiles((prev) => {
            const updatedProfiles = { ...prev, left: true }
            const nextProfile = getNextProfile(updatedProfiles)
             setInstruction(`LEFT captured. ${nextProfile}`)
            return updatedProfiles
           })
           return 0
         }
         return prev + 1
        })
        setFrontProfileCounter(0)
        setRightProfileCounter(0)
      }
     } else if (face.yawAngle > 30 && face.yawAngle < 90) {
       if (!capturedProfiles.right) {
        setRightProfileCounter((prev) => {
         if (prev >= NUM_STABLE_FRAMES) {
           savePhotoToDevice('Right')
           setCapturedProfiles((prev) => {
             const updatedProfiles = { ...prev, right: true }
             const nextProfile = getNextProfile(updatedProfiles)
             setInstruction(`RIGHT captured. ${nextProfile}`)
             return updatedProfiles
           })
           return 0
         }
         return prev + 1
        })
        setFrontProfileCounter(0)
        setLeftProfileCounter(0)
      }
     }

     if (capturedProfiles.front && capturedProfiles.left && capturedProfiles.right) {
      setProcessingComplete(true)
      setInstruction('All Profiles captured')
     }
   })

   const frameProcessor = useFrameProcessor((frame) => {
     'worklet'
     if (!processingComplete) {
       const faces = detectFaces(frame)
       handleDetectedFaces(faces)
     }
   }, [handleDetectedFaces])

   const savePhotoToDevice = (profile: string) => {
    (async () => {
      try {
        if (!canSaveImageToDevice) {
          throw new Error('Cannot save to media library')
        }

        const imageFile = await camera.current?.takePhoto()
        if (imageFile === undefined) {
          throw new Error('Camera failed to capture photo')
        }
        console.log(`saving photo for profile: ${profile}`)
        await MediaLibrary.saveToLibraryAsync(imageFile.path)
      } catch (err: any) {
        console.error(err)
      }
    })()
   }

   return (
     <View style={styles.container}>
       {!!device? <Camera
         ref={camera}
         style={StyleSheet.absoluteFill}
         device={device}
         isActive={true}
         photo={true}
         frameProcessor={frameProcessor}
       /> : <Text>
         No Device
       </Text>}
       { instruction && (<Text style={styles.overlayText}>{instruction}</Text>)}
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
    fontWeight: 'bold',
    textAlign: 'center'
  }
})

export default DetectFace
