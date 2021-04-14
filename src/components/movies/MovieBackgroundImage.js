import React, {useState} from 'react';
import {View, ImageBackground, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {SharedElement} from 'react-navigation-shared-element';
import * as Animatable from 'react-native-animatable';
import MovieTrailerModal from '../../modals/MovieTrailerModal';
import styles from '../../styles/MovieBackgroundImageStyles';

const MovieBackgroundImage = ({
  movie,
  image,
  danishTitle,
  genre,
  modal,
  backgroundColor,
  primaryFontColor,
  secondaryFontColor,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const genreFallback = genre ? genre : movie.genre;
  const imageFallback = image ? image : movie.imageUrl;
  const titleFallback = danishTitle ? danishTitle : movie.title;

  return (
    <View style={styles.imageContainer}>
      {modal ? null : (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.goBackContainer}>
          <Text style={styles.goBack}>
            <MaterialCommunityIcons
              name="arrow-left-circle"
              size={35}
              color={primaryFontColor}
            />
          </Text>
        </TouchableOpacity>
      )}

      <SharedElement id={image}>
        <ImageBackground
          style={styles.coverImage}
          source={{uri: imageFallback}}
          resizeMethod="auto"
          resizeMode="cover">
          <LinearGradient
            colors={[`${backgroundColor}00`, `${backgroundColor}`]}
            style={styles.LinearGradientLower}
          />
        </ImageBackground>
        {!!movie.video_markup && (
          // checks to see if there is a trailer before rendering the play button
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
            }}>
            <Animatable.View
              style={styles.playButtomViewWrapper}
              animation="zoomIn"
              duration={900}
              delay={100}>
              <MaterialCommunityIcons
                style={styles.playButton}
                color={primaryFontColor}
                name="play-circle"
                size={60}
              />
            </Animatable.View>
            <MovieTrailerModal
              modalVisible={modalVisible}
              setModalVisible={() => setModalVisible(false)}
              video_markup={movie.video_markup}
              movie={movie}
            />
          </TouchableOpacity>
        )}
      </SharedElement>

      <SharedElement id={titleFallback}>
        <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          style={[styles.movieTitle, {color: primaryFontColor}]}>
          {titleFallback}
        </Text>
      </SharedElement>

      <Text
        style={[styles.movieGenre, {color: secondaryFontColor}]}
        numberOfLines={3}>
        {genreFallback ? genreFallback.join(', ') : ''} {'\n'}
        {movie.playingTime ? `Varighed ${movie.playingTime} min` : null} {'\n'}
        {movie.censorship ? `${movie.censorship.name}` : null}
      </Text>
    </View>
  );
};

export default MovieBackgroundImage;
