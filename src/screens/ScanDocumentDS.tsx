import { View, Text, StyleSheet, Pressable, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App'
import { useState } from 'react'
import DocumentScanner from 'react-native-document-scanner-plugin'
import React from 'react'

const ScanDocument = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const [scannedImage, setScannedImage] = useState<string | null>(null)

  const scanImage = async () => {
    const { scannedImages } = await DocumentScanner.scanDocument()

    if (scannedImages && scannedImages.length > 0) {
      setScannedImage(scannedImages[0])
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

export default ScanDocument
