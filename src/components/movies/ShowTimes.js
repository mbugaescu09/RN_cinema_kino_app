import React, {useEffect, useState, useContext, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import {Context as CinemaContext} from '../../context/CinemaContext';
import {Context as AuthContext} from '../../context/AuthContext';
import WebViewModal from '../../modals/WebViewModal';
import DatePicker from '../shared/DatePicker';
import NoShowtimes from '../movies/NoShowtimes';
import MovieVersionLookup from '../shared/MovieVersionLookup';
import _ from 'lodash';
import styles from '../../styles/ShowTimeStyles';
import {create1MonthDates} from '../../helpers/date.utils';
import {scrollToIndex} from '../../helpers/datepicker.utils';
import moment from 'moment';

const monthOfDates = create1MonthDates();

const ShowTimes = ({id, nextShowtime, movieVersions, backgroundColor, primaryFontColor, secondaryFontColor, active }) => {
  const datePickerRef = useRef();
  const [showtimes, setShowtimes] = useState([]);
  const [sessionName, setSessionName] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [showtimeId, setShowtimeId] = useState([]);
  const [selectedDate, setSelectedDate] = useState(monthOfDates[0]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const {state} = useContext(CinemaContext);
  const {
    state: {user},
  } = useContext(AuthContext);

  // Find a way to get user with the fetch user component
  useEffect(() => {
    user
      ? setSessionId(JSON.parse(user).session_id) &&
        setSessionName(JSON.parse(user).session_name)
      : null;
  }, []);

  useEffect(() => {
    const url = `https://www.kino.dk/appservices/movie/${id}/${selectedDate.format(
      'YYYY-MM-DD',
    )}`;

    fetch(url, {
      mode: 'no-cors',
    })
      .then(response => response.json())
      // sets showtimes to the response through the mergeArray method that calculates the distance
      .then(json => {
        setShowtimes(mergeArrays(json, state.cinemas));
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  }, [selectedDate]);

  // Takes showtime as arr1 and cinemas as arr2
  // Loop through the showtime array, lookup the id / cinema_id in cinema array
  // merge the data from the cinemas array into the showtimes array
  // returns the array sorted by the distance parameter
  function mergeArrays(arr1, arr2) {
    // Need to do a check to see if the user allowed geo or not / if cinema has distance value
    let merged = [];

    for (let i = 0; i < arr1.length; i++) {
      merged.push({
        ...arr1[i],
        ...arr2.find(itmInner => itmInner.id === parseInt(arr1[i].cinema_id)),
      });
    }

    for (let element of merged) {
      element.showtimes = _.groupBy(element.showtimes, 'movie_version_id');
    }

    return _.orderBy(merged, 'distance');
  }

  const onPressNextShowtime = () => {
    const nextShowTimeMoment = moment(nextShowtime);
    setSelectedDate(nextShowTimeMoment);
    monthOfDates.forEach(date => {
      if (date.isSame(nextShowTimeMoment, 'day')) {
        scrollToIndex(datePickerRef, monthOfDates, date);
        setSelectedDate(date);
      }
    });
  };
  
  if (loading) {
    return <ActivityIndicator size="large" style={{marginTop: 200}} />;
  }


  return (
    <View style={[styles.container, { backgroundColor: backgroundColor, display: active}]}>
      <WebViewModal
        modalVisible={modalVisible}
        setModalVisible={() => setModalVisible(false)}
        url={`https://kino.dk/ticketflow/${showtimeId}`}
        cookieName={sessionName}
        cookieValue={sessionId}
      />

      <DatePicker
        dates={monthOfDates}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        ref={datePickerRef}
        scrollToIndex={scrollToIndex}
      />

      <FlatList
        // Here each cinema is rendered
        keyExtractor={showtime => showtime.cinema_id}
        data={showtimes}
        extraDate={selectedDate}
        ItemSeparatorComponent={() => {
          return <View style={styles.itemSeperator} />;
        }}
        // The ListEmptyComponent loads the showtime component with next showtime, the option to update th current date and if it happens the selectedId value is updated in the correct format.
        ListEmptyComponent={
          <NoShowtimes
            nextShowtime={nextShowtime}
            onPressNextShowtime={onPressNextShowtime}
          />
        }
        // Each cinema has a range of showtimes
        renderItem={({item}) => (
          <View>
            <Text style={[styles.sectionHeader, { color: primaryFontColor }]}>
              {item.name}{' '}
              {item.distance ? `- ${item.distance.toFixed(1)} km` : ''}
            </Text>

            <FlatList
              // Here each showtime pr cinema is rendered
              keyExtractor={(item, index) => index.toString()}
              data={Object.values(item.showtimes)}
              //data={Object.entries(item.showtimes)}?
              numColumns={1}
              renderItem={({item}) => (
                <View style={styles.showTimeContainer}>
                  <Text style={[styles.showtimeVersionLabel, { color: secondaryFontColor }]}>
                    <MovieVersionLookup
                      // Make check to see if item[0] exists
                      id={item[0].movie_version_id}
                      movieVersions={movieVersions}
                    />
                  </Text>
                  <FlatList
                    //keyExtractor={(item) => item.showtimes.id}
                    keyExtractor={(item, index) => index.toString()}
                    data={Object.values(item)}
                    numColumns={4}
                    renderItem={({item}) => (
                      <TouchableScale
                        activeScale={0.9}
                        tension={50}
                        friction={7}
                        useNativeDriver
                        onPress={() => [
                          setModalVisible(true),
                          setShowtimeId(item.showtime_id),
                        ]}
                        style={styles.showTime}>
                        <Text style={styles.showTimeText}>
                          {item.start_time.slice(11, 16)}
                        </Text>
                      </TouchableScale>
                    )}
                  />
                </View>
              )}
            />
          </View>
        )}
      />
    </View>
  );
};

export default ShowTimes;
