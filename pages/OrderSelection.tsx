import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Switch, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { DateFormat } from '../common/Enums';

const OrderSelection = () => {
  const [minimumDate, setMinimumDate] = useState<Date>();
  const [date, setDate] = useState<Date>();
  const [toggle, setToggle] = useState<boolean>(false);

  // Set date
  const onDateChange = (date: any) => {
    setDate(moment(date).toDate());
  };

  // Toggle tiffin setting
  const toggleChange = () => {
    setToggle((prevState) => !prevState);
  };

  // Confirm if you want tiffin or not
  const submitButtonPress = () => {
    if (!toggle) {
      Alert.alert(`Please toggle the switch for confirming your unavailibility for the selected date ${moment(date).format(DateFormat.UK)}`);
    } else {
      Alert.alert(`Tiffin will ${toggle ? 'not ' : ''}be provided on ${moment(date).format(DateFormat.UK)}`, 'Do you wish to confirm?', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
    }
    // TODO: API Call to collect this data
  };

  // Set the minimum date of the date picker
  useEffect(() => {
    const now = moment().hour(9);
    if (moment().isAfter(now)) {
      const tomorrow = moment().day(1).toDate();
      setMinimumDate(tomorrow);
      setDate(tomorrow);
    } else {
      const today = moment().toDate();
      setMinimumDate(today);
      setDate(today);
    }
  }, []);

  return (
    <View style={styles.innerPage}>
      <Text style={styles.doNotWantTitle}>Select the date you do not want the tiffin:</Text>
      {minimumDate && date ? (
        <DateTimePicker testID="dateTimePicker" value={date} mode={'date'} minimumDate={minimumDate} display="clock" is24Hour={true} onChange={(e, date) => onDateChange(date)} />
      ) : null}
      <Switch trackColor={{ false: '#767577', true: '#b01105' }} ios_backgroundColor="#3e3e3e" onValueChange={toggleChange} value={toggle} />
      <Button onPress={submitButtonPress} title="Submit" color="#841584" accessibilityLabel="Learn more about this purple button" />
    </View>
  );
};

const styles = StyleSheet.create({
  innerPage: {
    display: 'flex',
    justifyContent: 'flex-start',
    width: '100%',
  },
  doNotWantTitle: {
    paddingTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderSelection;
