import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Switch, View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { DateFormat, OrderStatus } from '../../common/Enums';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { OrderService } from '../../services/OrderService';
import { useSelector } from 'react-redux';
import { TiffinPlanetLoggedInUserStateSelector } from '../../common/redux/selectors';
import { TiffinPlanetUserSchema } from '../../common/Types';

const OrderSelection = () => {
  const [minimumDate, setMinimumDate] = useState<Date>();
  const [date, setDate] = useState<Date>();
  const tiffinPlanetLoggedInUser: TiffinPlanetUserSchema = useSelector(TiffinPlanetLoggedInUserStateSelector);

  // Set date
  const onDateChange = (date: any) => {
    setDate(moment(date).toDate());
  };

  // Confirm if you want tiffin or not
  const submitButtonPress = () => {
    Alert.alert(`Tiffin will not be provided on ${moment(date).format(DateFormat.UK)}`, 'Do you wish to confirm?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          postOrder();
        },
      },
    ]);
  };

  const postOrder = async () => {
    const orderPayload = {
      userId: tiffinPlanetLoggedInUser?._id,
      orderShipmentDate: date,
      status: OrderStatus.CANCELLED,
    };

    await OrderService.postOrder(orderPayload)
      .then((_response: any) => {
        Alert.alert(`Order successfully ${orderPayload.status?.toLowerCase()}.`);
      })
      .catch((error: any) => {
        console.error('🚀 ~ file: OrderSelection.tsx ~ line 50 ~ postOrder ~ error', error);
        Alert.alert(`Unable to update the order, please check the details again or contact support.`);
      });
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
    <ScrollView contentContainerStyle={styles.innerPage}>
      <View style={{ paddingBottom: 20 }}>
        {/* <Text variant="headlineLarge">Select the date you do not want the tiffin</Text> */}
        <Text style={styles.doNotWantTitle}>Select the date you do not want the tiffin</Text>
      </View>
      <View>
        <Button
          mode="text"
          onPress={() => {
            setDate(minimumDate);
          }}
        >
          Today
        </Button>
      </View>
      <View style={styles.datePickerView}>
        {minimumDate && date ? (
          <DateTimePicker
            style={styles.datePicker}
            testID="dateTimePicker"
            value={date}
            mode={'date'}
            minimumDate={minimumDate}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            is24Hour={false}
            onChange={(e, date) => onDateChange(date)}
          />
        ) : null}
      </View>
      <View style={styles.submitButton}>
        <Button style={styles.buttonSize} icon="login" mode="contained" onPress={submitButtonPress}>
          Submit
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  innerPage: {
    padding: 20,
    justifyContent: 'center',
    alignContent: 'center',
  },
  doNotWantTitle: {
    paddingTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonSize: {
    width: 230,
  },
  datePicker: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: 320,
    height: 260,
    display: 'flex',
  },
  datePickerView: {
    marginLeft: 40,
    paddingBottom: 20,
  },
  submitButton: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'row',
  },
});

export default OrderSelection;
