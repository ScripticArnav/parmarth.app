import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DatabaseScreen = () => {
  const navigation = useNavigation();

  const handleViewAttendance = () => {
    navigation.navigate('Database', {
      screen: 'ViewAttendanceScreen'
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Database Screen</Text>
      <Button title="View Attendance" onPress={handleViewAttendance} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    marginBottom: 20
  }
});

export default DatabaseScreen;
