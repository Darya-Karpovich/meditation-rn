import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {SegmentedButtons, Text, ToggleButton} from 'react-native-paper';
import {StyledCard} from '../components/StyledCard';
import {getDatabase, ref, onValue} from 'firebase/database';

import {firebase} from '../../firebase';

// const meditations = [
//   {title: 'Sea | 3 min', image: '../../assets/images/sea.jpg'},
//   {title: 'Forest | 8 min', image: '../../assets/images/sea.jpg'},
//   {title: 'Mountains | 12 min', image: '../../assets/images/sea.jpg'},
// ];
export type Meditation = {
  title: string;
  duration: number;
  image: string;
};
export const MainScreen = () => {
  const [value, setValue] = useState('sound');
  const [meditations, setMeditations] = useState<Meditation[]>([]);

  useEffect(() => {
    firebase
      .firestore()
      .collection(value === 'sound' ? 'audio-meditations' : 'video-meditations')
      .get()
      .then(querySnapshot => {
        setMeditations(querySnapshot.docs.map(e => e.data()));
      });
    // setMeditations(data);
  }, [value]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meditations</Text>
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        theme={{roundness: 0, border: 'none', fontSize: 40}}
        // style={styles.toggleButtons}
        buttons={[
          {
            value: 'sound',
            label: 'Sound',
            checkedColor: '#A9CDC4',
            uncheckedColor: '#506962',
            style: {
              borderColor: '#F7EDE2',
              borderBottomColor: value === 'sound' ? '#A9CDC4' : '#506962',
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
              borderBottomColor: value === 'video' ? '#A9CDC4' : '#506962',
              borderBottomWidth: 5,
            },
          },
        ]}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {meditations.map((el, idx) => (
          <StyledCard
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
