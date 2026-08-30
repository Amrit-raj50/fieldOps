import MapView, { Marker } from "react-native-maps";
import { allEmp } from "../../api/allEmp";
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import { useState, useEffect } from "react";

export default function TarckUser() {

    const [refreshing, setReFreshing] = useState(false);
    const [data, setData] = useState<any[]>([]);

    const handleLoc = async () => {
        try {
            const d = await allEmp();

            // console.log(d.data);

            setData(d.data ?? []);

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleLoc();
    }, []);

    const onRefresh = async () => {

        setReFreshing(true);

        await handleLoc();

        setReFreshing(false);
    };

    return (

        <View style={{ flex: 1 }}>

            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: 23.123456,
                    longitude: 72.654321,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                }}
            >

                {Array.isArray(data) &&
                    data.map((item) => {

                        if (
                            item.latitude == null ||
                            item.longitude == null
                        ) {
                            return null;
                        }

                        return (
                            <Marker
                                key={item._id}
                                coordinate={{
                                    latitude: Number(item.latitude),
                                    longitude: Number(item.longitude)
                                }}
                                title={item.name}
                                description="Employee current location"
                            />
                        );
                    })}

            </MapView>


            {/* Refresh Button */}

            <TouchableOpacity
                onPress={onRefresh}
                disabled={refreshing}
                style={{
                    position: "absolute",
                    top: 50,
                    right: 20,
                    backgroundColor: "white",
                    paddingHorizontal: 18,
                    paddingVertical: 12,
                    borderRadius: 10,
                    elevation: 5,
                }}
            >

                {refreshing ? (
                    <ActivityIndicator />
                ) : (
                    <Text style={{ fontWeight: "bold" }}>
                        Refresh
                    </Text>
                )}

            </TouchableOpacity>

        </View>
    );
}