import { View, Text, StyleSheet, Pressable, Image, Alert } from 'react-native'
import { useEffect, useState } from 'react'
import DocumentScanner, { ResponseType } from 'react-native-document-scanner-plugin'
import React from 'react'
import * as MediaLibrary from 'expo-media-library'

const ScanDocument = () => {
  const [scannedImage, setScannedImage] = useState<string | null>(null)
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions()
  const [canSaveImageToDevice, setCanSaveImageToDevice] = useState<boolean>(false)

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

  const scanImage = async () => {
    const { scannedImages } = await DocumentScanner.scanDocument({
      responseType: ResponseType.ImageFilePath
    })

    if (scannedImages && scannedImages.length > 0) {
      const scannedImageUri = scannedImages[0]
      setScannedImage(scannedImageUri)
      // save image to device fs
      if (canSaveImageToDevice) {
        await MediaLibrary.saveToLibraryAsync(scannedImageUri)
      } else {
        console.warn('Media Library access is not available')
      }
    } 
  }

  return (
    <View style={styles.container}>
      { scannedImage && (
        <Image
          resizeMode="contain"
          key={scannedImage}
          style={{ width: 300, height: 300 }}
          source={{ uri: scannedImage }}
        />
      )}
      <Pressable
        style={styles.button}
        onPress={scanImage}>
          <Text>Scan</Text>
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

export default ScanDocument
