import Icon from '@expo/vector-icons/Feather'
import * as ImagePicker from 'expo-image-picker'
import { Link, useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { useState } from 'react'
import {
  Image,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import { api } from '../src/lib/api'

export default function NewMemory() {
  const router = useRouter()

  const { bottom, top } = useSafeAreaInsets()
  const [isPublic, setPublic] = useState<boolean>(false)
  const [preview, setPreview] = useState<string>('')
  const [content, setContent] = useState<string>('')

  async function openImagePicker() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      })
      if (result.assets[0]) {
        setPreview(result.assets[0].uri)
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function handleCreateMemory(): Promise<void> {
    const token = await SecureStore.getItemAsync('token')

    let coverUrl

    if (preview) {
      const uploadFormData = new FormData()

      uploadFormData.append('file', {
        uri: preview,
        name: 'image.jpg',
        type: 'image/jpeg',
      } as any)

      const uploadResponse = await api.post('/upload', uploadFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      coverUrl = uploadResponse.data.fileUrl

      await api.post(
        '/memory',
        {
          coverUrl,
          content,
          isPublic,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      router.push('/memories')
    }
  }

  return (
    <ScrollView
      className="px-8"
      contentContainerStyle={{ paddingTop: top, paddingBottom: bottom }}
    >
      <View className="mt-4 flex-row items-center justify-between">
        <NLWLogo />
        <Link href="/memories" asChild>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
            <Icon name="arrow-left" size={16} color="#fff" />
          </TouchableOpacity>
        </Link>
      </View>
      <View className="mt-6 space-y-6 ">
        <View className="flex-row items-center gap-2">
          <Switch
            value={isPublic}
            onValueChange={setPublic}
            trackColor={{ false: '#767577', true: '#372560' }}
            thumbColor={isPublic ? '#9b79ea' : '#9e9ea0'}
          />
          <Text className="font-body text-base text-gray-200">
            Tornar memória pública
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          className="h-32 items-center justify-center rounded-lg border border-dashed border-gray-500 bg-black/20"
          onPress={openImagePicker}
        >
          {preview ? (
            <Image
              source={{ uri: preview }}
              alt=""
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <View className="flex-row items-center gap-2">
              <Icon name="image" color="#fff" />
              <Text className="font-body text-base text-gray-200">
                Adicionar foto ou vídeo de capa
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <TextInput
          multiline
          value={content}
          textAlignVertical="top"
          onChangeText={setContent}
          className="p-0 font-body text-lg text-gray-50"
          placeholderTextColor="#56565a"
          placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
        />
        <TouchableOpacity
          className="mb-5 items-center rounded-full bg-green-500 px-5 py-2"
          activeOpacity={0.7}
          onPress={handleCreateMemory}
        >
          <Text className="text-brack font-alt text-sm uppercase">Salvar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
