import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import CreateHotelScreen from './src/screens/CreateHotelScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function LogoutButton({ navigation }) {
    const handleLogout = async () => {
        Alert.alert(
            "Cerrar sesión",
            "¿Estás seguro de que deseas salir?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Salir",
                    onPress: async () => {
                        await SecureStore.deleteItemAsync('token');
                        navigation.navigate('Login');
                    },
                    style: "destructive"
                }
            ]
        );
    };

    return (
        <TouchableOpacity
            onPress={handleLogout}
            style={styles.tabBarLogoutButton}
        >
            <View style={styles.tabBarButtonContent}>
                <Ionicons name="log-out-outline" size={24} color="#EF4444" />
                <Text style={styles.logoutButtonText}>Salir</Text>
            </View>
        </TouchableOpacity>
    );
}

function MainTabs({ navigation }) {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = 'home';
                    } else if (route.name === 'Create') {
                        iconName = 'add-circle';
                    } else if (route.name === 'Profile') {
                        iconName = 'person';
                    } else if (route.name === 'Logout') {
                        iconName = 'log-out-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#2563EB',
                tabBarInactiveTintColor: '#9CA3AF',
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'Inmuebles' }}
            />
            <Tab.Screen
                name="Create"
                component={CreateHotelScreen}
                options={{ title: 'Crear Inmueble' }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Mi Perfil' }}
            />
            <Tab.Screen
                name="Logout"
                component={() => null}
                options={{
                    title: 'Salir',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="log-out-outline" size={size} color="#EF4444" />
                    ),
                    tabBarButton: (props) => <LogoutButton navigation={navigation} />
                }}
            />
        </Tab.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    tabBarLogoutButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabBarButtonContent: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutButtonText: {
        fontSize: 10,
        marginTop: 2,
        color: '#EF4444',
    },
});
