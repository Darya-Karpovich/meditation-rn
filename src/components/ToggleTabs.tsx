import React from 'react';
import {SegmentedButtons} from 'react-native-paper';
export const ToggleTabs = ({
  currentTab,
  setCurrentTab,
}: {
  currentTab: string;
  setCurrentTab: () => void;
}) => {
  return (
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
  );
};
