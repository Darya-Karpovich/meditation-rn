import React, {useEffect, useState} from 'react';
import {Image, ImageBackground, StyleSheet, View} from 'react-native';
import {Appbar, Button, Text} from 'react-native-paper';
import {Meditation, NavigationScreenProps, Routes} from '../types';
import TrackPlayer from 'react-native-track-player';
import {
  useCollectionData,
  useDocumentData,
} from 'react-firebase-hooks/firestore';
import {
  DocumentReference,
  Query,
  collection,
  doc,
  limit,
  orderBy,
  query,
  startAfter,
} from 'firebase/firestore';
import {Collections, fireStore} from '../lib/firebase';
import {MeditationSortBy} from '../lib/consts';

export const MeditationScreen = ({
  navigation,
  route,
}: NavigationScreenProps<Routes.Meditation>) => {
  const {id, nextId, prevId} = route.params;

  const audioCollection = collection(fireStore, Collections.AudioMeditation);
  const currentMeditationDocRef = doc(
    fireStore,
    Collections.AudioMeditation,
    id,
  );

  const [action, setAction] = useState('play');

  const [meditation, loadingCurrentMeditation] = useDocumentData<Meditation>(
    currentMeditationDocRef as DocumentReference<Meditation>,
  );

  const [prevMeditations, loadingPrev] = useCollectionData<Meditation>(
    query(
      audioCollection,
      orderBy(MeditationSortBy.CreatedAt, 'asc'),
      startAfter(meditation?.createdAt ?? new Date()),
      limit(1),
    ) as Query<Meditation>,
  );

  const [nextMeditations, loadingNext] = useCollectionData<Meditation>(
    query(
      audioCollection,
      orderBy(MeditationSortBy.CreatedAt, 'desc'),
      startAfter(meditation?.createdAt ?? new Date()),
      limit(1),
    ) as Query<Meditation>,
  );

  // TrackPlayer.getQueue().then(e => console.log(e.length));

  useEffect(() => {
    if (!meditation) {
      return;
    }

    console.log(meditation.id)

    const addPlayToTrack = async () => {
      await TrackPlayer.reset();
      await TrackPlayer.add([
        {
          // id: meditation.id, FIXME
          url: meditation.url ?? Date.now().toString(),
          artist: 'Unknown',
          title: meditation.title,
        },
      ]);
    };

    addPlayToTrack();
  }, [meditation]);

  const loading = loadingNext || loadingPrev || loadingCurrentMeditation;

  const prevMeditation = prevMeditations?.pop();
  const nextMeditation = nextMeditations?.pop();

  console.log(
    meditation,
    nextMeditations?.map(e => e.id),
    prevMeditations?.map(e => e.id),
  );

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!meditation) {
    return <Text>Meditation not found</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Appbar.Header style={styles.appBar}>
          <Appbar.BackAction
            color="#F7EDE2"
            onPress={() => {
              TrackPlayer.reset();
              navigation.navigate(Routes.Home);
            }}
          />
          <Appbar.Content title={meditation.title} titleStyle={styles.title} />
          <Button mode="text">
            <Image source={require('../../assets/images/heart.png')} />
          </Button>
        </Appbar.Header>

        <View style={styles.backgroundLight}>
          <ImageBackground
            source={{uri: meditation.image}}
            resizeMode="cover"
            imageStyle={styles.image}
            style={styles.imageView}>
            <Text> TIMER</Text>
          </ImageBackground>
          <View style={styles.bottomContainer}>
            <Button
              mode="text"
              onPress={() => {
                if (prevMeditation && prevId) {
                  navigation.navigate(Routes.Meditation, {
                    id: prevId,
                    nextId: id,
                    prevId: prevMeditation.id,
                  });
                }
              }}>
              <Image
                style={styles.playerButton}
                source={require('../../assets/images/previous.png')}
              />
            </Button>
            {action === 'play' ? (
              <Button
                mode="text"
                onPress={() => {
                  TrackPlayer.play();
                  setAction('stop');
                }}>
                <Image
                  style={styles.playerButton}
                  source={require('../../assets/images/play.png')}
                />
              </Button>
            ) : (
              <Button
                mode="text"
                onPress={() => {
                  TrackPlayer.pause();
                  setAction('play');
                }}>
                <Image source={require('../../assets/images/stop.png')} />
              </Button>
            )}
            <Button
              mode="text"
              onPress={() => {
                if (nextMeditation && nextId) {
                  navigation.setParams({
                    id: nextId,
                    prevId: id,
                    nextId: nextMeditation.id,
                  });
                }
              }}>
              <Image source={require('../../assets/images/next.png')} />
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: 'rgba(132, 165, 157, 0.5)',
    marginTop: 0,
  },
  title: {
    fontFamily: 'Judson',
    fontWeight: 'bold',
    fontSize: 40,
    lineHeight: 47,
    color: '#F7EDE2',
  },
  container: {flex: 1},
  innerContainer: {
    display: 'flex',
    width: '100%',
    height: '100%',
    backgroundColor: '#84A59D',
  },
  imageView: {
    width: 280,
    alignSelf: 'center',
    height: 400,
    marginBottom: 100,
  },
  image: {
    borderRadius: 20,
  },
  backgroundLight: {
    display: 'flex',
    backgroundColor: '#BEBAB1',
    marginBottom: 0,
    height: 400,
    marginTop: 'auto',
    justifyContent: 'flex-end',
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
  },
  bottomContainer: {
    flexDirection: 'row',
    display: 'flex',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 0,
    backgroundColor: '#506962',
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
  },
  button: {
    width: 200,
    margin: 20,
  },
  playerButton: {
    // height: 60,
    // width: 50,
  },
});
