import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {SegmentedButtons, Text} from 'react-native-paper';
import {MeditationCard} from '../../components/MeditationCard';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import {fireStore} from '../../lib/firebase';
import {Query, collection} from 'firebase/firestore';
import {Meditation} from '../../types';

export const Home = () => {
  const [currentTab, setCurrentTab] = useState('sound');

  const [meditations] = useCollectionData<Meditation>(
    collection(
      fireStore,
      currentTab === 'sound' ? 'audio-meditations' : 'video-meditations',
    ) as Query<Meditation>,
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meditations</Text>
      <SegmentedButtons
        value={currentTab}
        onValueChange={setCurrentTab}
        theme={{roundness: 0, border: 'none', fontSize: 40}}
        buttons={[
          {
            value: 'sound',
            label: 'Sound',
            checkedColor: '#A9CDC4',
            uncheckedColor: '#506962',
            style: {
              borderColor: '#F7EDE2',
              borderBottomColor: currentTab === 'sound' ? '#A9CDC4' : '#506962',
              borderBottomWidth: 5,
            },
          },
          {
            value: 'video',
            label: 'Video',
            checkedColor: '#A9CDC4',
            uncheckedColor: '#506962',
            style: {
              borderColor: '#F7EDE2',
              borderBottomColor: currentTab === 'video' ? '#A9CDC4' : '#506962',
              borderBottomWidth: 5,
            },
          },
        ]}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {meditations?.map((el, idx) => (
          <MeditationCard
            key={idx}
            title={el.title}
            image={el.image}
            duration={el.duration}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F7EDE2',
  },
  scrollView: {
    width: '80%',
  },
  title: {
    marginTop: 20,
    fontFamily: 'Judson',
    fontWeight: 'bold',
    fontSize: 48,
    lineHeight: 56,
    color: '#B75755',
  },
  toggleButtons: {
    color: 'red',
    borderBottomColor: 'red',
  },
});
