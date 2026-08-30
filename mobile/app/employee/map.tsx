import { View, Text } from "react-native";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { updateLoc } from "../../api/updateLoc";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LocationPage() {

    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    // const [id, setId] = useState<string | null>(null);

    useEffect(() => {

        let subscription: Location.LocationSubscription;

        const startWatching = async () => {

            // Get user
            const userString = await AsyncStorage.getItem("user");

            if (!userString) {
                // console.log("User not found");
                return;
            }

            const parsedUser = JSON.parse(userString);

            const userId = parsedUser._id;

            // setId(userId);

            // console.log("User ID:", userId);

            // Permission
            const { status } =
                await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                // console.log("Location permission denied");
                return;
            }

            // Watch location
            subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    distanceInterval: 10,
                },
                async (location) => {

                    const { latitude, longitude } =
                        location.coords;

                    // console.log("Latitude:", latitude);
                    // console.log("Longitude:", longitude);

                    setLatitude(latitude);
                    setLongitude(longitude);

                    try {

                        const result = await updateLoc(
                            userId,
                            latitude,
                            longitude
                        );

                        // console.log(
                        //     "Location updated:",
                        //     result
                        // );

                    } catch (error) {
                        console.log(
                            "Location update failed:",
                            error
                        );
                    }
                }
            );
        };

        startWatching();

        return () => {
            if (subscription) {
                subscription.remove();
            }
        };

    }, [latitude]);

    return (
        <View>
            <Text>Current Location</Text>

            {/* <Text>
                Employee ID: {id}
            </Text> */}

            <Text>
                Latitude: {latitude}
            </Text>

            <Text>
                Longitude: {longitude}
            </Text>
        </View>
    );
}