import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {Button, Card} from 'react-native-paper';
import {Meditation} from '../screens/MainScreen';

export const StyledCard = ({title, image, duration}: Meditation) => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor(duration / 60);
  const seconds = duration - hours * 3600 - minutes * 60;
  const formatedTime =
    hours > 0
      ? hours + 'h' + minutes + 'm ' + seconds + 's'
      : minutes + 'm ' + seconds + 's';

  return (
    <Card style={styles.container}>
      <Card.Title
        style={styles.title}
        titleStyle={styles.titleText}
        title={title + ' | ' + formatedTime}
      />
      <Card.Actions style={styles.favoriteIcon}>
        <Button
          mode="text"
          style={styles.favoriteIcon}
          onPress={() => alert('ttt')}>
          <Image source={require('../../assets/images/heart.png')} />
        </Button>
      </Card.Actions>
      <Card.Cover style={styles.image} source={{uri: image}} />
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  title: {
    position: 'absolute',
    bottom: 0,
    zIndex: 1000,
    height: 60,
    width: '100%',
    backgroundColor: 'rgba(54, 51, 52, 0.8)',
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
  },
  titleText: {
    color: '#F7EDE2',
    fontSize: 24,
  },
  favoriteIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    border: 'none',
    zIndex: 1000,
    // backgroundColor: '#ddd'
  },
  image: {
    marginTop: -16,
    // position: 'absolute',
    zIndex: 1,
  },
});
