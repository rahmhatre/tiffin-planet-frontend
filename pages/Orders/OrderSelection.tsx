import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Switch, View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { DateFormat, OrderStatus } from '../../common/Enums';
import { OrderService } from '../../services/OrderService';
import { useSelector } from 'react-redux';
import { TiffinPlanetLoggedInUserStateSelector } from '../../common/redux/selectors';
import { TiffinPlanetOrderSchema, TiffinPlanetUserSchema } from '../../common/Types';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { MarkingProps } from 'react-native-calendars/src/calendar/day/marking';
import moment, { isDate } from 'moment';
import { toPascalCase } from '../../common/utils/utils';

const OrderSelection = () => {
  const [minimumDate, setMinimumDate] = useState<Date>();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [allMyUpdatedOrders, setAllMyUpdatedOrders] = useState<TiffinPlanetOrderSchema[]>(); // Database schema which is stored in DB
  const [selectedDateOrderExist, setSelectedDateOrderExist] = useState<TiffinPlanetOrderSchema | undefined>(undefined);
  const [markedDates, setMarkedDates] = useState<Record<string, MarkingProps>>();
  const tiffinPlanetLoggedInUser: TiffinPlanetUserSchema = useSelector(TiffinPlanetLoggedInUserStateSelector);

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
  const onDateSelection = (date: any) => {
    const selectedDate = moment(date).toDate();

    // Check if we already have a cancelled order for the selected date.
    const dateFound = allMyUpdatedOrders?.find((order: TiffinPlanetOrderSchema) => moment(order?.orderShipmentDate).format(DateFormat.UK) === moment(selectedDate).format(DateFormat.UK));
    setSelectedDateOrderExist(dateFound);

    // Set the selected date
    setSelectedDate(selectedDate);
  };

  // Build the marked dates array from the users cancelled orders
  const getMarkedDates = (orders: TiffinPlanetOrderSchema[]) => {
    let markedDates: Record<string, MarkingProps> = {};
    orders.forEach((order: TiffinPlanetOrderSchema) => {
      if (!moment(order?.orderShipmentDate).isValid()) {
        return;
      }
      markedDates[moment(order?.orderShipmentDate).format(DateFormat.ISO8601)] = {
        marked: true,
        dotColor: order?.status === OrderStatus.CANCELLED ? 'red' : 'green',
      };
    });
    setMarkedDates(markedDates);
  };

  // Confirm if you want tiffin or not
  const submitButtonPress = () => {
    Alert.alert(`Tiffin will not be provided on ${moment(selectedDate).format(DateFormat.UK)}`, 'Do you wish to confirm?', [
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

  // Mark the status as cancelled
  const postOrder = async () => {
    // Default state is Cancelled
    let processedStatus = OrderStatus.CANCELLED;
    if (selectedDateOrderExist?.status === OrderStatus.CANCELLED) {
      processedStatus = OrderStatus.ACTIVE;
    }

    const orderPayload = {
      userId: tiffinPlanetLoggedInUser?._id, // UserId which is stored in the Mongo DB
      orderShipmentDate: selectedDate,
      status: processedStatus,
    };

    await OrderService.postOrder(orderPayload)
      .then((_response: any) => {
        Alert.alert(`Order successfully ${orderPayload.status?.toLowerCase()}.`);
      })
      .catch((error: any) => {
        console.error('🚀 ~ file: OrderSelection.tsx ~ line 50 ~ postOrder ~ error', error);
        Alert.alert(`Unable to update the order, please check the details again or contact support.`);
      });
    getOrders();
  };

  // Get all the orders for the logged in user
  const getOrders = async () => {
    await OrderService.getOrders({ userId: tiffinPlanetLoggedInUser?._id })
      .then((response: Array<TiffinPlanetOrderSchema>) => {
        setAllMyUpdatedOrders(response);
        getMarkedDates(response);
      })
      .catch((error: any) => {
        console.error('🚀 ~ file: OrderSelection.tsx ~ line 62 ~ getOrders ~ error', error);
        Alert.alert(`Unable to fetch your order.`);
      });
  };

  // Set the current date selection to be the minimum date or today when all updated orders are populated
  useEffect(() => {
    onDateSelection(minimumDate);
  }, [allMyUpdatedOrders]);

  // Set the minimum date of the date picker
  useEffect(() => {
    const now = moment().hour(9);
    if (moment().isAfter(now)) {
      const tomorrow = moment().day(1).toDate();
      setMinimumDate(tomorrow);
      setSelectedDate(tomorrow);
    } else {
      const today = moment().toDate();
      setMinimumDate(today);
      setSelectedDate(today);
    }

    // Get all the orders on page load
    getOrders();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.innerPage}>
      <View style={{ marginLeft: 20, paddingBottom: 20 }}>
        <Text style={styles.doNotWantTitle}>Select the date you do not want the tiffin</Text>
      </View>
      {/* <View>
        <Button
          mode="text"
          onPress={() => {
            setDate(minimumDate);
          }}
        >
          Today
        </Button>
      </View> */}
      <View style={styles.datePickerView}>
        {minimumDate && selectedDate ? (
          <Calendar
            // Initially visible month. Default = now
            initialDate={moment(minimumDate).format(DateFormat.ISO8601)}
            // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
            minDate={moment(minimumDate).format(DateFormat.ISO8601)}
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
      {selectedDateOrderExist ? (
        <View style={styles.orderAlreadyExists}>
          <Text style={styles.orderAlreadyExistsText}>Order status is {selectedDateOrderExist?.status?.toLowerCase()} for the selected date.</Text>
          <Text style={styles.orderAlreadyExistsText}>Do you wish to {selectedDateOrderExist?.status === OrderStatus.CANCELLED ? 'activate' : 'cancel'} your order.</Text>
        </View>
      ) : null}

      <View style={styles.submitButton}>
        <Button style={styles.buttonSize} icon="login" mode="contained" onPress={submitButtonPress}>
          {selectedDateOrderExist?.status === OrderStatus.CANCELLED ? 'Activate' : 'Cancel'}
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

export default OrderSelection;
