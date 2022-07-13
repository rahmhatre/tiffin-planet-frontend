import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { Text, ScrollView, StyleSheet, View, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MarkingProps } from 'react-native-calendars/src/calendar/day/marking';
import { Avatar, Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { DateFormat, OrderStatus } from '../../common/Enums';
import { TiffinPlanetLoggedInUserStateSelector } from '../../common/redux/selectors';
import { TiffinPlanetOrderSchema, TiffinPlanetUIOrderViewSchema, TiffinPlanetUserSchema } from '../../common/Types';
import { generateColor, getAvatarInitials, getUtcDate } from '../../common/utils/utils';
import { OrderService } from '../../services/OrderService';
import { UserService } from '../../services/UserService';

const OrderView = () => {
  // Minimum and Max Dates which are shows on the calendar
  const [minimumDate, setMinimumDate] = useState<string>(); // DateFormat.ISO8601 - YYYY-MM-DD
  const [maximumDate, setMaximumDate] = useState<string>(); // DateFormat.ISO8601 - YYYY-MM-DD

  // Selected Date from onChange event on Calendar
  const [selectedDate, setSelectedDate] = useState<string>(); // DateFormat.ISO8601 - YYYY-MM-DD

  // List of all my orders active or cancelled
  const [allUsers, setAllUsers] = useState<TiffinPlanetUserSchema[]>(); // Database schema which is stored in DB
  const [allOrdersForSelectedDate, setAllOrdersForSelectedDate] = useState<TiffinPlanetOrderSchema[]>(); // Database schema which is stored in DB

  // Mapped TiffinPlanetUIOrderViewSchema for the UI
  const [ordersToday, setOrdersToday] = useState<TiffinPlanetUIOrderViewSchema[]>(); // Database schema which is stored in DB

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
    // Set the selected date
    setSelectedDate(date);
  };

  const getUsers = async () => {
    await UserService.getUsers()
      .then((response: Array<TiffinPlanetUserSchema>) => {
        setAllUsers(response);
      })
      .catch((error: any) => {
        console.error('🚀 ~ file: OrderView.tsx ~ line 60 ~ getUsers ~ error', error);
        Alert.alert(`Unable to fetch your users.`);
      });
  };

  // Get all the orders for the logged in user
  const getOrders = async () => {
    await OrderService.getOrders({ orderShipmentDate: selectedDate })
      .then((response: Array<TiffinPlanetOrderSchema>) => {
        setAllOrdersForSelectedDate(response);
      })
      .catch((error: any) => {
        console.log('🚀 ~ file: OrderView.tsx ~ line 34 ~ getOrders ~ error', error);
        Alert.alert(`Unable to fetch your orders for the selected date.`);
      });
  };

  useEffect(() => {
    if (allUsers && allOrdersForSelectedDate) {
      const ordersToday: TiffinPlanetUIOrderViewSchema[] = allOrdersForSelectedDate?.map((order: TiffinPlanetOrderSchema) => ({
        ...order,
        user: allUsers.find((user: TiffinPlanetUserSchema) => user?._id === order?.userId),
        avatarColor: generateColor(),
      }));
      setOrdersToday(ordersToday);
    }
  }, [allUsers, allOrdersForSelectedDate]);

  // Get Orders for the selected date
  useEffect(() => {
    if (selectedDate) {
      getOrders();
    }
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

    // Get all the users registered
    getUsers();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.innerPage}>
      <View style={styles.titleWrapper}>
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
      <ScrollView>
        {ordersToday ? (
          <>
            <View style={styles.titleWrapper}>
              <Text style={styles.title}>Cancelled Orders</Text>
            </View>
            {ordersToday
              .filter((_filterOrder: TiffinPlanetUIOrderViewSchema) => _filterOrder?.status === OrderStatus.CANCELLED) // Filter only Cancelled Orders
              .map((order: TiffinPlanetUIOrderViewSchema, index: number) => (
                <View key={index} style={styles.cancelledOrdersView}>
                  {order?.user?.name ? <Avatar.Text color={'white'} style={{ backgroundColor: order?.avatarColor }} size={28} label={getAvatarInitials(order?.user?.name)} /> : null}
                  <Text style={{ marginLeft: order?.user?.name ? 10 : 0 }}>
                    {order?.user?.name} {order?.user?.email}
                  </Text>
                </View>
              ))}
          </>
        ) : null}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  innerPage: {
    padding: 20,
    justifyContent: 'center',
    alignContent: 'center',
  },
  titleWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  title: {
    paddingTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  datePickerView: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  cancelledOrdersView: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 5,
  },
});

export default OrderView;
