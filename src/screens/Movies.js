import React, {useContext, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import _ from 'lodash';
import {Context} from '../context/MoviesContext';
import {View, Text, FlatList, Image} from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import {SharedElement} from 'react-navigation-shared-element';
import styles from '../styles/MoviesStyles';
import PremiereDate from '../components/movies/PremiereDate';
import SearchFilterFunction from '../components/shared/SearchFilterFunction';
import FilterMovies from '../components/movies/FilterMovies';
import usePosterColors from '../hooks/usePosterColors';
import fetchImageColors from '../helpers/fetchImageColors';

const Movies = () => {
  const navigation = useNavigation();
  const {state} = useContext(Context);
  const [movies, setMovies] = useState(
    _.orderBy(state.movies, 'selling_position'),
  );
  const currentDate = new Date();
  const [filteredMovies, setFilteredMovies] = useState(movies);
  const [imgColors, setImgColors] = useState({});

  function Item(item) {
    // Formatting date to compare it to date today

    const parsedDate = danishPremiere => {
      if (danishPremiere !== null) {
        const premiereDate = danishPremiere.split(' ')[0];
        const parsedDate = new Date(premiereDate);
        return parsedDate;
      } else {
        return null;
      }
    };

    return (
      <TouchableScale
        style={styles.card}
        activeScale={0.9}
        tension={50}
        friction={7}
        useNativeDriver
        onPress={async () => {
          const imgColors = await fetchImageColors(item.imageUrl, setImgColors);
          navigation.navigate('Movie', {
            item,
            imgColors,
            lastScreen: 'Film',
          });
        }}>
        <SharedElement id={item.imageUrl}>
          <Image style={styles.coverImage} source={{uri: item.imageUrl}} />
        </SharedElement>

        {parsedDate(item.danishPremiere) > currentDate && (
          <PremiereDate PremiereDate={item.danishPremiere} />
        )}
        <View style={styles.titleContainer}>
          <SharedElement id={item.danishTitle}>
            <Text style={styles.cardTitle}>
              {item.title ? item.title : item.danishTitle}
            </Text>
          </SharedElement>
        </View>
      </TouchableScale>
    );
  }

  return (
    <View style={styles.container}>
      <SearchFilterFunction
        data={filteredMovies}
        filteredData={setFilteredMovies}
        filterValue="title"
      />

      <FilterMovies state={state} setFilteredMovies={setFilteredMovies} />

      <FlatList
        keyboardShouldPersistTaps="always"
        data={filteredMovies}
        extraData={filteredMovies}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => Item(item)}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default Movies;
