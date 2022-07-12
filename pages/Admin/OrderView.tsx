import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { Text, ScrollView, StyleSheet, View, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MarkingProps } from 'react-native-calendars/src/calendar/day/marking';
import { Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { DateFormat } from '../../common/Enums';
import { TiffinPlanetLoggedInUserStateSelector } from '../../common/redux/selectors';
import { TiffinPlanetOrderSchema, TiffinPlanetUserSchema } from '../../common/Types';
import { getUtcDate } from '../../common/utils/utils';
import { OrderService } from '../../services/OrderService';

const OrderView = () => {
  // Minimum and Max Dates which are shows on the calendar
  const [minimumDate, setMinimumDate] = useState<string>(); // DateFormat.ISO8601 - YYYY-MM-DD
  const [maximumDate, setMaximumDate] = useState<string>(); // DateFormat.ISO8601 - YYYY-MM-DD

  // Selected Date from onChange event on Calendar
  const [selectedDate, setSelectedDate] = useState<string>(); // DateFormat.ISO8601 - YYYY-MM-DD

  // List of all my orders active or cancelled
  const [allOrdersForSelectedDate, setAllOrdersForSelectedDate] = useState<TiffinPlanetOrderSchema[]>(); // Database schema which is stored in DB
  const [markedDates, setMarkedDates] = useState<Record<string, MarkingProps>>();
  const tiffinPlanetLoggedInUser: TiffinPlanetUserSchema = useSelector(TiffinPlanetLoggedInUserStateSelector);

  // Marked dates which will highlight the active and cancelled orders in the calendar
  const marked = useMemo(() => {
    const isoSelectedDate = moment(selectedDate).format(DateFormat.ISO8601);
    return {
      ...markedDates,
      [isoSelectedDate]: {
        selected: true,
        disableTouchEvent: true,
        selectedColor: 'orange',
        selectedTextColor: 'red',
      },
    };
  }, [selectedDate, markedDates]);

  // Set date
  const onDateSelection = (date: string) => {
    // Check if we already have a cancelled order for the selected date.
    // const dateFound = allMyUpdatedOrders?.find((order: TiffinPlanetOrderSchema) => moment(order?.orderShipmentDate).format(DateFormat.UK) === moment(date).format(DateFormat.UK));
    // setSelectedDateOrderExist(dateFound);

    // Set the selected date
    setSelectedDate(date);
  };

  // Get all the orders for the logged in user
  const getOrders = async () => {
    // { orderShipmentDate: tiffinPlanetLoggedInUser?._id }
    await OrderService.getOrders({ orderShipmentDate: selectedDate })
      .then((response: Array<TiffinPlanetOrderSchema>) => {
        console.log('🚀 ~ file: OrderView.tsx ~ line 30 ~ .then ~ response', response);
      })
      .catch((error: any) => {
        console.log('🚀 ~ file: OrderView.tsx ~ line 34 ~ getOrders ~ error', error);
        Alert.alert(`Unable to fetch your orders for the selected date.`);
      });
  };

  // Get Orders for the selected date
  useEffect(() => {
    getOrders();
  }, [selectedDate]);

  // Set the minimum date of the date picker
  useEffect(() => {
    const nineAMToday = getUtcDate(9);
    const isTimeAfterNineAM = moment().isSameOrAfter(nineAMToday);
    if (isTimeAfterNineAM) {
      const tomorrow = nineAMToday.add(1, 'days').format(DateFormat.ISO8601);
      setMinimumDate(tomorrow);
      setSelectedDate(tomorrow);
      setMaximumDate(moment().add(1, 'days').add(2, 'months').format(DateFormat.ISO8601));
    } else {
      const today = nineAMToday.format(DateFormat.ISO8601);
      setMinimumDate(today);
      setSelectedDate(today);
      setMaximumDate(moment().add(2, 'months').format(DateFormat.ISO8601));
    }

    // Get all orders for the selected date
    getOrders();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.innerPage}>
      <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: 20 }}>
        <Text style={styles.title}>Select the date to see orders</Text>
      </View>
      <View>
        <Button
          mode="text"
          onPress={() => {
            setSelectedDate(minimumDate);
          }}
        >
          Today
        </Button>
      </View>
      <View style={styles.datePickerView}>
        {minimumDate && selectedDate ? (
          <Calendar
            style={{ borderWidth: 1, borderRadius: 5 }}
            // Initially visible month. Default = now
            initialDate={selectedDate}
            // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
            minDate={minimumDate}
            maxDate={maximumDate}
            // Handler which gets executed on day press. Default = undefined
            onDayPress={(day) => {
              onDateSelection(day?.dateString);
            }}
            // Do not show days of other months in month page. Default = false
            hideExtraDays={true}
            // Handler which gets executed when press arrow icon left. It receive a callback can go back month
            onPressArrowLeft={(subtractMonth) => subtractMonth()}
            // Handler which gets executed when press arrow icon right. It receive a callback can go next month
            onPressArrowRight={(addMonth) => addMonth()}
            // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
            disableAllTouchEventsForDisabledDays={true}
            markedDates={marked}
          />
        ) : null}
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
  title: {
    paddingTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonSize: {
    width: 230,
  },
  datePickerView: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  submitButton: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'row',
  },
  orderAlreadyExists: {
    paddingTop: 10,
    paddingBottom: 20,
    marginLeft: 20,
  },
  orderAlreadyExistsText: {
    fontSize: 16,
  },
});

export default OrderView;
