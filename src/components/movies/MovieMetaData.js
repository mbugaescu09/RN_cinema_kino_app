import React from "react";
import { View, Text } from "react-native"
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Foundation from "react-native-vector-icons/Foundation"
import * as Animatable from 'react-native-animatable';

import styles from "../../styles/MovieMetaDataStyles";

const MovieMetaData = ({ movie }) => {

  return (
 
    <Animatable.View 
      style={styles.metaDataContainer} 
      animation='fadeIn'
      duration={600}
      delay={300}
    >
      <View style={styles.movieMetaData}>
        
        <View style={styles.movieRating}> 
          <MaterialIcons name="stars" size={34} color="#ff321e" style={styles.movieRatingIcon} />
          <Text style={styles.movieRatingRating}>{movie.average_rating? movie.average_rating.toFixed(0) : '0'} / 6</Text>
          <Text style={styles.movieRatingUsers}>Brugere ({movie.votes_count})</Text>
        </View>
        <View style={styles.movieRating}>
          <Foundation name="star" size={34} color="yellow" style={styles.movieRatingIcon} />
          <Text style={styles.movieRatingRating}>{movie.media_rating_value? parseInt(movie.media_rating_value) : 0} / 6</Text>
          <Text style={styles.movieRatingUsers}>Medier ({movie.media_rating_count})</Text>
        </View>
      </View>
  </Animatable.View>
   
  )
}

export default MovieMetaData;