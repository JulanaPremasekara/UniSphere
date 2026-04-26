import { View, Text, Settings, TouchableOpacity } from 'react-native'
import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Card } from '@/components/ui/card'
import { Atom, BarChart3, Code2, Database, FunctionSquare } from 'lucide-react-native'
import { Href } from '@/.expo/types/router'


const tutors = [
  { 
    index: 0,
    name: 'Mathematics', 
    path: '/tutor/math', 
    icon: FunctionSquare, // Or Sigma/Calculator
    color: '#EEF2FF', 
    iconColor: '#4338CA' 
  },
  { 
    index: 1,
    name: 'Physics', 
    path: '/tutor/physics', 
    icon: Atom, 
    color: '#F0F9FF', 
    iconColor: '#0369A1' 
  },
  { 
    name: 'Programming', 
    path: '/tutor/coding', 
    icon: Code2, 
    color: '#F5F3FF', 
    iconColor: '#5B21B6' 
  },
  { 
    name: 'Data Science', 
    path: '/tutor/ds', 
    icon: Database, 
    color: '#ECFDF5', 
    iconColor: '#059669' 
  },
  { 
    name: 'Statistics', 
    path: '/tutor/stats', 
    icon: BarChart3, 
    color: '#FFF7ED', 
    iconColor: '#C2410C' 
  },
  { 
    name: 'Engineering', 
    path: '/tutor/engineering', 
    icon: Settings, 
    color: '#FEF2F2', 
    iconColor: '#DC2626' 
  },
];
export default function index() {


  return (
    <View className="flex-1 bg-gray-50">
          <Header title="UniSphere" />
    
        {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
            Welcome to Tutor
          </Text>
        </View> */}
        {/* <Card size="lg" variant="outline" className='bg-yellow-300'>
            <Text className='text-red-500'>
              This is a simple card component.
            </Text>
        </Card> */}

         <View className="flex-row flex-wrap justify-between px-4 py-6">
      {tutors.map((item, index) => (
        <TouchableOpacity key={index} className="w-[48%] mb-4">
          <Card 
            size="lg" 
            variant="outline" 
            className="items-center justify-center aspect-square rounded-[40px] p-0"
            style={{ backgroundColor: item.color }}
          >
            {/* Icon Container */}
            {/* <View className="bg-white p-3 rounded-2xl mb-3 shadow-sm">    
              <item.icon size={28} color={item.iconColor} />
            </View> */}
            
            {/* Label */}
            <Text className="font-bold text-gray-800 text-[16px]">
              {item.name}
            </Text>
          </Card>
        </TouchableOpacity>
      ))}
    </View>
        <Footer />


        </View>
  )
}