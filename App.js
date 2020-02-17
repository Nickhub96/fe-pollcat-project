import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import axios from "axios";
import googleMapsAuth from "./authkeys";

export default class App extends Component {
  state = {
    location: null,
    errorMessage: null,
    placeName: null
  };

  componentDidMount() {
    this.getLocationAsync().then(() => {
      this.getPlaceName(this.state.location);
    });
  }

  getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage:
          "Please enable Location Services in your settings to join in on Pollcat"
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  };

  getPlaceName = location => {
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.coords.latitude},${location.coords.longitude}&result_type=administrative_area_level_2&key=${googleMapsAuth}`
      )
      .then(({ data }) => {
        this.setState({
          placeName: data.results[0].address_components[0].long_name
        });
      });
  };

  render() {
    let text = "Waiting..";
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.placeName === "Greater Manchester") {
      text = `Great stuff, you are in ${this.state.placeName}!`;
    } else if (
      this.state.placeName &&
      this.state.placeName !== "Greater Manchester"
    ) {
      text = `Oops! It appears Pollcat is not yet available in your area. Check back soon.`;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>{text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
