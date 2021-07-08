import 'dart:async';
import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:flutter_activity_recognition/flutter_activity_recognition.dart';

void main() {
  runApp(WowGymApp());
}

class WowGymApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'WoW Gym Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key? key, required this.title}) : super(key: key);

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {

  late IO.Socket socket = IO.io('http://192.168.2.37:1337', <String, dynamic>{'transports': ['websocket'], 'forceNew': true});

  final _activityStreamController = StreamController<Activity>();
  StreamSubscription<Activity>? _activityStreamSubscription;

  void _testWalk() {
    print('_testWalk');

    // if(socket.active) {
    //   socket.emit('device_walking_start');
    //   Future.delayed(const Duration(milliseconds: 2000), () {
    //     socket.emit('device_walking_stop');
    //   });
    // }

    // socket.on('fromServer', (_) => print(_));
    // setState(() {
    //   // This call to setState tells the Flutter framework that something has
    //   // changed in this State, which causes it to rerun the build method below
    //   // so that the display can reflect the updated values. If we changed
    //   // _counter without calling setState(), then the build method would not be
    //   // called again, and so nothing would appear to happen.
    //   _counter++;
    // });
  }

  @override
  Widget build(BuildContext context) {
    // This method is rerun every time setState is called, for instance as done
    // by the _incrementCounter method above.
    //
    // The Flutter framework has been optimized to make rerunning build methods
    // fast, so that you can just rebuild anything that needs updating rather
    // than having to individually change instances of widgets.
    socket.onConnect((_) {
      print('connect');
    });
    socket.on("fromServer", (_) {
      print('fromServer $_');
    });

    // socket.on('event', (data) => print(data));

    socket.onDisconnect((_) => print('disconnect'));

    socket.onConnectError((_) => print('Connect Error: ' + _.toString()));
    socket.onError((_) => print('Error: ' + _.toString()));
    socket.onReconnectError((_) => print('Reconnect Error: ' + _.toString()));

    socket.connect();

    this._startTrackingMovements();

    return Scaffold(
      appBar: AppBar(
        // Here we take the value from the MyHomePage object that was created by
        // the App.build method, and use it to set our appbar title.
        title: Text(widget.title),
      ),
      body: Center(
        // Center is a layout widget. It takes a single child and positions it
        // in the middle of the parent.
        child: Column(
          // Column is also a layout widget. It takes a list of children and
          // arranges them vertically. By default, it sizes itself to fit its
          // children horizontally, and tries to be as tall as its parent.
          //
          // Invoke "debug painting" (press "p" in the console, choose the
          // "Toggle Debug Paint" action from the Flutter Inspector in Android
          // Studio, or the "Toggle Debug Paint" command in Visual Studio Code)
          // to see the wireframe for each widget.
          //
          // Column has various properties to control how it sizes itself and
          // how it positions its children. Here we use mainAxisAlignment to
          // center the children vertically; the main axis here is the vertical
          // axis because Columns are vertical (the cross axis would be
          // horizontal).
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _testWalk,
        tooltip: 'Walk',
        child: Icon(Icons.add),
      ), // This trailing comma makes auto-formatting nicer for build methods.
    );
  }

  @override
  void dispose() {
    _activityStreamController.close();
    _activityStreamSubscription?.cancel();
    super.dispose();
  }

  void _startTrackingMovements() async {
    final activityRecognition = FlutterActivityRecognition.instance;

    // Check if the user has granted permission. If not, request permission.
    PermissionRequestResult reqResult;
    reqResult = await activityRecognition.checkPermission();
    if (reqResult == PermissionRequestResult.PERMANENTLY_DENIED) {
      print('Permission is permanently denied.');
      return;
    } else if (reqResult == PermissionRequestResult.DENIED) {
      reqResult = await activityRecognition.requestPermission();
      if (reqResult != PermissionRequestResult.GRANTED) {
        print('Permission is denied.');
        return;
      }
    }

    // Subscribe to the activity stream.
    _activityStreamSubscription = activityRecognition.activityStream
        .handleError(_handleError)
        .listen(_onActivityReceive);
  }

  void _onActivityReceive(Activity activity) {
    // _activityStreamController.sink.add(activity);
    if(activity.type == ActivityType.STILL) {
      socket.emit('device_walking_stop');
    }
    if(activity.confidence != ActivityConfidence.LOW) {
      switch(activity.type) {
      case ActivityType.WALKING:
      case ActivityType.RUNNING:
        socket.emit('device_walking_start');
        break;
        default:
          print('Activity Detected >> ${activity.toJson()}');
      }
    }
  }

  void _handleError(dynamic error) {
    print('Catch Error >> $error');
  }
}
