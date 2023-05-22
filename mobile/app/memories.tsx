import Icon from '@expo/vector-icons/Feather'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
import { Link, useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useEffect, useState } from 'react'
import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import { api } from '../src/lib/api'

dayjs.locale(ptBR)

interface Memory {
  id: string
  coverUrl: string
  excerpt: string
  createdAt: string
}

export default function Memories() {
  const router = useRouter()
  const [memories, setMemories] = useState<Memory[]>([])

  const { bottom, top } = useSafeAreaInsets()

  function signOut(): void {
    SecureStore.deleteItemAsync('token')
    router.push('/')
  }
  async function loadMemories() {
    const token = await SecureStore.getItemAsync('token')

    const response = await api.get('/memory', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    setMemories(response.data)
  }

  useEffect(() => {
    loadMemories()
  }, [])

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingTop: top, paddingBottom: bottom }}
    >
      <View className="mt-4 flex-row items-center justify-between px-8">
        <NLWLogo />
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={signOut}
            className="h-10 w-10 items-center justify-center rounded-full bg-red-500"
          >
            <Icon name="log-out" size={16} color="#000" />
          </TouchableOpacity>
          <Link href="/new-memory" asChild>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-green-500">
              <Icon name="plus" size={16} color="#000" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>
      {memories.map((memory) => {
        return (
          <View key={memory.id} className="mt-6 space-y-4">
            <View className="flex-row items-center gap-2">
              <View className="h-px w-5 bg-gray-50" />
              <Text className="font-body text-sm text-gray-100">
                {dayjs(memory.createdAt).format('D[ de ]MMMM[, ]YYYY')}
              </Text>
            </View>
            <View className="space-y-4 px-8">
              <Image
                className="aspect-video w-full rounded-lg"
                source={{
                  uri: memory.coverUrl,
                }}
                alt=""
              />
              <Text className="font-body text-base leading-relaxed text-gray-100">
                {memory.excerpt}
              </Text>
              <Link href={`/memory/${memory.id}`} asChild>
                <TouchableOpacity className="flex-row items-center gap-2">
                  <Text className="font-body text-sm text-gray-200">
                    Leia mais
                  </Text>
                  <Icon name="arrow-right" size={16} color="#9e9ea0" />
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        )
      })}
    </ScrollView>
  )
}
