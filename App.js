import React, { Component } from 'react';
import {
    Platform,
    Text,
    View,
} from 'react-native';

import FCM, {
    FCMEvent,
    WillPresentNotificationResult,
    NotificationType,
} from "react-native-fcm";

export default class App extends Component {
    async componentWillMount() {
        // herhangi bir bildirim etkileşiminde çalışır
        FCM.on(FCMEvent.Notification, notif => {
            console.log("Bildirim geldi", notif);

            if(Platform.OS ==='ios' && notif._notificationType === NotificationType.WillPresent && !notif.local_notification){
                // Bu bildirim yalnızca kullanıcı ön planda ise bildirimi göstermek isteyip istemediğinize karar vermektir.
                // genellikle görmezden gelebilirsiniz. sadece göster/gösterme yapar.
                notif.finish(WillPresentNotificationResult.All)
                return;
            }
        });

        // eğer token yenilenirse çalışır
        FCM.on(FCMEvent.RefreshToken, token => {
            console.log("TOKEN YENİLENDİ (refreshUnsubscribe)", token);
        });

        // Uygulamaya Push atmak için izin alıyoruz
        try {
            let result = await FCM.requestPermissions({badge: false, sound: true, alert: true});
        } catch(e){
            console.error(e);
        }

        // Firebase Cloud Message Token değerini getirir.
        FCM.getFCMToken().then(token => {
            console.log("TOKEN (getFCMToken)", token);
        });

        if(Platform.OS === 'ios') {
            // Eğer APNS istiyorsanız isteğe bağlı APNS TOKEN
            FCM.getAPNSToken().then(token => {
                console.log("APNS TOKEN (getAPNSToken)", token);
            });
        }
    }

    render() {
        return (
            <View>
                <Text>
                    React Native Firebase Push Notification Kurulumu Uygulaması.
                    Daha fazla bilgi için: <Text style={{color: 'blue'}}>github.com/abdurrahmanekr/rnpushapp</Text>
                </Text>
            </View>
        );
    }
}