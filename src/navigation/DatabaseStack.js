// navigation/DatabaseStack.js
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DatabaseScreen from "../screens/DatabaseScreen.js"
import ViewAttendanceScreen  from "../screens/ViewAttendanceScreen.js"

const Stack = createNativeStackNavigator();

export default function DatabaseStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="DatabaseHome" component={DatabaseScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="ViewAttendanceScreen" component={ViewAttendanceScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}
