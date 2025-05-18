import React from 'react';
import { View, Text } from 'react-native';

export default function MaterialDetailsScreen({ route }) {
  const { class: className } = route.params;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
        Study Material for {className}
      </Text>
      <Text style={{ marginTop: 10 }}>
        Yaha {className} ke notes, videos, aur PDFs milenge.
      </Text>
    </View>
  );
}
